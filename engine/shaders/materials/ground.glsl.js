
// B"H
/**
 * The Scroll of Eretz: The Substance of the Holy Ground.
 * This function is the alchemical formula for creating the earth itself.
 * It weaves together soil, rock, and moss, guided by the divine hum of `snoise`.
 */
export const GET_GROUND_COLOR_FN = `
vec3 getGroundColor(vec3 pos, vec3 n) {
    // Base soil color with large-scale variation
    float soil_noise = snoise(pos * 0.05) * 0.5 + 0.5;
    vec3 soil_color = mix(vec3(0.2, 0.1, 0.05), vec3(0.4, 0.25, 0.1), soil_noise);

    // Rocky patches with fine detail
    float rock_noise = snoise(pos * 1.5);
    float rock_mask = smoothstep(0.4, 0.6, rock_noise);
    vec3 rock_color = vec3(0.25) + snoise(pos * 15.0) * 0.08;

    // Moss/grass patches in crevices
    float moss_noise = snoise(pos * 2.5 + vec3(5.0));
    float moss_mask = smoothstep(0.5, 0.8, moss_noise) * (1.0 - rock_mask);
    vec3 moss_color = vec3(0.1, 0.25, 0.05);

    // Steeper slopes become rockier, revealing the mountain's bones.
    float slope = 1.0 - n.y;
    rock_mask = max(rock_mask, smoothstep(0.3, 0.6, slope));

    vec3 final_color = mix(soil_color, rock_color, rock_mask);
    final_color = mix(final_color, moss_color, moss_mask * 0.6);
    
    return final_color;
}
`;
