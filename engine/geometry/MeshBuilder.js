// B"H
import { Generators } from '../generators/index.js';

export const MeshBuilder = {
  get: (type) => Generators.get(type),
  getTextParticles: (text) => new Float32Array([])
};
