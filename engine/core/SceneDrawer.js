// B"H
import { Mat4 } from '../math/Mat4.js';

/**
 * SceneDrawer: The Scribe of Forms.
 */
export class SceneDrawer {
    constructor(gl, shaders, cache) {
        this.gl = gl;
        this.shaders = shaders;
        this.cache = cache;

        // Default state: Only show the skeleton (The Temple)
        this.showSkeleton = true;
        this.showMuscles = false;
        this.showSkin = false;
    }

    setVisibility(layer, visible) {
        if (layer === 'skeleton') this.showSkeleton = visible;
        if (layer === 'muscles') this.showMuscles = visible;
        if (layer === 'skin') this.showSkin = visible;
    }

    drawScene(scene, time, proj, view, cameraPos) {
        const gl = this.gl;
        const uberProgram = this.shaders.get('uber');
        if (!uberProgram) return;

        gl.useProgram(uberProgram);
        gl.uniform3f(gl.getUniformLocation(uberProgram, 'uCamPos'), cameraPos.x, cameraPos.y, cameraPos.z);
        gl.uniform1f(gl.getUniformLocation(uberProgram, 'uTime'), time);

        scene.objects.forEach(obj => {
            if (!obj) return;
            if (obj.type === 'human_rigged') {
                this.drawHuman(obj, proj, view, time);
            } else {
                this.drawGeneric(obj, proj, view, time);
            }
        });
    }

    drawHuman(obj, proj, view, time) {
        const target = obj.transform || obj;
        if (!target.position) return;
    
        const modelMatrix = new Mat4()
            .translate(target.position)
            .rotate(target.rotation.x, [1,0,0])
            .rotate(target.rotation.y, [0,1,0])
            .rotate(target.rotation.z, [0,0,1])
            .scale(target.scale || {x: 1, y: 1, z: 1});

        if (this.showSkin) {
            this.drawEntity('human_skin', proj, view, modelMatrix, [0.85, 0.65, 0.55], 6);
        }
        if (this.showMuscles) {
            this.drawEntity('human_muscles', proj, view, modelMatrix, [0.7, 0.2, 0.15], 0);
        }
        if (this.showSkeleton) {
            this.drawEntity('human_bones', proj, view, modelMatrix, [0.95, 0.92, 0.85], 0);
        }
    }

    drawGeneric(obj, proj, view, time) {
        const target = obj.transform || obj;
        if (!target.position) return;
    
        const modelMatrix = new Mat4()
            .translate(target.position)
            .rotate(target.rotation.x, [1,0,0])
            .rotate(target.rotation.y, [0,1,0])
            .rotate(target.rotation.z, [0,0,1])
            .scale(target.scale || {x: 1, y: 1, z: 1});

        this.drawEntity(obj.type, proj, view, modelMatrix, obj.material.color, 0);
    }
    
    drawEntity(name, proj, view, model, color, type = 0) {
        const gl = this.gl;
        const program = this.shaders.get('uber');
        if(!program) return;
        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProj'), false, proj.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uView'), false, view.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModel'), false, model.data);
        gl.uniform3fv(gl.getUniformLocation(program, 'uCol'), color);
        gl.uniform1i(gl.getUniformLocation(program, 'uMatType'), type);
        
        this.bindAndDraw(name, program);
    }

    bindAndDraw(name, prog) {
        const buf = this.cache.get(name);
        if (!buf) return;

        const gl = this.gl;
        const aPos = gl.getAttribLocation(prog, 'aPos');
        if (aPos !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buf.v);
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aPos);
        }

        const aNorm = gl.getAttribLocation(prog, 'aNorm');
        if (aNorm !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buf.n);
            gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aNorm);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.i);
        gl.drawElements(gl.TRIANGLES, buf.count, buf.type, 0);
    }
}
