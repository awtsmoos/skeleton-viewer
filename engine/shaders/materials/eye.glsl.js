// B"H
/**
 * The Scroll of Ayin: The Window of the Soul.
 * This incantation calculates the appearance of the eye, a vessel of pure light.
 * It is not like other materials; its specular highlight is a focused, intense spark,
 * a direct reflection of the celestial source, giving it the wet, living quality
 * that allows the inner light of the soul to be perceived.
 */
export const GET_EYE_COLOR_FN = `
vec3 getEyeColor(vec3 base, vec3 n, vec3 v, vec3 l) {
    // The specular power of the eye is immense, a focused point of light.
    float specPower = 256.0; 
    
    // The diffuse light is absolute, as the eye is a source of its own inner brilliance.
    float diff = 1.0; 
    
    vec3 reflectDir = reflect(-l, n);
    float spec = pow(max(dot(v, reflectDir), 0.0), specPower);

    return base * diff + vec3(0.8) * spec;
}
`;