// B"H
import { Mat4 } from '../math/Mat4.js';
import { SceneDrawer } from './SceneDrawer.js';
import { GeometryCache } from './GeometryCache.js';
import { ShaderRegistry } from '../shaders/ShaderRegistry.js';
import { CharacterGen } from '../generators/CharacterGen.js';
import { GeoUtils } from '../generators/GeoUtils.js';
import { Primitives } from '../generators/Primitives.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        const gl = canvas.getContext('webgl', { antialias: true, depth: true, alpha: false });
        if (!gl) throw new Error("WebGL failed to emerge from the void.");
        this.gl = gl;
        
        gl.enable(gl.DEPTH_TEST);
        
        // --- THE TIKKUN: RESTORE CULLING ---
        // This ensures the back-side of the skull plates are not seen through the eye holes.
        gl.enable(gl.CULL_FACE); 
        gl.cullFace(gl.BACK); 
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        ShaderRegistry.init(gl);
        this.cache = new GeometryCache(gl);
        this.drawer = new SceneDrawer(gl, ShaderRegistry, this.cache);
        
        this.preloadAssets();
    }

    preloadAssets() {
        const add = (name, geo) => this.cache.upload(name, geo);
        
        add('cube', Primitives.createCube());
        add('sphere', Primitives.createSphere());
        add('sky_box', GeoUtils.transform(Primitives.createCube(), 0,0,0, 500,500,500));
        
        console.log("B\"H - Preloading Adam Kadmon...");
        const adam = CharacterGen.createRiggedHumanoid();
        
        if (adam.bones && adam.bones.vertices.length > 0) {
             add('human_bones', adam.bones);
        }

        if (adam.skin && adam.skin.vertices.length > 0) {
             add('human_skin', adam.skin);
        }

        add('human_muscles', adam.muscles);
        add('human_hair', adam.hair);
    }

    resize(w, h) {
        this.canvas.width = w; 
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
    }

    render(scene, time, camera) {
        const gl = this.gl;
        gl.clearColor(0.1, 0.1, 0.12, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (!scene || !camera || !camera.target) return;

        const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
        const proj = new Mat4().perspective((camera.fov || 45) * Math.PI / 180, aspect, 0.1, 2000);
        
        const camX = (camera.radius || 40) * Math.sin(camera.phi || 1) * Math.cos(camera.theta || 0);
        const camY = (camera.radius || 40) * Math.cos(camera.phi || 1);
        const camZ = (camera.radius || 40) * Math.sin(camera.phi || 1) * Math.sin(camera.theta || 0);
        const camPos = { 
            x: camX + (camera.target.x || 0), 
            y: camY + (camera.target.y || 0), 
            z: camZ + (camera.target.z || 0) 
        };
        const view = new Mat4().lookAt(camPos, camera.target, {x:0, y:1, z:0});

        this.drawSky(proj, view, time);
        this.drawer.drawScene(scene, time, proj, view, camPos);
    }

    drawSky(proj, view, time) {
        const gl = this.gl;
        const skyProg = ShaderRegistry.get('sky');
        if (!skyProg) return;

        gl.useProgram(skyProg);
        gl.depthMask(false);
        gl.cullFace(gl.FRONT); // We are inside the skybox
        
        const sunPos = {x: Math.cos(time * 0.05), y: 0.6 + Math.sin(time * 0.02) * 0.2, z: Math.sin(time * 0.05)};
        gl.uniformMatrix4fv(gl.getUniformLocation(skyProg, 'uProj'), false, proj.data);
        gl.uniformMatrix4fv(gl.getUniformLocation(skyProg, 'uView'), false, view.data);
        gl.uniform3f(gl.getUniformLocation(skyProg, 'uSunPos'), sunPos.x, sunPos.y, sunPos.z);
        
        this.drawer.bindAndDraw('sky_box', skyProg);
        
        gl.cullFace(gl.BACK); // Restore for scene
        gl.depthMask(true);
    }
}
