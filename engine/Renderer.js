// B"H
import { Mat4 } from './math/Mat4.js';
import { Buffer } from './core/Buffer.js';
import { Shader } from './core/Shader.js';
import { Generators } from './generators/index.js';
import { UBER_VS, UBER_FS, SKY_VS, SKY_FS } from './shaders/Sources.js';

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.gl = ctx.gl;
        this.uber = Shader.create(this.gl, UBER_VS, UBER_FS);
        this.sky = Shader.create(this.gl, SKY_VS, SKY_FS);
        this.cache = new Map();
        this.init();
    }

    init() {
        const add = (name, data) => this.cache.set(name, new Buffer(this.gl, data));
        add('ground', Generators.createGround());
        add('cube', Generators.createCube());
        
        const adam = Generators.createAdam();
        add('human_bone', adam.bones);
        add('human_skin', adam.skin);
        
        // Custom tree placements for variety
        const tree1 = Generators.createTree({pos: [-5,0,-4]});
        add('tree1_wood', tree1.wood); add('tree1_leaf', tree1.leaves);
        const tree2 = Generators.createTree({pos: [5,0,-8]});
        add('tree2_wood', tree2.wood); add('tree2_leaf', tree2.leaves);
    }

    draw(scene, camPos, camTarget, time) {
        const gl = this.gl;
        gl.clearColor(0.01, 0.01, 0.02, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const proj = new Mat4().perspective(Math.PI/4, gl.canvas.width/gl.canvas.height, 0.1, 2000);
        const view = new Mat4().lookAt(camPos, camTarget, {x:0, y:1, z:0});

        this.drawSky(proj, view, time);

        gl.useProgram(this.uber);
        gl.uniform3f(gl.getUniformLocation(this.uber, 'uCamPos'), camPos.x, camPos.y, camPos.z);
        gl.uniform1f(gl.getUniformLocation(this.uber, 'uTime'), time);

        // Ground (Eretz)
        this.renderItem('ground', proj, view, new Mat4().scale({x:60,y:1,z:60}), [0.2, 0.4, 0.1], 1);

        scene.objects.forEach(obj => {
            const m = new Mat4()
                .translate({x:obj.pos[0], y:obj.pos[1], z:obj.pos[2]})
                .scale({x:obj.scale, y:obj.scale, z:obj.scale});

            if (obj.type === 'human') {
                this.renderItem('human_bone', proj, view, m, [0.95, 0.95, 0.85]);
                this.renderItem('human_skin', proj, view, m, [0.85, 0.65, 0.55]);
            } else if (obj.type === 'tree') {
                const id = obj.id === 'tree1' ? 'tree1' : 'tree2';
                this.renderItem(id+'_wood', proj, view, m, [0.35, 0.25, 0.15]);
                this.renderItem(id+'_leaf', proj, view, m, [0.15, 0.5, 0.15], 4); // MatType 4 for leaves
            }
        });
    }

    drawSky(proj, view, time) {
        const gl = this.gl;
        gl.useProgram(this.sky);
        gl.depthMask(false);
        gl.cullFace(gl.FRONT);
        const skyView = new Mat4(); skyView.data.set(view.data);
        skyView.data[12]=0; skyView.data[13]=0; skyView.data[14]=0;
        gl.uniformMatrix4fv(gl.getUniformLocation(this.sky, 'uProj'), false, proj.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.sky, 'uView'), false, skyView.data);
        gl.uniform3f(gl.getUniformLocation(this.sky, 'uSunPos'), Math.cos(time*0.05), 0.5 + Math.sin(time*0.05)*0.5, 0.5);
        this.cache.get('cube').bind(this.sky);
        this.cache.get('cube').draw();
        gl.cullFace(gl.BACK);
        gl.depthMask(true);
    }

    renderItem(name, proj, view, model, col, matType=0) {
        const buf = this.cache.get(name);
        if (!buf) return;
        const gl = this.gl;
        gl.uniformMatrix4fv(gl.getUniformLocation(this.uber, 'uProj'), false, proj.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.uber, 'uView'), false, view.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.uber, 'uModel'), false, model.data);
        gl.uniform3fv(gl.getUniformLocation(this.uber, 'uCol'), col);
        gl.uniform1i(gl.getUniformLocation(this.uber, 'uMatType'), matType);
        buf.bind(this.uber);
        buf.draw();
    }
}