// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { SkeletonGen } from './SkeletonGen.js';
import { createObject } from '../../../types/objects.js';

export const UniversalCreatureGen = {
    // Blueprint Example:
    // {
    //   bodyShape: 'sphere', spineLength: 4, 
    //   limbs: [ 
    //      { count: 6, segments: 2, digits: 8, pos: [0.1, 0.2, 0.8, 0.8, 0.9, 0.9] },
    //   ],
    //   heads: [
    //      { pos: 0, scale: 1.0, dna: { toothSharpness: 9 } },
    //      { pos: 0, scale: 0.8, offsetX: 0.5 },
    //      { pos: 0, scale: 0.8, offsetX: -0.5 }
    //   ]
    // }
    build: (blueprint = {}) => {
        const root = createObject(`creature_${Date.now()}`, 'creature', 'Universal Being');
        root.components.animation.active = true;
        root.material.color = [0.5, 0.8, 0.5];

        const bodyType = blueprint.bodyShape || 'sphere';
        const spineLen = blueprint.spineLength || 4;
        
        // 1. SPINE GENERATION
        const spineSegments = [];
        
        for(let i=0; i<spineLen; i++) {
             const t = i / Math.max(1, spineLen-1);
             const scale = 1.0 - Math.abs(t - 0.5) * 0.5; 
             
             // Create segment
             const segment = createObject(`spine_${i}`, bodyType, `Spine ${i}`);
             segment.transform.position = {x:0, y:0, z: -1.0 }; // Relative to previous
             segment.transform.scale = {x:scale, y:scale, z:scale};
             
             if (i === 0) {
                 root.children.push(segment); // First segment attached to root
             } else {
                 spineSegments[i-1].children.push(segment); // Chain
             }
             spineSegments.push(segment);
        }

        // 2. HEADS
        const heads = blueprint.heads || [{ pos: 0, scale: 1.0 }]; // Default 1 head
        heads.forEach((headDef, idx) => {
            const segIdx = Math.min(Math.floor((headDef.pos || 0) * (spineLen-1)), spineLen-1);
            const parent = spineSegments[segIdx] || root;
            
            // Neck connector
            const neck = createObject(`neck_${idx}`, 'bone', `Neck ${idx}`);
            neck.transform.position = {
                x: headDef.offsetX || 0, 
                y: 0.8, 
                z: 0.2
            };
            // Fan out heads if multiple on same segment
            if (headDef.offsetX) neck.transform.rotation.z = headDef.offsetX * -0.5; 
            
            const skull = SkeletonGen.createSkull(headDef.scale || 1.0, headDef.dna || {}, `_${idx}`);
            skull.transform.position.y = 0.3;
            
            neck.children.push(skull);
            parent.children.push(neck);
        });

        // 3. LIMBS
        if (blueprint.limbs) {
            blueprint.limbs.forEach((limbDef, limbSetIdx) => {
                const positions = limbDef.pos || [0.2, 0.8]; // Normalized positions along spine
                
                positions.forEach((posT, pIdx) => {
                    const segIdx = Math.min(Math.floor(posT * (spineLen-1)), spineLen-1);
                    const parent = spineSegments[segIdx] || root;
                    const digits = limbDef.digits || 3;
                    
                    // Left Arm
                    const armL = UniversalCreatureGen.createComplexLimb(`limb_${limbSetIdx}_${pIdx}_l`, 'l', limbDef);
                    armL.transform.position = {x: -0.8, y: 0, z: 0};
                    parent.children.push(armL);

                    // Right Arm
                    const armR = UniversalCreatureGen.createComplexLimb(`limb_${limbSetIdx}_${pIdx}_r`, 'r', limbDef);
                    armR.transform.position = {x: 0.8, y: 0, z: 0};
                    parent.children.push(armR);
                });
            });
        }
        
        return root;
    },

    createComplexLimb: (idPrefix, side, def) => {
        const root = createObject(`${idPrefix}_shoulder`, 'sphere', 'Shoulder');
        root.transform.scale = {x:0.3, y:0.3, z:0.3};
        
        let currentParent = root;
        const segments = def.segments || 2;
        const len = 1.0;
        
        // Arms
        for(let i=0; i<segments; i++) {
            const bone = SkeletonGen.createBone(`${idPrefix}_seg_${i}`, len, 0.1).joint;
            bone.transform.position.y = (i===0) ? -0.2 : -len;
            currentParent.children.push(bone);
            currentParent = bone;
        }
        
        // Hand/Claw with N fingers
        const hand = SkeletonGen.createHand(side, 1.0, def.digits || 5);
        hand.transform.position.y = -len;
        currentParent.children.push(hand);
        
        return root;
    }
};