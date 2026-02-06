// B"H
/**
 * AnimationData: The Divine Motion Repository
 * Manages all animation keyframe data
 */

import idleData from '../../data/animations/idle.json';
import walkData from '../../data/animations/walk.json';
import runData from '../../data/animations/run.json';
import waveData from '../../data/animations/wave.json';
import talkData from '../../data/animations/talk.json';

export const AnimationData = {
    animations: {
        idle: idleData,
        walk: walkData,
        run: runData,
        wave: waveData,
        talk: talkData
    },

    /**
     * Get animation by name
     */
    get: (name) => {
        return AnimationData.animations[name] || null;
    },

    /**
     * Get all available animation names
     */
    getAvailable: () => {
        return Object.keys(AnimationData.animations);
    },

    /**
     * Sample animation at a specific time
     * @param {string} name - Animation name
     * @param {number} time - Time in seconds
     * @returns {Object} Bone transforms at that time
     */
    sample: (name, time) => {
        const anim = AnimationData.get(name);
        if (!anim) return {};

        const duration = anim.duration || 1;
        const normalizedTime = anim.loop 
            ? (time % duration) 
            : Math.min(time, duration);

        const result = {};
        const keyframes = anim.keyframes || {};

        Object.keys(keyframes).forEach(boneName => {
            const boneKeyframes = keyframes[boneName];
            if (!boneKeyframes || boneKeyframes.length === 0) return;

            // Find surrounding keyframes
            let prev = boneKeyframes[0];
            let next = boneKeyframes[boneKeyframes.length - 1];

            for (let i = 0; i < boneKeyframes.length - 1; i++) {
                if (boneKeyframes[i].time <= normalizedTime && 
                    boneKeyframes[i + 1].time >= normalizedTime) {
                    prev = boneKeyframes[i];
                    next = boneKeyframes[i + 1];
                    break;
                }
            }

            // Interpolate
            const t = prev.time === next.time ? 0 :
                (normalizedTime - prev.time) / (next.time - prev.time);

            result[boneName] = AnimationData.lerpKeyframes(prev, next, t);
        });

        return result;
    },

    /**
     * Lerp between two keyframes
     */
    lerpKeyframes: (a, b, t) => {
        const result = {};

        if (a.rotation && b.rotation) {
            result.rotation = [
                a.rotation[0] + (b.rotation[0] - a.rotation[0]) * t,
                a.rotation[1] + (b.rotation[1] - a.rotation[1]) * t,
                a.rotation[2] + (b.rotation[2] - a.rotation[2]) * t
            ];
        }

        if (a.position && b.position) {
            result.position = [
                a.position[0] + (b.position[0] - a.position[0]) * t,
                a.position[1] + (b.position[1] - a.position[1]) * t,
                a.position[2] + (b.position[2] - a.position[2]) * t
            ];
        }

        if (a.scale && b.scale) {
            result.scale = [
                a.scale[0] + (b.scale[0] - a.scale[0]) * t,
                a.scale[1] + (b.scale[1] - a.scale[1]) * t,
                a.scale[2] + (b.scale[2] - a.scale[2]) * t
            ];
        }

        return result;
    },

    /**
     * Get blend shape data for animation
     */
    getBlendShapes: (name) => {
        const anim = AnimationData.get(name);
        return anim?.blendShapes || null;
    }
};
