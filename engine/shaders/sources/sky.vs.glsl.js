// B"H
/**
 * The Scroll of the Firmament (Vertex): Expanding the Canvas of Heaven.
 */
export const SKY_VS = `
    attribute vec4 aPos;
    uniform mat4 uView;
    uniform mat4 uProj;
    varying vec3 vWorldPos;
    
    void main() {
      // Stripping translation to keep the sky infinitely distant
      mat4 staticView = uView;
      staticView[3][0] = 0.0;
      staticView[3][1] = 0.0;
      staticView[3][2] = 0.0;
      
      // We project the cube vertices to the far plane
      gl_Position = uProj * staticView * aPos;
      vWorldPos = aPos.xyz;
    }
`;