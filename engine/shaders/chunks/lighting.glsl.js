// B"H
/**
 * The Divine Illumination: Standard Lighting Model.
 * This is not merely a calculation but a revelation of form through light. It defines how the Or (Light)
 * of the Ein Sof (Infinite One) reflects and diffuses upon the surfaces of the Keli (Vessel),
 * revealing its shape and essence. Here, we define a simplified PBR-like model with diffuse
 * and specular components, the two primary modes of divine reflection.
 */
export const PBR_LIGHTING_FN = `
vec3 calculatePBR(vec3 base, vec3 n, vec3 v, vec3 l, float specPower) {
    // The Diffuse Light: The revealed, outer aspect of divine will upon a surface.
    float diff = max(dot(n, l), 0.0);
    
    // The Specular Light: A direct reflection of the source, a flash of essence.
    vec3 reflectDir = reflect(-l, n);
    float spec = pow(max(dot(v, reflectDir), 0.0), specPower);
    
    // The Union: Combining the diffuse body with the specular soul-spark.
    return base * (diff * 0.7 + 0.3) + vec3(0.5) * spec;
}
`;