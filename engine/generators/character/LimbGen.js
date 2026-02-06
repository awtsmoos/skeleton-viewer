// B"H
import { createObject } from '../../../types/objects.js';
import { SkeletonGen } from '../bio/SkeletonGen.js';

export const attachLimbs = (ribcage, pelvis, id, len, clothType, shoulderWidth) => {
    const createArm = (side) => {
         const sx = (side === 'r' ? 1 : -1) * 0.35 * shoulderWidth;
         
         const shoulder = createObject(id(`shoulder_${side}`), 'sphere', `Shoulder ${side}`);
         shoulder.transform.position.x = sx;
         shoulder.transform.position.y = 0.2;
         shoulder.transform.scale = {x:0.15, y:0.15, z:0.15};
         ribcage.children.push(shoulder);
         
         const armBone = SkeletonGen.createBone(id(`arm_${side}`), len, 0.1).joint;
         armBone.transform.position.y = -0.1;
         shoulder.children.push(armBone);
         
         if (clothType === 2) {
             const sleeve = createObject(id(`sleeve_${side}`), 'cube', 'Sleeve');
             sleeve.transform.position.y = -len/2;
             sleeve.transform.scale = {x: 0.15, y: len, z: 0.15};
             sleeve.material.color = [0.1, 0.1, 0.2];
             armBone.children.push(sleeve);
         }

         const forearm = SkeletonGen.createBone(id(`forearm_${side}`), len, 0.08).joint;
         forearm.transform.position.y = -len;
         armBone.children.push(forearm);
         
         const hand = SkeletonGen.createHand(side, 1.0);
         hand.transform.position.y = -len;
         forearm.children.push(hand);
    };
    createArm('l'); createArm('r');

    const createLeg = (side) => {
         const tx = (side === 'r' ? 1 : -1) * 0.2;
         
         const thigh = SkeletonGen.createBone(id(`thigh_${side}`), len*1.2, 0.15).joint;
         thigh.transform.position = { x: tx, y: -0.1, z: 0 };
         pelvis.children.push(thigh);
         
         const shin = SkeletonGen.createBone(id(`shin_${side}`), len*1.2, 0.12).joint;
         shin.transform.position.y = -len*1.2;
         thigh.children.push(shin);
         
         const foot = createObject(id(`foot_${side}`), 'cube', 'Foot');
         foot.transform.position.y = -len*1.2;
         foot.transform.position.z = 0.1;
         foot.transform.scale = {x:0.15, y:0.1, z:0.3};
         shin.children.push(foot);
    };
    createLeg('l'); createLeg('r');
};