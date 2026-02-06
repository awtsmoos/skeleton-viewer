// B"H
export class Shader {
    static create(gl, vsSource, fsSource) {
        const program = gl.createProgram();
        const vs = this.compile(gl, gl.VERTEX_SHADER, vsSource);
        const fs = this.compile(gl, gl.FRAGMENT_SHADER, fsSource);
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    static compile(gl, type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }
}