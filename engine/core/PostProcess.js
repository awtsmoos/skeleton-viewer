// B"H
export const VS_POST = `
  attribute vec2 aVertexPosition;
  varying vec2 vUV;
  void main() {
    vUV = aVertexPosition * 0.5 + 0.5;
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  }
`;

export const FS_POST = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec2 vUV;

  // Effects
  uniform float uBloom;
  uniform float uGrain;
  
  // God Rays
  uniform vec2 uSunPosScreen; 
  uniform float uGodRayDensity;

  // Cinematic
  // ACES Tone Mapping
  vec3 aces(vec3 x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUV;
    
    // --- CHROMATIC ABERRATION ---
    float dist = length(uv - 0.5);
    vec3 color;
    color.r = texture2D(uTexture, uv + vec2(0.003 * dist, 0.0)).r;
    color.g = texture2D(uTexture, uv).g;
    color.b = texture2D(uTexture, uv - vec2(0.003 * dist, 0.0)).b;

    // --- GOD RAYS (Volumetric Scattering) ---
    if (uGodRayDensity > 0.0) {
        int samples = 20;
        float decay = 0.96;
        float density = 0.6;
        float weight = 0.05;
        
        vec2 deltaTextCoord = vec2(uv - uSunPosScreen);
        deltaTextCoord *= 1.0 / float(samples) * density;
        
        vec2 coord = uv;
        float illuminationDecay = 1.0;
        vec3 scattering = vec3(0.0);
        
        for(int i=0; i < 20; i++) {
            coord -= deltaTextCoord;
            vec3 samp = texture2D(uTexture, coord).rgb;
            samp *= smoothstep(0.7, 1.0, length(samp)); 
            scattering += samp * illuminationDecay * weight;
            illuminationDecay *= decay;
        }
        color += scattering * uGodRayDensity;
    }

    // --- BLOOM (Simple additive) ---
    vec3 bloom = max(color - 0.7, 0.0);
    color += bloom * 1.5;

    // --- CINEMATIC GRADING (Teal & Orange) ---
    // Push shadows towards teal, highlights towards orange
    vec3 teal = vec3(0.0, 0.2, 0.3);
    vec3 orange = vec3(0.4, 0.2, 0.0);
    
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    
    vec3 shadowTint = mix(color, color + teal, (1.0 - lum) * 0.3);
    vec3 highlightTint = mix(shadowTint, shadowTint + orange, lum * 0.3);
    
    color = highlightTint;

    // --- ACES TONE MAPPING ---
    color = aces(color);

    // --- FILM GRAIN ---
    float grain = (fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * uGrain;
    color += grain;

    // --- VIGNETTE ---
    float vig = 1.0 - smoothstep(0.4, 1.4, dist);
    color *= vig;
    
    // --- GAMMA CORRECTION ---
    color = pow(color, vec3(1.0/2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export class PostProcess {
    constructor(gl) {
        this.gl = gl;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        
        // Framebuffer
        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        
        // Texture
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        
        // Depth Buffer
        this.rb = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rb);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rb);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        this.program = this.createProgram(gl, VS_POST, FS_POST);
    }
    
    resize(w, h) {
        this.width = w; 
        this.height = h;
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.rb);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    }

    createProgram(gl, vs, fs) {
        const p = gl.createProgram();
        const v = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(v, vs); gl.compileShader(v);
        const f = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(f, fs); gl.compileShader(f);
        gl.attachShader(p, v); gl.attachShader(p, f);
        gl.linkProgram(p);
        return p;
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
        this.gl.viewport(0,0,this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    render(time) {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0,0,this.width, this.height);
        gl.useProgram(this.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(this.program, 'uTexture'), 0);
        
        gl.uniform1f(gl.getUniformLocation(this.program, 'uTime'), time);
        gl.uniform1f(gl.getUniformLocation(this.program, 'uBloom'), 1.0); 
        gl.uniform1f(gl.getUniformLocation(this.program, 'uGrain'), 0.05); 
        
        // Calculate sun screen pos based on time (approx)
        const dayDuration = 60.0;
        const timeOfDay = (time % dayDuration) / dayDuration; 
        const angle = timeOfDay * Math.PI * 2;
        gl.uniform2f(gl.getUniformLocation(this.program, 'uSunPosScreen'), 0.5 + Math.cos(angle)*0.4, 0.5 + Math.sin(angle)*0.4);
        gl.uniform1f(gl.getUniformLocation(this.program, 'uGodRayDensity'), 1.0); 
        
        const aPos = gl.getAttribLocation(this.program, 'aVertexPosition');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPos);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}