// B"H
export const VS_SKY = `
  attribute vec4 aVertexPosition;
  varying vec3 vWorldPos;
  void main() {
    vec4 pos = aVertexPosition;
    pos.z = 1.0; 
    gl_Position = pos;
    vWorldPos = aVertexPosition.xyz; 
  }
`;

export const FS_SKY = `
  precision highp float;
  varying vec3 vWorldPos;
  
  uniform vec3 uSunPos;
  uniform float uTime;
  
  void main() {
    vec3 dir = normalize(vWorldPos); 
    float y = dir.y;
    
    // Day/Night colors
    vec3 skyBlue = vec3(0.3, 0.6, 0.9);
    vec3 skyDark = vec3(0.05, 0.05, 0.1);
    vec3 horizon = vec3(0.7, 0.7, 0.8);
    vec3 sunset = vec3(0.9, 0.6, 0.3);
    
    // Sun
    float sunY = uSunPos.y;
    float sunIntensity = max(dot(dir, normalize(uSunPos)), 0.0);
    float sunDisk = step(0.998, sunIntensity);
    float sunGlow = pow(sunIntensity, 20.0);
    
    vec3 finalSky;
    if (sunY > 0.1) finalSky = mix(horizon, skyBlue, max(y, 0.0));
    else if (sunY > -0.1) finalSky = mix(sunset, skyDark, max(y, 0.0));
    else finalSky = mix(vec3(0.0), skyDark, max(y, 0.0));
    
    finalSky += vec3(1.0, 0.9, 0.7) * sunDisk;
    finalSky += vec3(1.0, 0.8, 0.5) * sunGlow * 0.5;

    // --- THE COVENANT (RAINBOW) ---
    // A rainbow appears opposite the sun.
    vec3 antiSun = -normalize(uSunPos);
    float angleToAntiSun = dot(dir, antiSun);
    // Rainbow is approx 40-42 degrees from anti-solar point.
    // cos(42 deg) ~= 0.74
    
    float rainbowArc = smoothstep(0.73, 0.74, angleToAntiSun) * (1.0 - smoothstep(0.75, 0.76, angleToAntiSun));
    
    if (rainbowArc > 0.0 && sunY > 0.0) {
        // Spectrum
        float t = (angleToAntiSun - 0.73) / 0.03; // 0..1 across arc
        vec3 spectrum = vec3(
            smoothstep(0.5, 0.2, abs(t - 0.2)), // Red
            smoothstep(0.5, 0.2, abs(t - 0.5)), // Green
            smoothstep(0.5, 0.2, abs(t - 0.8))  // Blue
        );
        finalSky += spectrum * rainbowArc * 0.5; // Additive blend
    }
    
    gl_FragColor = vec4(finalSky, 1.0);
  }
`;