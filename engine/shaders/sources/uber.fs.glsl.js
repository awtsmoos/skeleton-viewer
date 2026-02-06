// B"H
/**
 * The Uber Shader Fragment Source: The Loom of All Materials.
 */

import { NOISE_GLSL } from '../chunks/noise.glsl.js';
import { PBR_LIGHTING_FN } from '../chunks/lighting.glsl.js';
import { GET_GROUND_COLOR_FN } from '../materials/ground.glsl.js';
import { GET_LEAVES_COLOR_FN } from '../materials/leaves.glsl.js';
import { GET_SKIN_COLOR_FN } from '../materials/skin.glsl.js';
import { GET_EYE_COLOR_FN } from '../materials/eye.glsl.js';

export const UBER_FS = `
    precision highp float;
    varying vec3 vNorm; 
    varying vec3 vPos;
    varying vec2 vUV;
    
    uniform vec3 uCol; 
    uniform float uTime; 
    uniform vec3 uCamPos; 
    uniform int uMatType;
    
    uniform sampler2D uLeafTex;
    uniform int uHasTex;

    ${NOISE_GLSL}
    ${PBR_LIGHTING_FN}
    ${GET_GROUND_COLOR_FN}
    ${GET_LEAVES_COLOR_FN}
    ${GET_SKIN_COLOR_FN}
    ${GET_EYE_COLOR_FN}

    void main() {
        vec3 n = normalize(vNorm);
        vec3 light = normalize(vec3(0.5, 0.8, 0.3));
        vec3 view = normalize(uCamPos - vPos);
        
        vec3 base = uCol;
        
        // --- TEXTURE HANDLING ---
        if (uHasTex == 1) {
            vec4 texCol = texture2D(uLeafTex, vUV);
            if (texCol.a < 0.1) discard; 
            base = texCol.rgb;
        }

        vec3 finalColor;

        if (uMatType == 1) { // Ground
             base = getGroundColor(vPos, n);
             finalColor = calculatePBR(base, n, view, light, 8.0);
        } else if (uMatType == 4) { // Leaves
             // SACRED CARVING: Transform the flat plane into an elaborate 2D shape
             finalColor = getLeavesColor(base, n, light, vPos, vUV, uTime);
        } else if (uMatType == 6) { // Skin
             finalColor = getSkinColor(base, n, view, light);
        } else { // Standard / Metallic / Spark
             finalColor = calculatePBR(base, n, view, light, 64.0);
        }

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;