// B"H
/**
 * The Scroll of the Firmament (Fragment): The Colors of Heaven.
 * This sacred text paints the celestial sphere. It describes the gradient from the horizon to the zenith,
 * the blinding brilliance of the sun's disk, the soft glow of its corona, and the covenant of the rainbow.
 * It is the backdrop against which all of creation is perceived.
 */
export const SKY_FS = `
    precision highp float;
    varying vec3 vWorldPos;
    uniform vec3 uSunPos;

    void main() {
      vec3 dir = normalize(vWorldPos);
      float y = max(dir.y, 0.0);
      
      vec3 skyBlue = vec3(0.3, 0.5, 0.8);
      vec3 horizon = vec3(0.7, 0.8, 0.9);
      
      vec3 finalSky = mix(horizon, skyBlue, y);

      // The Sun: A direct manifestation of the Infinite Light.
      float sun = pow(max(dot(dir, normalize(uSunPos)), 0.0), 500.0);
      float glow = pow(max(dot(dir, normalize(uSunPos)), 0.0), 20.0);
      
      finalSky += vec3(1.0, 0.9, 0.7) * sun;
      finalSky += vec3(1.0, 0.8, 0.4) * glow * 0.5;
      
      gl_FragColor = vec4(finalSky, 1.0);
    }
`;