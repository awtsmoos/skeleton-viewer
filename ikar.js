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
                id: 'cube_left', type: 'cube', name: 'Vessel of Chesed',
                transform: { 
                    position: {x: -30, y: 20, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    scale: {x: 20, y: 20, z: 20}
                },
                material: { type: 'standard', color: [0, 1, 1] },
                isAbsolute: true
            },
            {
                id: 'cube_right', type: 'cube', name: 'Vessel of Gevurah',
                transform: {
                    position: {x: 30, y: 20, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    scale: {x: 20, y: 20, z: 20}
                },
                material: { type: 'standard', color: [1, 0, 1] },
                isAbsolute: true 
            },
            {
                id: 'adam_kadmon', type: 'human_rigged', name: 'Primordial Human',
                transform: {
                    position: {x: 0, y: -15, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
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
        radius: 150, 
        target: { x: 0, y: 0, z: 0 }, 
    }
};

export function initNativeApp() {
    console.log("B\"H - main.js: initNativeApp() called.");

    const canvas = document.getElementById('gl-canvas');
    if (!canvas) {
        console.error("B\"H - FATAL: Canvas not found.");
        return;
    }

    try {
        STATE.engine = new WebGLEngine(canvas);
        console.log("B\"H - WebGL Engine Initialized.");
        
        STATE.input = new InputController(canvas, STATE.camera);
        
        setupUI();
        handleResize();
        window.addEventListener('resize', handleResize);

        const ta = document.getElementById('manifesto-input');
        if (ta) ta.value = JSON.stringify(STATE.scene, null, 2);

        requestAnimationFrame(loop);

    } catch (e) {
        console.error("B\"H - Logic Initialization Failed:", e);
        document.body.innerHTML += `<div style="color:red;z-index:999;position:fixed;top:0;">${e.message}</div>`;
    }
}

function handleResize() {
    if (STATE.engine) {
        STATE.engine.resize(window.innerWidth, window.innerHeight);
    }
}

function loop(t) {
    STATE.time = t / 1000;

    const cube1 = STATE.scene.objects.find(o => o.id === 'cube_left');
    if (cube1) {
        cube1.transform.rotation.y = STATE.time * 0.5;
        cube1.transform.rotation.x = STATE.time * 0.3;
    }
    const cube2 = STATE.scene.objects.find(o => o.id === 'cube_right');
    if (cube2) {
        cube2.transform.rotation.y = -STATE.time * 0.5;
        cube2.transform.rotation.z = STATE.time * 0.3;
    }
    
    const human = STATE.scene.objects.find(o => o.id === 'adam_kadmon');
    if (human) {
        human.transform.rotation.y = STATE.time * 0.2;
    }

    if (STATE.input) STATE.input.update();
    if (STATE.engine) STATE.engine.render(STATE.scene, STATE.time, STATE.camera);

    requestAnimationFrame(loop);
}

function setupUI() {
    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const ta = document.getElementById('manifesto-input');
            if (ta) {
                try {
                    STATE.scene = JSON.parse(ta.value);
                } catch(e) {
                    alert("JSON Error: " + e.message);
                }
            }
        });
    }

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
