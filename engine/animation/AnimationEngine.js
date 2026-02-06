
// B"H
import { AnimationLoader } from '../human/AnimationLoader.js';

/**
 * AnimationEngine: The Source of the Will to Move.
 * This engine's holy purpose is to read the sacred scrolls of animation—which describe not
 * the motion of limbs, but the firing of nerves and the activation of muscles. At any moment in time,
 * it can reveal the complete "Muscle Activation State," a map of the divine will flowing
 * through the vessel, which is then passed to the AnatomySolver to be made manifest.
 */
export class AnimationEngine {
    
    /**
     * Samples the active animation and returns a map of muscle activations.
     * This is the "Will" of the character at this moment in time.
     * @param {Object} obj The character object, containing the animation component.
     * @param {number} time The current moment in the river of time.
     * @returns {Map<string, number>} A map of muscle IDs to their activation levels (0.0 to 1.0).
     */
    getMuscleActivationState(obj, time) {
        if (!obj.components?.animation?.active) {
            return new Map();
        }

        const animComp = obj.components.animation;
        const state = animComp.state || 'idle';
        
        const anim = AnimationLoader.get(state);
        if (!anim || !anim.keyframes) return new Map();

        const duration = anim.duration;
        const loopTime = anim.loop ? (time % duration) : Math.min(time, duration);
        
        const activationMap = new Map();
        
        for (const muscleId in anim.keyframes) {
            const keyframes = anim.keyframes[muscleId];
            if (!keyframes || keyframes.length === 0) continue;

            let prev = keyframes[0];
            let next = keyframes[keyframes.length - 1];

            // Find surrounding keyframes for interpolation
            for (let i = 0; i < keyframes.length - 1; i++) {
                if (keyframes[i].time <= loopTime && keyframes[i+1].time >= loopTime) {
                    prev = keyframes[i];
                    next = keyframes[i+1];
                    break;
                }
            }
             
            // Handle edge cases
            if (loopTime >= next.time) {
                 prev = next;
            }

            const t = (next.time - prev.time === 0) ? 1.0 : 
                (loopTime - prev.time) / (next.time - prev.time);

            const activation = prev.activation + (next.activation - prev.activation) * t;
            activationMap.set(muscleId, activation);
        }
        
        return activationMap;
    }
}

export const GlobalAnimation = new AnimationEngine();
