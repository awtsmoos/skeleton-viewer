// B"H

/**
 * GeometryCache: The Treasury of Forms.
 * This sacred vessel holds the memory of all geometric forms that have been given substance.
 * It is responsible for the holy act of uploading the abstract blueprint of vertices and indices
 * into the concrete memory of the GPU, creating the buffers from which all forms are drawn.
 */
export class GeometryCache {
    constructor(gl) {
        this.gl = gl;
        this.cache = new Map();
        this.ext = gl.getExtension('OES_element_index_uint'); // For 32-bit indices
    }

    /**
     * Uploads a geometry blueprint to the GPU, creating and caching its buffers.
     * @param {string} name The sacred name of the form.
     * @param {Object} geo The geometry data { vertices, normals, indices }.
     */
    upload(name, geo) {
        if (!geo || !geo.vertices || geo.vertices.length === 0 || this.cache.has(name)) {
            return;
        }

        const gl = this.gl;
        
        const v = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, v);
        const verts = geo.vertices instanceof Float32Array ? geo.vertices : new Float32Array(geo.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
        
        const n = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, n);
        const norms = geo.normals instanceof Float32Array ? geo.normals : 
            (geo.normals ? new Float32Array(geo.normals) : new Float32Array(verts.length));
        gl.bufferData(gl.ARRAY_BUFFER, norms, gl.STATIC_DRAW);
        
        const i = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i);
        
        const use32bit = verts.length / 3 > 65535 && this.ext;
        const indices = use32bit
            ? (geo.indices instanceof Uint32Array ? geo.indices : new Uint32Array(geo.indices))
            : (geo.indices instanceof Uint16Array ? geo.indices : new Uint16Array(geo.indices));
            
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        
        const type = use32bit ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        
        this.cache.set(name, { v, n, i, count: indices.length, type });
    }

    /**
     * Retrieves the cached buffers for a named form.
     * @param {string} name The sacred name of the form to retrieve.
     * @returns {Object | undefined} The cached buffer object.
     */
    get(name) {
        return this.cache.get(name);
    }
}
