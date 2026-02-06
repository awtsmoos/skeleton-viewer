// B"H
// Simple shader to write depth to texture
export const VS_DEPTH = `
  attribute vec4 aVertexPosition;
  uniform mat4 uLightSpaceMatrix;
  uniform mat4 uModelMatrix;
  
  void main() {
    gl_Position = uLightSpaceMatrix * uModelMatrix * aVertexPosition;
  }
`;

export const FS_DEPTH = `
  precision highp float;
  void main() {
    // gl_FragDepth is written automatically by WebGL
    // We can explicitly encode it if we were using RGBA packing for older WebGL1 without depth tex extension
    // But assuming WebGL 2 or depth_texture extension.
    // We'll output simple color for debugging if needed, but usually depth is implicit.
    gl_FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0);
  }
`;
