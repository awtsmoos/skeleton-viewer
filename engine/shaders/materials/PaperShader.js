// B"H
import { NOISE_GLSL, COMMON_UNIFORMS } from '../chunks.js';

export const VS_PAPER = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  ${COMMON_UNIFORMS}
  varying vec3 vPos;
  varying vec2 vUV;
  
  void main() {
    vPos = aVertexPosition.xyz;
    // Map -1..1 plane to 0..1 UV
    vUV = aVertexPosition.xy * 0.5 + 0.5;
    
    // Standard transform
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
  }
`;

export const FS_PAPER = `
  precision highp float;
  ${COMMON_UNIFORMS}
  varying vec3 vPos;
  varying vec2 vUV;
  
  ${NOISE_GLSL}

  void main() {
    vec2 uv = vUV;
    vec3 color = uColor;
    
    // --- 1. PAPER TEXTURE ---
    // Subtle grain
    float grain = snoise(vec3(uv * 50.0, 0.0)) * 0.05;
    color += grain;
    
    // --- 2. OUTLINE EFFECT ---
    // Since we are drawing simple quads, we can simulate an outline 
    // by checking distance from UV edge.
    float edgeX = min(uv.x, 1.0 - uv.x);
    float edgeY = min(uv.y, 1.0 - uv.y);
    float edge = min(edgeX, edgeY);
    
    // Outline thickness
    float thick = 0.05; 
    if (edge < thick) {
        color = vec3(0.0, 0.0, 0.0); // Black outline
    }
    
    // --- 3. PROCEDURAL SHAPES (If using sprite generator) ---
    // We can use a uniform to toggle this or infer from object properties.
    // For now, assume 'CutoutGen' uses standard Rectangles.
    
    // Optional: Paper unevenness/cut edges
    float cutNoise = snoise(vec3(uv * 10.0, 1.0)) * 0.01;
    if (edge + cutNoise < 0.01) discard; // Rough edges

    // No lighting calculations (Unlit / Flat)
    gl_FragColor = vec4(color, 1.0);
  }
`;
