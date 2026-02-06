// B"H
export class Context {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl', { antialias: true, depth: true });
        if (!this.gl) throw new Error("WebGL extinguished.");

        // THE INFINITE SCROLL: Enable 32-bit index support
        this.ext = this.gl.getExtension('OES_element_index_uint');
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
    }

    resize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
    }
}