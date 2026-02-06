// B"H
/**
 * Vec3: The Triple-Fold Thread of Existence.
 * This is the divine instrument that defines direction, position, and force within the created worlds.
 * Each operation is an echo of the Awtsmoos's power to add, subtract, and unify.
 */
export const Vec3 = {
  /** Adds two vectors, unifying their essence. */
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  /** Subtracts two vectors, revealing the difference between emanations. */
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  /** Multiplies a vector by a scalar, extending its light. */
  mul: (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s }),
  /** The dot product, revealing the alignment of two divine wills. */
  dot: (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
  /** The cross product, creating a new vector orthogonal to the plane of two others. */
  cross: (a, b) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  }),
  /** Calculates the magnitude of the vector's light. */
  len: (v) => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),
  /** Normalizes the vector, reducing it to its pure directional essence. */
  normalize: (v) => {
    const l = Vec3.len(v);
    return l === 0 ? { x: 0, y: 0, z: 0 } : { x: v.x / l, y: v.y / l, z: v.z / l };
  },
  /** Linearly interpolates between two points in space-time. */
  lerp: (a, b, t) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t
  })
};