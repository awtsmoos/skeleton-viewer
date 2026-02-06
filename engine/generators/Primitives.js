// B"H
/**
 * Primitives: The Foundation Stones of Reality.
 * Forges the basic geometric containers that hold the light of the Ein Sof.
 */
export const Primitives = {
  createCube: () => {
    const vertices = [
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
      1,-1,-1, -1,-1,-1, -1,1,-1, 1,1,-1,
      -1,1,1, 1,1,1, 1,1,-1, -1,1,-1,
      -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1,
      1,-1,1, 1,-1,-1, 1,1,-1, 1,1,1,
      -1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1
    ];
    const indices = [
      0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11,
      12,13,14, 12,14,15, 16,17,18, 16,18,19, 20,21,22, 20,22,23
    ];
    const normals = [
      0,0,1, 0,0,1, 0,0,1, 0,0,1,  0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
      0,1,0, 0,1,0, 0,1,0, 0,1,0,  0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
      1,0,0, 1,0,0, 1,0,0, 1,0,0,  -1,0,0, -1,0,0, -1,0,0, -1,0,0
    ];
    const texcoords = [
      0,0, 1,0, 1,1, 0,1,  0,0, 1,0, 1,1, 0,1,  0,0, 1,0, 1,1, 0,1,
      0,0, 1,0, 1,1, 0,1,  0,0, 1,0, 1,1, 0,1,  0,0, 1,0, 1,1, 0,1
    ];
    return { vertices, indices, normals, texcoords };
  },

  /**
   * Creates a highly subdivided cube (actually a sphere projected to cube bounds), 
   * providing dense geometry for CSG carving.
   */
  createTessellatedCube: (subdivisions = 24) => {
      // We start with a sphere because it has even vertex distribution
      const { vertices, indices, normals, texcoords } = Primitives.createSphere(subdivisions, subdivisions);
      
      const vOut = new Float32Array(vertices);
      // We re-use normals from sphere for a smooth organic look
      const nOut = new Float32Array(normals); 
      
      // Flatten the sphere slightly to make it more boxy/head-like if needed, 
      // but for a skull base, a sphere is actually a better starting point than a cube.
      
      return { 
          vertices: vOut, 
          indices: new Uint16Array(indices), 
          normals: nOut, 
          texcoords: new Float32Array(texcoords) 
      };
  },

  createSphere: (latBands = 16, longBands = 16) => {
    const vertices = [];
    const normals = [];
    const indices = [];
    const texcoords = [];
    for (let lat = 0; lat <= latBands; lat++) {
      const theta = lat * Math.PI / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      for (let long = 0; long <= longBands; long++) {
        const phi = long * 2 * Math.PI / longBands;
        const x = Math.cos(phi) * sinTheta;
        const y = cosTheta;
        const z = Math.sin(phi) * sinTheta;
        normals.push(x, y, z);
        vertices.push(x, y, z);
        texcoords.push(long / longBands, lat / latBands);
      }
    }
    for (let lat = 0; lat < latBands; lat++) {
      for (let long = 0; long < longBands; long++) {
        const first = (lat * (longBands + 1)) + long;
        const second = first + longBands + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }
    return { vertices, normals, indices, texcoords };
  },

  createPyramid: () => {
      const vertices = [
          -1,-1,-1, 1,-1,-1, 1,-1, 1, -1,-1, 1,
          -1,-1, 1, 1,-1, 1, 0, 1, 0,
           1,-1, 1, 1,-1,-1, 0, 1, 0,
           1,-1,-1, -1,-1,-1, 0, 1, 0,
          -1,-1,-1, -1,-1, 1, 0, 1, 0
      ];
      const indices = [0,2,1, 0,3,2, 4,5,6, 7,8,9, 10,11,12, 13,14,15];
      const normals = [
          0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
          0,0.5,1, 0,0.5,1, 0,0.5,1,
          1,0.5,0, 1,0.5,0, 1,0.5,0,
          0,0.5,-1, 0,0.5,-1, 0,0.5,-1,
          -1,0.5,0, -1,0.5,0, -1,0.5,0
      ];
      const texcoords = [
          0,0, 1,0, 1,1, 0,1,
          0,0, 1,0, 0.5,1,
          0,0, 1,0, 0.5,1,
          0,0, 1,0, 0.5,1,
          0,0, 1,0, 0.5,1
      ];
      return { vertices, indices, normals, texcoords };
  },

  createPlane: (segments = 1, noiseFn = null, scale = 1.0) => {
    const vertices = [];
    const normals = [];
    const indices = [];
    const texcoords = [];
    const segs = Math.max(1, Math.floor(segments));

    for (let z = 0; z <= segs; z++) {
      for (let x = 0; x <= segs; x++) {
        const px = (x/segs - 0.5) * 2;
        const pz = (z/segs - 0.5) * 2;
        const py = noiseFn ? noiseFn(px * scale, pz * scale) : 0;
        vertices.push(px, py, pz);
        normals.push(0, 1, 0);
        texcoords.push(x/segs, z/segs);
      }
    }

    for (let z = 0; z < segs; z++) {
      for (let x = 0; x < segs; x++) {
        const a = (z * (segs + 1)) + x;
        const b = a + 1;
        const c = ((z + 1) * (segs + 1)) + x;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }
    const v = new Float32Array(vertices);
    const n = new Float32Array(normals);
    const i = new Uint32Array(indices);
    const t = new Float32Array(texcoords);
    
    if(noiseFn) {
        for(let k=0; k < i.length; k+=3) {
            const i1=i[k]*3, i2=i[k+1]*3, i3=i[k+2]*3;
            const v1=[v[i1],v[i1+1],v[i1+2]];
            const v2=[v[i2],v[i2+1],v[i2+2]];
            const v3=[v[i3],v[i3+1],v[i3+2]];
            const u = [v2[0]-v1[0], v2[1]-v1[1], v2[2]-v1[2]];
            const w = [v3[0]-v1[0], v3[1]-v1[1], v3[2]-v1[2]];
            const nx = u[1]*w[2] - u[2]*w[1];
            const ny = u[2]*w[0] - u[0]*w[2];
            const nz = u[0]*w[1] - u[1]*w[0];
            n[i1]+=nx; n[i1+1]+=ny; n[i1+2]+=nz;
            n[i2]+=nx; n[i2+1]+=ny; n[i2+2]+=nz;
            n[i3]+=nx; n[i3+1]+=ny; n[i3+2]+=nz;
        }
    }
    return { vertices: v, normals: n, texcoords: t, indices: i };
  }
};
