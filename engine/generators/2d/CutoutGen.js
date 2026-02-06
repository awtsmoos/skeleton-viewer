// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { createObject } from '../../../types/objects.js';

export const CutoutGen = {
    // A 'Paper' character is a hierarchy of Planes, not Cubes.
    // They are offset slightly on Z to layer them (painter's algorithm via geometry).
    createPaperMan: (blueprint = {}) => {
        const root = createObject(`paper_${Date.now()}`, 'paper_character', 'Paper Man');
        root.material.type = 'paper';
        
        // Dimensions
        const scale = 1.0;
        const layerDepth = 0.01; // Tiny z-offset to prevent z-fighting
        
        // 1. BODY (The base layer)
        const body = createObject('paper_body', 'plane', 'Body');
        body.transform.scale = {x: 0.5, y: 0.6, z: 1};
        body.transform.position.y = 0.6;
        body.transform.rotation.x = Math.PI / 2; // Face Z-forward (Plane is XZ usually, rotate to XY)
        // Actually, Primitives.createPlane is XZ. We rotate it 90 on X to stand up.
        // Wait, 'plane' generator in Primitives makes XZ. 
        // Let's assume we use a 'quad' generator or rotate standard plane.
        body.material.color = [0.8, 0.2, 0.2]; // Red shirt
        body.material.type = 'paper';
        root.children.push(body);
        
        // 2. HEAD (Layer +1)
        const head = createObject('paper_head', 'plane', 'Head');
        head.transform.position = {x: 0, y: 1.3, z: layerDepth};
        head.transform.scale = {x: 0.6, y: 0.6, z: 1};
        head.transform.rotation.x = Math.PI / 2;
        head.material.color = [0.9, 0.7, 0.6]; // Skin
        head.material.type = 'paper';
        root.children.push(head);
        
        // Eyes (Layer +2)
        const eyeL = createObject('paper_eye_l', 'plane', 'Eye L');
        eyeL.transform.position = {x: -0.2, y: 0.1, z: layerDepth}; // Relative to Head? 
        // Note: In this engine 'children' inherit transform matrix. 
        // So we should attach eyes to head.
        // Let's restructure to parenting.
        
        // RE-DO structure for parenting:
        // Root -> Body
        // Root -> Head
        // Head -> Eyes
        
        // Head Eyes
        const createEye = (x) => {
            const eye = createObject('eye', 'plane', 'Eye');
            eye.transform.position = {x: x, y: 0.1, z: layerDepth};
            eye.transform.scale = {x: 0.25, y: 0.3, z: 1};
            eye.material.color = [1,1,1];
            eye.material.type = 'paper';
            
            const pupil = createObject('pupil', 'plane', 'Pupil');
            pupil.transform.position = {x: 0.05, y: 0, z: layerDepth};
            pupil.transform.scale = {x: 0.2, y: 0.2, z: 1};
            pupil.material.color = [0,0,0];
            pupil.material.type = 'paper';
            eye.children.push(pupil);
            return eye;
        };
        head.children.push(createEye(-0.4));
        head.children.push(createEye(0.4));
        
        // Mouth (Layer +2)
        const mouth = createObject('mouth', 'plane', 'Mouth');
        mouth.transform.position = {x:0, y:-0.25, z:layerDepth};
        mouth.transform.scale = {x:0.3, y:0.05, z:1};
        mouth.material.color = [0,0,0];
        mouth.material.type = 'paper';
        head.children.push(mouth);
        
        // 3. LIMBS (Layer -1 for back, +1 for front)
        // Arms
        const armL = createObject('arm_l', 'plane', 'Arm L');
        armL.transform.position = {x: -0.6, y: 0.8, z: -layerDepth}; // Behind body
        armL.transform.scale = {x: 0.15, y: 0.4, z: 1};
        armL.transform.rotation.x = Math.PI / 2;
        armL.transform.rotation.z = 0.2;
        armL.material.color = [0.8, 0.2, 0.2];
        armL.material.type = 'paper';
        root.children.push(armL);
        
        const armR = createObject('arm_r', 'plane', 'Arm R');
        armR.transform.position = {x: 0.6, y: 0.8, z: layerDepth}; // In front
        armR.transform.scale = {x: 0.15, y: 0.4, z: 1};
        armR.transform.rotation.x = Math.PI / 2;
        armR.transform.rotation.z = -0.2;
        armR.material.color = [0.8, 0.2, 0.2];
        armR.material.type = 'paper';
        root.children.push(armR);
        
        // Legs
        const leg = createObject('leg', 'plane', 'Leg');
        leg.transform.scale = {x: 0.2, y: 0.3, z: 1};
        leg.transform.rotation.x = Math.PI / 2;
        leg.material.color = [0.2, 0.2, 0.8]; // Blue pants
        leg.material.type = 'paper';
        
        const legL = JSON.parse(JSON.stringify(leg));
        legL.id = 'leg_l';
        legL.transform.position = {x: -0.2, y: 0.3, z: -layerDepth};
        root.children.push(legL);
        
        const legR = JSON.parse(JSON.stringify(leg));
        legR.id = 'leg_r';
        legR.transform.position = {x: 0.2, y: 0.3, z: -layerDepth};
        root.children.push(legR);

        return root;
    }
};