// B"H
import { createObject } from '../../types/objects.js';

export const Interaction = {
    // GRAB: Moves object from scene root to actor's child hierarchy (bone)
    grab: (scene, actorId, targetId, boneName = 'hand_r') => {
        const actor = scene.objects.find(o => o.id === actorId);
        if (!actor) return;
        
        // Find bone recursively
        const findBone = (node) => {
            if (node.name.includes(boneName)) return node;
            if (node.children) {
                for (const c of node.children) {
                    const res = findBone(c);
                    if (res) return res;
                }
            }
            return null;
        };
        const bone = findBone(actor);
        if (!bone) return;

        // Find target in scene root
        const targetIdx = scene.objects.findIndex(o => o.id === targetId);
        if (targetIdx === -1) return;
        const target = scene.objects[targetIdx];
        
        // REPARENT
        scene.objects.splice(targetIdx, 1);
        bone.children.push(target);
        
        // Reset transform to be held relative to bone
        target.transform.position = {x:0, y:0, z:0};
        target.transform.rotation = {x:0, y:0, z:0};
        
        // Update components
        actor.components.interaction.holding = targetId;
        target.components.interaction.heldBy = actorId;
        
        console.log(`${actorId} grabbed ${targetId} with ${boneName}`);
    },

    // USE: Triggers 'use' state (e.g., pulling trigger on hose)
    useItem: (actor) => {
        if (actor.components.interaction.holding) {
             // Find the held item object in hierarchy
             // Helper to find child by ID
             const findHeld = (node) => {
                 if (node.id === actor.components.interaction.holding) return node;
                 if (node.children) {
                     for (const c of node.children) {
                         const r = findHeld(c);
                         if (r) return r;
                     }
                 }
                 return null;
             };
             const item = findHeld(actor);
             if (item) {
                 if (item.components.fluidEmitter) {
                     item.components.fluidEmitter.active = true;
                 }
             }
        }
    },
    
    stopUsing: (actor) => {
         // Logic to stop using
         const findHeld = (node) => {
             if (node.id === actor.components.interaction.holding) return node;
             if (node.children) {
                 for (const c of node.children) {
                     const r = findHeld(c);
                     if (r) return r;
                 }
             }
             return null;
         };
         const item = findHeld(actor);
         if (item && item.components.fluidEmitter) item.components.fluidEmitter.active = false;
    },

    blow: (actor, active = true) => {
        if (!actor.components.interaction) return;
        actor.components.interaction.isBlowing = active;
        // Animation state update is handled by AnimationEngine looking at this flag
        // Physics update is handled by PhysicsEngine looking at this flag
        if (active) console.log(`${actor.id} is blowing air.`);
    }
};