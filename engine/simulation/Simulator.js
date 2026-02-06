
// B"H
import { Vec3 } from '../math/Vec3.js';
import { Behaviors } from './Behaviors.js';
import { AudioFXGen } from '../audio/AudioFXGen.js';
import { GlobalAudio } from '../audio/AudioEngine.js';
import { PhysicsEngine } from './Physics.js';
import { BiologyEngine } from './Biology.js'; 
import { GlobalAnimation } from '../animation/AnimationEngine.js';
import { GlobalKeyframes } from '../animation/KeyframeSystem.js';
import { Interaction } from './Interaction.js'; 
import { GlobalLogic } from '../logic/LogicEngine.js'; 
import { GlobalAtmosphere } from './Atmosphere.js'; 
import { AnatomySolver } from './AnatomySolver.js';

export class Simulator {
    constructor() {
        this.registry = new Map();
        this.lastTime = 0;
        this.physics = new PhysicsEngine();
        this.biology = new BiologyEngine(); 
        this.anatomySolver = new AnatomySolver();
    }

    step(scene, time) {
        if (!scene || !scene.objects) return;
        
        const dt = Math.max(0, Math.min(time - this.lastTime, 0.1)); 
        this.lastTime = time;

        // --- THE DIVINE CASCADE OF MANIFESTATION ---

        // 0. The World Itself Breathes (Environment)
        GlobalAtmosphere.update(dt);

        // 1. The Flow of Time (Keyframes)
        GlobalKeyframes.update(scene, time);

        // 2. The Spark of Consciousness (Logic & Events)
        GlobalLogic.update(scene, time, dt);

        // 3. The Laws of Motion (Physics)
        this.physics.update(scene, dt);
        
        // 4. The Processes of Life (Biology)
        this.biology.update(scene, dt);

        // 5. The Will to Move (Anatomy & Animation)
        scene.objects.forEach(obj => {
            if (obj.type === 'human_rigged' && obj.components?.human?.skeleton) {
                // A. The Higher Brain: Determine the Will (Muscle Activations)
                const muscleState = GlobalAnimation.getMuscleActivationState(obj, time);
                
                // B. The Lower Brain: Translate Will into Action (Solve for Bone Rotations)
                this.anatomySolver.solve(obj.components.human.skeleton, muscleState, dt);
            }
        });
        
        // 6. The Higher-Order Actions (Behaviors)
        scene.objects.forEach(obj => {
            this.processComponents(obj, scene, time, dt);
        });
    }

    processComponents(obj, scene, time, dt) {
        const comps = obj.components || {};

        if (comps.behavior) {
            if (comps.behavior.type === 'flock') Behaviors.flock(obj, scene, time);
            if (comps.behavior.type === 'orbit') Behaviors.orbit(obj, {x:0,y:0,z:0}, 1.0, 10, time);
            if (comps.behavior.type === 'battle') Behaviors.battle(obj, scene, time);
        }

        if (comps.interaction && comps.interaction.isUsing) {
             Interaction.useItem(obj);
        }

        if (comps.audio && comps.audio.enabled && GlobalAudio.ctx) {
             if (Math.random() < 0.01) { 
                 const soundType = comps.audio.soundType || 'wind';
                 AudioFXGen.play(GlobalAudio.ctx, GlobalAudio.masterGain, soundType);
             }
        }
    }
}

export const GlobalSimulator = new Simulator();
