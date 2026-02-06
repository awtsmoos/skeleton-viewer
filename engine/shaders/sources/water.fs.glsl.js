
// B"H
/**
 * The Scroll of Mayim (Fragment): The Essence of Water.
 * This text describes water's appearance, blending shallow and deep hues,
 * animated by caustic light patterns and the mystery of Fresnel reflections.
 */
import { NOISE_GLSL } from '../chunks/noise.glsl.js';

export const WATER_FS = `
    precision highp float;
    varying vec3 vPos;
    varying vec3 vNorm;
    varying vec2 vUV;
    uniform float uTime;
    uniform vec3 uSunPos;
    uniform vec3 uCamPos;
    
    ${NOISE_GLSL}

    void main() {
        vec3 shallowColor = vec3(0.35, 0.65, 0.8);
        vec3 deepColor = vec3(0.05, 0.2, 0.4);
        
        // The dance of light upon the water, a manifestation of the Divine Hum.
        vec2 uv_distort = vUV + vec2(snoise(vec3(vUV * 2.0, uTime * 0.2)), snoise(vec3(vUV * 2.0, uTime * 0.2 + 10.0))) * 0.1;
        float caustics = snoise(vec3(uv_distort * 15.0, uTime)) * 0.5 + 0.5;
        caustics = smoothstep(0.4, 0.8, caustics);
        
        vec3 waterColor = mix(deepColor, shallowColor, caustics);
        
        // The Fresnel effect: water as a mirror to the heavens.
        vec3 viewDir = normalize(uCamPos - vPos);
        float fresnel = pow(1.0 - abs(dot(normalize(vNorm), viewDir)), 2.5);
        waterColor = mix(waterColor, vec3(0.6, 0.8, 1.0), fresnel * 0.8);

        // Specular Reflection of the Sun
        vec3 sunDir = normalize(uSunPos); // Sun position is already a direction in sky shader
        vec3 halfVec = normalize(sunDir + viewDir);
        float spec = pow(max(dot(normalize(vNorm), halfVec), 0.0), 128.0);
        waterColor += vec3(1.0, 0.9, 0.8) * spec * 1.2;

        // Foam effect
        float foamNoise = snoise(vPos.xyz * 5.0 + uTime * 0.5);
        float foam = smoothstep(0.6, 0.8, foamNoise) * (1.0 - caustics);
        waterColor = mix(waterColor, vec3(1.0), foam * 0.5);
        
        float alpha = 0.65 + caustics * 0.2 + fresnel * 0.1;
        
        gl_FragColor = vec4(waterColor, alpha);
    }
`;
