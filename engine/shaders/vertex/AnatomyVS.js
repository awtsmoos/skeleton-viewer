// B"H
import { NOISE_GLSL } from '../chunks/noise.glsl.js';

export const VS_ANATOMY = `
  attribute vec4 aPos;
  attribute vec3 aNorm;
  
  uniform mat4 uProj;
  uniform mat4 uView;
  uniform mat4 uModel;
  uniform float uTime;
  uniform int uMatType; // 0=Bone, 1=Muscle, 2=Skin

  varying vec3 vNorm;
  varying vec3 vPos;

  ${NOISE_GLSL}

  void main() {
    vec4 pos = aPos;
    vec3 normal = aNorm;
    
    // Simple muscle bulge simulation if active
    if (uMatType == 1) {
        float bulge = sin((pos.y * 0.5 + 0.5) * 3.14159) * 0.2; 
        pos.xyz += normal * bulge;
    }

    vec4 worldPos = uModel * pos;
    gl_Position = uProj * uView * worldPos;
    
    vPos = worldPos.xyz;
    vNorm = mat3(uModel) * normal;
  }
`;