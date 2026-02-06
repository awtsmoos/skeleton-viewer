// B"H
const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) ); vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i); 
  vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}
`;

export const UBER_VS = `
    attribute vec4 aPos;
    attribute vec3 aNorm;
    uniform mat4 uProj;
    uniform mat4 uView;
    uniform mat4 uModel;
    varying vec3 vNorm;
    varying vec3 vPos;
    void main() {
        vec4 worldPos = uModel * aPos;
        gl_Position = uProj * uView * worldPos;
        vNorm = mat3(uModel) * aNorm;
        vPos = worldPos.xyz;
    }
`;

export const UBER_FS = `
    precision highp float;
    varying vec3 vNorm;
    varying vec3 vPos;
    uniform vec3 uCol;
    uniform float uTime;
    uniform vec3 uCamPos;
    uniform int uMatType; // 0=std, 1=ground, 2=grass, 3=water
    
    ${NOISE_GLSL}
    
    void main() {
        vec3 n = normalize(vNorm);
        vec3 lightDir = normalize(vec3(0.5, 0.8, 0.3));
        float diff = max(dot(n, lightDir), 0.0);
        
        vec3 viewDir = normalize(uCamPos - vPos);
        vec3 reflectDir = reflect(-lightDir, n);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        
        vec3 baseCol = uCol;

        if (uMatType == 1) { // Ground
            float dirt = snoise(vPos.xyz * 0.5) * 0.5 + 0.5;
            float rock = snoise(vPos.xyz * 2.0) * 0.5 + 0.5;
            baseCol = mix(vec3(0.4,0.3,0.1), vec3(0.2), rock) * dirt;
        } else if (uMatType == 2) { // Grass
            baseCol *= 0.8 + snoise(vPos.xyz * 10.0)*0.2;
        } else if (uMatType == 3) { // Water
            float wave = snoise(vec3(vPos.x*0.5, vPos.z*0.5, uTime*0.5));
            baseCol = mix(vec3(0.0, 0.2, 0.6), vec3(0.2, 0.5, 1.0), wave * 0.5 + 0.5);
            vec3 n_water = normalize(vNorm + vec3(wave, 0.0, 0.0));
            spec = pow(max(dot(viewDir, reflect(-lightDir, n_water)), 0.0), 64.0);
        }

        vec3 finalCol = baseCol * (diff * 0.7 + 0.3) + vec3(0.5)*spec;

        gl_FragColor = vec4(finalCol, 1.0);
    }
`;

export const SKY_VS = `
    attribute vec4 aPos;
    uniform mat4 uView;
    uniform mat4 uProj;
    varying vec3 vWorldPos;
    void main() {
      vec4 pos = uProj * uView * vec4(aPos.xyz, 0.0);
      gl_Position = pos.xyww;
      vWorldPos = aPos.xyz;
    }
`;

export const SKY_FS = `
    precision highp float;
    varying vec3 vWorldPos;
    uniform vec3 uSunPos;
    void main() {
      vec3 dir = normalize(vWorldPos);
      float y = max(dir.y, 0.0);
      
      vec3 skyBlue = vec3(0.3, 0.5, 0.8);
      vec3 horizon = vec3(0.7, 0.8, 0.9);
      vec3 sunset = vec3(1.0, 0.6, 0.2);
      
      vec3 daySky = mix(horizon, skyBlue, y);
      float sunPhase = smoothstep(-0.1, 0.1, uSunPos.y);
      vec3 finalSky = mix(sunset, daySky, sunPhase);

      float sunIntensity = pow(max(dot(dir, normalize(uSunPos)), 0.0), 200.0);
      finalSky += vec3(1.0, 0.9, 0.7) * sunIntensity;
      
      gl_FragColor = vec4(finalSky, 1.0);
    }
`;