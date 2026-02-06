// B"H
import { Vec3 } from '../math/Vec3.js';

export class LogicEngine {
    constructor() {
        this.eventQueue = [];
    }

    emit(event, context) {
        this.eventQueue.push({ event, context });
    }

    update(scene, time, dt) {
        // Global Events
        while(this.eventQueue.length > 0) {
            this.handleEvent(scene, this.eventQueue.shift());
        }

        // Object Scripts
        scene.objects.forEach(obj => {
            if (obj.components.logic && obj.components.logic.scripts) {
                obj.components.logic.scripts.forEach(script => {
                    if (script.trigger === 'tick') {
                        this.execute(obj, script, scene, dt, time);
                    }
                });
            }
        });
    }

    handleEvent(scene, { event, context }) {
        scene.objects.forEach(obj => {
            if (obj.components.logic && obj.components.logic.scripts) {
                obj.components.logic.scripts.forEach(script => {
                    if (script.trigger === event) {
                        this.execute(obj, script, scene, 0, 0, context);
                    }
                });
            }
        });
    }

    execute(obj, script, scene, dt, time, context) {
        const p = script.params || {};
        switch(script.action) {
            case 'rotate':
                obj.transform.rotation.y += (p.speed || 1.0) * dt;
                break;
            case 'pulsate':
                // Scale oscillates around base 1.0 (or original scale if we tracked it)
                const base = p.baseScale || 1.0;
                const s = base + Math.sin(time * (p.speed || 5.0)) * (p.amount || 0.1);
                obj.transform.scale = {x:s, y:s, z:s};
                break;
            case 'destroy':
                if (!obj.components.lifecycle) obj.components.lifecycle = {};
                obj.components.lifecycle.age = 9999;
                break;
            case 'color':
                obj.material.color = p.color || [1,0,0];
                break;
            case 'explode':
                if (!obj.components.logic) obj.components.logic = {};
                obj.components.logic.explodeNextTick = true;
                break;
        }
    }
}

export const GlobalLogic = new LogicEngine();
