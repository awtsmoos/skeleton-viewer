// B"H
export class Buffer {
    constructor(gl, data) {
        this.gl = gl;
        this.count = data.indices.length;
        
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);

        this.nbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals || data.vertices.length), gl.STATIC_DRAW);

        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);

        this.type = (data.indices instanceof Uint32Array) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    }

    bind(program) {
        const gl = this.gl;
        
        const aPos = gl.getAttribLocation(program, 'aPos');
        if (aPos !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPos);
        }

        const aNorm = gl.getAttribLocation(program, 'aNorm');
        if (aNorm !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
            gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aNorm);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    }

    draw() {
        this.gl.drawElements(this.gl.TRIANGLES, this.count, this.type, 0);
    }
}