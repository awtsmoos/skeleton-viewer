// B"H
/**
 * The Scroll of Aleh: The Living Leaf.
 * Carves the rectangular vessel into an organic form of life.
 */
export const GET_LEAVES_COLOR_FN = `
vec3 getLeavesColor(vec3 base, vec3 n, vec3 l, vec3 pos, vec2 uv, float time) {
    vec2 p = uv - 0.5;
    
    // SACRED GEOMETRY: Jagged leaf profile
    float angle = atan(p.y, p.x);
    float r = length(p);
    
    // Create organic lobes using multiple sine waves
    float lobes = 0.4 + 0.1 * sin(angle * 5.0 + time * 0.2);
    lobes += 0.05 * sin(angle * 12.0 - time * 0.3);
    
    // Discard pixels to manifest the elaborate shape
    if (r > lobes) discard;

    // Weaving veins through the texture
    float midVein = smoothstep(0.015, 0.0, abs(p.x) - 0.005);
    float sideVeins = smoothstep(0.01, 0.0, abs(p.x * 3.0 - p.y) - 0.01) + 
                      smoothstep(0.01, 0.0, abs(p.x * -3.0 - p.y) - 0.01);
    
    // Natural color variations from the earth
    float variation = snoise(pos * 8.0) * 0.25 + 0.75;
    vec3 leafCol = mix(base, vec3(0.05, 0.2, 0.02), midVein * 0.6);
    leafCol = mix(leafCol, vec3(0.1, 0.25, 0.05), sideVeins * 0.4);
    leafCol *= variation;
    
    // Light interaction
    float diff = max(dot(n, l), 0.3);
    return leafCol * diff;
}
`;