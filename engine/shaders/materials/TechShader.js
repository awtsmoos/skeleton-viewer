// B"H
export const VS_TECH = `
  attribute vec4 aPos;
  attribute vec2 aTexCoord;
  uniform mat4 uProj;
  uniform mat4 uView;
  uniform mat4 uModel;
  varying vec2 vUV;
  
  void main() {
    vUV = aTexCoord;
    gl_Position = uProj * uView * uModel * aPos;
  }
`;

export const FS_TECH = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uCol;
  varying vec2 vUV;

  void main() {
    float grid = step(0.95, fract(vUV.x * 10.0)) + step(0.95, fract(vUV.y * 10.0));
    gl_FragColor = vec4(uCol + grid * 0.5, 0.8);
  }
`;