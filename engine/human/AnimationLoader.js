
// B"H
/**
 * AnimationLoader: The Scribe of Motion.
 * This sacred archivist loads the scrolls of animation, written not as dead data, but as living modules.
 * It provides the means to interpret these scrolls, sampling the divine will of motion at any given moment.
 */
import idleAnim from '../../data/animations/idle.js';
import walkAnim from '../../data/animations/walk.js';
import runAnim from '../../data/animations/run.js';
import talkAnim from '../../data/animations/talk.js';
import waveAnim from '../../data/animations/wave.js';
// The new, hyper-detailed surprise animations
import kavanahMeditationAnim from '../../data/animations/kavanah_meditation.js';
import heroicPoseAnim from '../../data/animations/heroic_pose.js';
import daveningAnim from '../../data/animations/davening.js';
import breakdanceFlareAnim from '../../data/animations/breakdance_flare.js';
import divineGestureAnim from '../../data/animations/divine_gesture.js';

export const AnimationLoader = {
    animations: {
        idle: idleAnim, walk: walkAnim, run: runAnim,
        talk: talkAnim, wave: waveAnim,
        kavanah_meditation: kavanahMeditationAnim,
        heroic_pose: heroicPoseAnim,
        davening: daveningAnim,
        breakdance_flare: breakdanceFlareAnim,
        divine_gesture: divineGestureAnim
    },

    get: (name) => AnimationLoader.animations[name] || null,
    list: () => Object.keys(AnimationLoader.animations),

    /**
     * Interpolates all tracks in an animation for a given time.
     */
    sampleAnimation: (animName, time) => {
        const anim = AnimationLoader.get(animName);
        if (!anim || !anim.keyframes) return null;
        
        const duration = anim.duration;
        const loopTime = anim.loop ? (time % duration) : Math.min(time, duration);
        
        const pose = {};
        
        for (const boneId in anim.keyframes) {
            const keyframes = anim.keyframes[boneId];
            if (!keyframes || keyframes.length === 0) continue;

            let prev = keyframes[0];
            let next = keyframes[keyframes.length - 1];

            // Find surrounding keyframes
            for (let i = 0; i < keyframes.length - 1; i++) {
                if (keyframes[i].time <= loopTime && keyframes[i+1].time >= loopTime) {
                    prev = keyframes[i];
                    next = keyframes[i+1];
                    break;
                }
            }
             
            // Handle edge case where time is exactly on the last frame
            if (loopTime >= next.time) {
                 prev = next;
            }

            const t = (next.time - prev.time === 0) ? 1 : 
                (loopTime - prev.time) / (next.time - prev.time);

            const interpolated = {};
            if (prev.rotation && next.rotation) {
                interpolated.rotation = AnimationLoader.lerpArray(prev.rotation, next.rotation, t);
            }
            if (prev.position && next.position) {
                interpolated.position = AnimationLoader.lerpArray(prev.position, next.position, t);
            }
            if (prev.scale && next.scale) {
                interpolated.scale = AnimationLoader.lerpArray(prev.scale, next.scale, t);
            }
            
            pose[boneId] = interpolated;
        }
        
        return pose;
    },

    lerpArray: (a, b, t) => a.map((v, i) => v + (b[i] - v) * t),
};
