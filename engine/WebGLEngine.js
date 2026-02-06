// B"H
import { Renderer } from './core/Renderer.js';

/**
 * WebGLEngine: The Divine Overseer.
 */
export class WebGLEngine {
    constructor(canvas) {
        this.renderer = new Renderer(canvas);
    }

    resize(w, h) {
        this.renderer.resize(w, h);
    }

    render(scene, time, camera) {
        this.renderer.render(scene, time, camera);
    }
    
    setAnatomyVisibility(layer, visible) {
        if (this.renderer && this.renderer.drawer) {
            this.renderer.drawer.setVisibility(layer, visible);
        }
    }
}
