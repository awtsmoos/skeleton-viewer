// B"H
import { NOISE_GLSL, COMMON_UNIFORMS } from '../chunks.js';

export const VS_SOFTBODY = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute float aPinWeight; // 0.0 = Loose, 1.0 = Pinned (Rigid)

  ${COMMON_UNIFORMS}

  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec2 vUV;

  ${NOISE_GLSL}

  void main() {
    vec4 pos = aVertexPosition;
    vec3 localPos = pos.xyz;

    // --- INERTIA SIMULATION ---
    // If the object accelerates RIGHT, the loose parts should lag LEFT.
    // uAcceleration is passed from CPU based on movement delta.
    
    // Calculate drag factor based on distance from center (or Z axis)
    // Assuming 'tail' or 'end' is negative Z or further from origin.
    float drag = length(localPos) * 0.5; 
    
    // Apply opposite force to acceleration
    vec3 inertia = -uAcceleration * drag * 2.0;
    
    // Limit inertia to prevent exploding mesh
    inertia = clamp(inertia, -0.5, 0.5);

    // Apply Soft Deformation
    // We only deform vertices that are NOT pinned (aPinWeight < 1.0)
    // If aPinWeight is missing, attribute defaults to 0 usually, so fully soft.
    float stiffness = 1.0; // Could be uniform
    
    // Soft Body Lag
    pos.xyz += inertia * (1.0 - aPinWeight);

    // Secondary Wobble (Settling)
    float wobble = sin(uTime * 20.0 - length(localPos)*5.0) * length(uVelocity) * 0.1;
    pos.x += wobble * (1.0 - aPinWeight);

    vec4 worldPos = uModelMatrix * pos;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
    
    vPos = worldPos.xyz;
    vNormal = normalize((uNormalMatrix * vec4(aVertexNormal, 0.0)).xyz);
    vUV = aVertexPosition.xy * 0.5 + 0.5;
  }
`;
