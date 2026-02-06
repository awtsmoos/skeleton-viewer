// B"H
/**
 * Mat4: The Sacred Geometry.
 * Matrix operations derived from the Unity of Atzmus.
 */
export class Mat4 {
  constructor() {
    this.data = new Float32Array(16);
    this.identity();
  }

  identity() {
    this.data.fill(0);
    this.data[0] = 1; this.data[5] = 1; this.data[10] = 1; this.data[15] = 1;
    return this;
  }

  multiply(b) {
    const a = this.data;
    const bData = b.data;
    const out = new Float32Array(16);
    for (let c = 0; c < 4; ++c) {
      for (let r = 0; r < 4; ++r) {
        let sum = 0;
        for (let k = 0; k < 4; ++k) {
          sum += a[k * 4 + r] * bData[c * 4 + k];
        }
        out[c * 4 + r] = sum;
      }
    }
    this.data.set(out);
    return this;
  }

  translate(v) {
    const m = new Mat4();
    m.data[12] = v.x || 0; m.data[13] = v.y || 0; m.data[14] = v.z || 0;
    return this.multiply(m);
  }

  rotate(rad, axis) {
    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.sqrt(x*x + y*y + z*z);
    if (len < 0.00001) return this;
    len = 1 / len; x *= len; y *= len; z *= len;
    const s = Math.sin(rad), c = Math.cos(rad), t = 1 - c;
    const m = new Mat4();
    const d = m.data;
    d[0] = x*x*t + c; d[1] = y*x*t + z*s; d[2] = z*x*t - y*s;
    d[4] = x*y*t - z*s; d[5] = y*y*t + c; d[6] = z*y*t + x*s;
    d[8] = x*z*t + y*s; d[9] = y*z*t - x*s; d[10] = z*z*t + c;
    return this.multiply(m);
  }

  scale(v) {
    const m = new Mat4();
    m.data[0] = v.x || 1; m.data[5] = v.y || 1; m.data[10] = v.z || 1;
    return this.multiply(m);
  }

  perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    this.identity();
    this.data[0] = f / aspect;
    this.data[5] = f;
    this.data[10] = (far + near) * nf;
    this.data[11] = -1;
    this.data[14] = (2 * far * near) * nf;
    this.data[15] = 0;
    return this;
  }

  lookAt(eye, center, up) {
    const z = this._normalize(this._sub(eye, center));
    
    // Smooth transition for poles to prevent perspective collapse
    let upDir = up;
    if (Math.abs(this._dot(z, up)) > 0.999) {
        upDir = { x: 0, y: 0, z: 1 };
    }

    const x = this._normalize(this._cross(upDir, z));
    const y = this._normalize(this._cross(z, x));
    
    this.identity();
    const d = this.data;
    d[0] = x.x; d[4] = x.y; d[8] = x.z;
    d[1] = y.x; d[5] = y.y; d[9] = y.z;
    d[2] = z.x; d[6] = z.y; d[10] = z.z;
    d[12] = -this._dot(x, eye);
    d[13] = -this._dot(y, eye);
    d[14] = -this._dot(z, eye);
    d[15] = 1;
    return this;
  }

  _sub(a, b) { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; }
  _cross(a, b) { return { x: a.y*b.z - a.z*b.y, y: a.z*b.x - a.x*b.z, z: a.x*b.y - a.y*b.x }; }
  _dot(a, b) { return a.x*b.x + a.y*b.y + a.z*b.z; }
  _normalize(v) {
      const l = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
      return l > 0 ? {x: v.x/l, y: v.y/l, z: v.z/l} : {x:0, y:1, z:0};
  }
}