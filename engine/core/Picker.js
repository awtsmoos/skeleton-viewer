// B"H
import { Mat4 } from '../math/Mat4.js';

const VS_PICK = `
    attribute vec4 aPos;
    uniform mat4 uProj;
    uniform mat4 uView;
    uniform mat4 uModel;
    void main() {
        gl_Position = uProj * uView * uModel * aPos;
    }
`;

const FS_PICK = `
    precision highp float;
    uniform vec3 uPickColor;
    void main() {
        gl_FragColor = vec4(uPickColor, 1.0);
    }
`;

export class Picker {
    constructor(gl, cache) {
        this.gl = gl;
        this.cache = cache;
        this.program = this.createProgram(VS_PICK, FS_PICK);
        this.framebuffer = gl.createFramebuffer();
        this.renderTexture = gl.createTexture();
        this.depthBuffer = gl.createRenderbuffer();
        this.resize(gl.canvas.width, gl.canvas.height);
    }

    resize(w, h) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.renderTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    }

    getObject(x, y, scene, camera) {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.renderTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);

        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        const proj = new Mat4().perspective(45 * Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 5000);
        const view = new Mat4().lookAt(
            this.getCameraPosition(camera),
            camera.target, {x:0, y:1, z:0}
        );

        gl.useProgram(this.program);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uProj'), false, proj.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uView'), false, view.data);

        let colorMap = new Map();
        let i = 1;

        const drawRecursive = (obj, parentMatrix) => {
            if (!obj) return;
            const model = new Mat4().translate(obj.transform.position).scale(obj.transform.scale);
            
            if (obj.type === 'human') {
                const parts = ['human_skin', 'human_bones', 'human_hair', 'eye_sclera', 'eye_iris', 'eye_pupil'];
                parts.forEach(partName => {
                    const buf = this.cache.get(partName);
                    if (buf) {
                        const color = this.idToColor(i);
                        colorMap.set(i, partName);
                        i++;
                        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uModel'), false, model.data);
                        gl.uniform3fv(gl.getUniformLocation(this.program, 'uPickColor'), color);
                        this.drawBuffer(buf);
                    }
                });
            } else {
                 const buf = this.cache.get(obj.id) || this.cache.get(obj.type);
                 if(buf) {
                    const color = this.idToColor(i);
                    colorMap.set(i, obj.id);
                    i++;
                    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uModel'), false, model.data);
                    gl.uniform3fv(gl.getUniformLocation(this.program, 'uPickColor'), color);
                    this.drawBuffer(buf);
                 }
            }
        };

        scene.objects.forEach(obj => drawRecursive(obj, new Mat4()));
        
        const pixel = new Uint8Array(4);
        gl.readPixels(x, gl.canvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        const id = this.colorToId(pixel);
        return colorMap.get(id) || null;
    }
    
    drawBuffer(buf) {
        const gl = this.gl;
        const aPos = gl.getAttribLocation(this.program, 'aPos');
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.v);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.i);
        gl.drawElements(gl.TRIANGLES, buf.count, buf.type, 0);
    }

    getCameraPosition(camera) {
        const camX = camera.radius * Math.sin(camera.phi) * Math.cos(camera.theta);
        const camY = camera.radius * Math.cos(camera.phi);
        const camZ = camera.radius * Math.sin(camera.phi) * Math.sin(camera.theta);
        return { x: camX + camera.target.x, y: camY + camera.target.y, z: camZ + camera.target.z };
    }

    idToColor(id) {
        const r = (id & 0x0000FF) / 255;
        const g = ((id & 0x00FF00) >> 8) / 255;
        const b = ((id & 0xFF0000) >> 16) / 255;
        return [r,g,b];
    }
    
    colorToId(color) {
        return color[0] + (color[1] << 8) + (color[2] << 16);
    }

    createProgram(vs, fs) {
        const gl = this.gl;
        const p = gl.createProgram();
        const v = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(v, vs); gl.compileShader(v);
        const f = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(f, fs); gl.compileShader(f);
        gl.attachShader(p, v); gl.attachShader(p, f);
        gl.linkProgram(p);
        return p;
    }
}
