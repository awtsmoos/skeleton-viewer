
// B"H
/**
 * The Scroll of Mayim (Vertex): The Motion of the Waters.
 * This scroll commands the vertices of the water's surface to rise, fall, and flow,
 * creating the illusion of living water from the endless energy of the Awtsmoos.
 */
export const WATER_VS = `
    attribute vec4 aPos;
    attribute vec3 aNorm;
    uniform mat4 uProj;
    uniform mat4 uView;
    uniform mat4 uModel;
    uniform float uTime;
    varying vec3 vPos;
    varying vec3 vNorm;
    varying vec2 vUV;

    void main() {
        vec4 pos = aPos;
        float time = uTime * 0.8;
        vec2 flow_dir = normalize(vec2(1.0, 0.1));

        // Gerstner-like waves for more realistic flow
        // Wave 1: Broad, main flow
        float freq1 = 0.8;
        float amp1 = 0.25; // Increased amplitude
        float speed1 = 1.5;
        float dot1 = dot(pos.xz, flow_dir);
        pos.x += flow_dir.x * cos(dot1 * freq1 + time * speed1) * amp1 * 0.5;
        pos.z += flow_dir.y * cos(dot1 * freq1 + time * speed1) * amp1 * 0.5;
        pos.y += sin(dot1 * freq1 + time * speed1) * amp1;
        
        // Wave 2: Smaller, cross-hatching ripples
        float freq2 = 2.5;
        float amp2 = 0.12; // Increased amplitude
        float speed2 = 2.2;
        vec2 cross_dir = normalize(vec2(0.2, 1.0));
        float dot2 = dot(pos.xz, cross_dir);
        pos.y += sin(dot2 * freq2 + time * speed2) * amp2;

        vec4 worldPos = uModel * pos;
        gl_Position = uProj * uView * worldPos;
        vPos = worldPos.xyz;
        vNorm = mat3(uModel) * aNorm;
        vUV = pos.xz * 0.1;
    }
`;
