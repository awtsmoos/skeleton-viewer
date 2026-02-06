// B"H
/**
 * The Scroll of Or: The Garment of the Soul.
 * This is the formula for skin, the holy vessel. It is not a simple surface, but a
 * semi-translucent boundary where light penetrates and scatters, a phenomenon known as
 * "subsurface scattering." This gives the skin a soft, living glow, hinting at the
 * inner light of the soul it contains. The specular highlight is softened, as the
 * vessel is humble, not a perfect mirror.
 */
export const GET_SKIN_COLOR_FN = `
vec3 getSkinColor(vec3 base, vec3 n, vec3 v, vec3 l) {
    // The diffuse light is softened, simulating its scattering beneath the surface.
    float diff = max(dot(n, l), 0.1); 
    
    // The specular highlight is muted, reflecting the humility of flesh.
    float specPower = 16.0;
    
    vec3 reflectDir = reflect(-l, n);
    float spec = pow(max(dot(v, reflectDir), 0.0), specPower);

    return base * (diff * 0.8 + 0.2) + vec3(0.2) * spec;
}
`;