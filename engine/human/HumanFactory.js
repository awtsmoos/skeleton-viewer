// B"H
/**
 * HumanFactory: The Divine Human Constructor
 * Main factory for creating complete human entities
 */

import { SkeletonData } from './SkeletonData.js';
import { MuscleData } from './MuscleData.js';
import { FaceData } from './FaceData.js';
import { DNASystem } from './DNASystem.js';
import { BoneHierarchy } from './BoneHierarchy.js';
import { UnifiedSkinGen } from './UnifiedSkinGen.js';
import { AnimationData } from './AnimationData.js';
import { createObject } from '../../types/objects.js';

export const HumanFactory = {
    /**
     * Create a complete human with all systems
     * @param {Object} options - Creation options
     * @returns {Object} Complete human scene object
     */
    create: (options = {}) => {
        const id = `human_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // Generate or use provided DNA
        const dna = options.dna || DNASystem.generateRandom();
        
        // Create root object
        const human = createObject(id, 'human_unified', options.name || 'Human');
        
        // Build bone hierarchy
        const skeleton = BoneHierarchy.build();
        
        // Generate unified skin mesh
        const skinGeo = UnifiedSkinGen.generate(dna);
        
        // Store data on the human object
        human.components.human = {
            dna: dna,
            skeleton: skeleton,
            skinGeometry: skinGeo,
            
            // Animation state
            currentAnimation: 'idle',
            animationTime: 0,
            blendShapes: {},
            
            // Expression state
            expression: 'neutral',
            blinkTimer: 0,
            nextBlink: 2 + Math.random() * 3,
            
            // Jaw/mouth state
            mouthOpen: 0, // 0 = closed, 1 = fully open
            
            // Eye state
            eyeTarget: { x: 0, y: 0, z: 10 }, // Looking forward
            eyelidOpen: 1, // 0 = closed, 1 = open
        };

        // Set material based on DNA
        human.material.type = 'skin_realistic';
        human.material.color = DNASystem.skinToneToColor(dna.skinTone, dna.skinSubtone);
        human.material.subsurface = 0.3; // SSS for realistic skin
        human.material.roughness = 0.6;

        // Store geometry reference for renderer
        human.blueprint.geometry = skinGeo;
        human.blueprint.dna = dna;

        return human;
    },

    /**
     * Create human with specific preset
     */
    createFromPreset: (presetName, options = {}) => {
        const dna = DNASystem.fromPreset(presetName);
        return HumanFactory.create({ ...options, dna });
    },

    /**
     * Update human animation state
     */
    update: (human, deltaTime, totalTime) => {
        const comp = human.components?.human;
        if (!comp) return;

        // Update animation time
        comp.animationTime += deltaTime;

        // Sample current animation
        const animPose = AnimationData.sample(
            comp.currentAnimation, 
            comp.animationTime
        );

        // Apply pose to skeleton
        if (comp.skeleton && animPose) {
            Object.keys(animPose).forEach(boneName => {
                const bone = comp.skeleton.get(boneName);
                if (bone && animPose[boneName].rotation) {
                    bone.currentRotation = animPose[boneName].rotation;
                }
            });
        }

        // Handle blinking
        comp.blinkTimer += deltaTime;
        if (comp.blinkTimer >= comp.nextBlink) {
            comp.eyelidOpen = 0;
            setTimeout(() => {
                if (comp) comp.eyelidOpen = 1;
            }, 150);
            comp.blinkTimer = 0;
            comp.nextBlink = 2.5 + Math.random() * 2.5;
        }

        // Update blend shapes for face
        comp.blendShapes = {
            blink: 1 - comp.eyelidOpen,
            mouthOpen: comp.mouthOpen
        };
    },

    /**
     * Set animation on human
     */
    setAnimation: (human, animName) => {
        if (human.components?.human) {
            human.components.human.currentAnimation = animName;
            human.components.human.animationTime = 0;
        }
    },

    /**
     * Set expression on human face
     */
    setExpression: (human, expression) => {
        if (human.components?.human) {
            human.components.human.expression = expression;
            
            // Get muscles involved in expression
            const muscles = MuscleData.getMusclesByBlendShape(expression);
            
            // Update blend shapes based on muscles
            muscles.forEach(m => {
                human.components.human.blendShapes[m.action] = 1.0;
            });
        }
    },

    /**
     * Make human look at a target
     */
    lookAt: (human, target) => {
        if (human.components?.human) {
            human.components.human.eyeTarget = target;
        }
    },

    /**
     * Open/close mouth
     */
    setMouthOpen: (human, amount) => {
        if (human.components?.human) {
            human.components.human.mouthOpen = Math.max(0, Math.min(1, amount));
        }
    }
};
