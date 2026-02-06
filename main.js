// B"H
import { WebGLEngine } from './engine/WebGLEngine.js';
import { InputController } from './engine/core/InputController.js';

console.log("B\"H - main.js: Logic Module Loaded.");

// State Container
const STATE = {
    engine: null,
    input: null,
    time: 0,
    scene: {
        activeCameraId: 'main',
        objects: [
            {
                id: 'adam_restored', type: 'human_rigged', name: 'Adam Restored',
                transform: {
                    position: {x: 0, y: -10, z: 0},
                    rotation: {x: 0, y: 0.4, z: 0},
                    scale: {x: 10, y: 10, z: 10}
                },
                material: { type: 'standard' },
                isAbsolute: true
            }
        ]
    },
    camera: {
        theta: 0, 
        phi: 1.5, 
        radius: 120, // Wider radius to see the full restored body
        target: { x: 0, y: 0, z: 0 }, 
    }
};

export function initNativeApp() {
    console.log("B\"H - main.js: initNativeApp() called.");

    const canvas = document.getElementById('gl-canvas');
    if (!canvas) return;

    try {
        STATE.engine = new WebGLEngine(canvas);
        STATE.input = new InputController(canvas, STATE.camera);
        
        setupUI();
        handleResize();
        window.addEventListener('resize', handleResize);

        requestAnimationFrame(loop);
    } catch (e) {
        console.error("B\"H - Logic Initialization Failed:", e);
    }
}

function handleResize() {
    if (STATE.engine) {
        STATE.engine.resize(window.innerWidth, window.innerHeight);
    }
}

function loop(t) {
    STATE.time = t / 1000;
    
    if (STATE.input) STATE.input.update();
    if (STATE.engine) STATE.engine.render(STATE.scene, STATE.time, STATE.camera);

    requestAnimationFrame(loop);
}

function setupUI() {
    const toggleBtn = document.getElementById('toggle-ui');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const panel = document.getElementById('ui-container');
            if (panel) panel.classList.toggle('minimized');
        });
    }

    const bindToggle = (id, layer) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => {
                if (STATE.engine) STATE.engine.setAnatomyVisibility(layer, e.target.checked);
            });
        }
    };

    bindToggle('toggle-skeleton', 'skeleton');
    bindToggle('toggle-muscles', 'muscles');
    bindToggle('toggle-skin', 'skin');
}
