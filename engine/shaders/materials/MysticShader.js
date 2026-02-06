// B"H
import { NOISE_GLSL } from '../chunks/noise.glsl.js';

export const VS_MYSTIC = `
  attribute vec4 aPos;
  attribute vec3 aNorm;
  uniform mat4 uProj;
  uniform mat4 uView;
  uniform mat4 uModel;
  varying vec3 vPos;
  varying vec3 vNormal;
  
  void main() {
    vPos = aPos.xyz;
    vNormal = mat3(uModel) * aNorm;
    gl_Position = uProj * uView * uModel * aPos;
  }
`;

export const FS_MYSTIC = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uCol;
  uniform int uMatType; 
  varying vec3 vPos;
  varying vec3 vNormal;
  
  ${NOISE_GLSL}

  void main() {
    vec3 color = uCol;
    float alpha = 1.0;

    // Merkabah / Portal logic
    float dist = length(vPos.xy);
    float angle = atan(vPos.y, vPos.x);
    float spiral = sin(angle * 5.0 - dist * 10.0 + uTime * 5.0);
    color = mix(uCol, vec3(1.0), spiral * 0.5 + 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`;