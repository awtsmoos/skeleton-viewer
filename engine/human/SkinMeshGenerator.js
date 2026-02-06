 // B"H
 /**
  * SkinMeshGenerator: Creates a SINGLE continuous skin mesh
  * Wraps around skeleton and muscles using marching technique
  */
 
 import { LoftEngine } from '../geometry/LoftEngine.js';
 import { Primitives } from '../generators/Primitives.js';
 import { GeoUtils } from '../generators/GeoUtils.js';
 import { Vec3 } from '../math/Vec3.js';
 
 export const SkinMeshGenerator = {
     /**
      * Generates continuous skin mesh from body profile
      */
     generate: (skeletonHierarchy, muscleData) => {
         const skinParts = [];
         
         // Build body sections as connected lofts
         skinParts.push(SkinMeshGenerator.createHead());
         skinParts.push(SkinMeshGenerator.createNeck());
         skinParts.push(SkinMeshGenerator.createTorso());
         skinParts.push(...SkinMeshGenerator.createArms());
         skinParts.push(...SkinMeshGenerator.createLegs());
         
         // Weld all parts into continuous mesh
         return LoftEngine.weld(skinParts, 0.005);
     },
 
     /**
      * Creates detailed head mesh with facial features
      */
     createHead: () => {
         const parts = [];
         
         // Main skull shape - high resolution loft
         const headProfile = [
             { y: 1.52, r: 0.065, z: 0.02 },   // Chin
             { y: 1.55, r: 0.075, z: 0.025 },  // Lower jaw
             { y: 1.58, r: 0.082, z: 0.03 },   // Mouth level
             { y: 1.62, r: 0.088, z: 0.025 },  // Upper lip/nose
             { y: 1.66, r: 0.095, z: 0.02 },   // Cheekbones
             { y: 1.70, r: 0.1, z: 0.015 },    // Eyes
             { y: 1.74, r: 0.105, z: 0.01 },   // Forehead
             { y: 1.78, r: 0.1, z: 0 },        // Upper forehead
             { y: 1.82, r: 0.09, z: -0.02 },   // Crown
             { y: 1.85, r: 0.07, z: -0.04 },   // Top of head
             { y: 1.87, r: 0.04, z: -0.05 }    // Very top
         ];
         
         const headPoints = headProfile.map(p => ({ x: 0, y: p.y, z: p.z }));
         const headRadii = headProfile.map(p => p.r);
         parts.push(LoftEngine.loftPath(headPoints, headRadii, 32));
         
         // Nose bridge and tip
         parts.push(SkinMeshGenerator.createNose());
         
         // Ears
         parts.push(SkinMeshGenerator.createEar(-1)); // Left
         parts.push(SkinMeshGenerator.createEar(1));  // Right
         
         // Eyes (as inset spheres for sockets)
         parts.push(SkinMeshGenerator.createEyeSocket(-1));
         parts.push(SkinMeshGenerator.createEyeSocket(1));
         
         // Lips
         parts.push(SkinMeshGenerator.createLips());
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates detailed nose geometry
      */
     createNose: () => {
         const parts = [];
         
         // Bridge
         const bridgePoints = [
             { x: 0, y: 1.68, z: 0.095 },
             { x: 0, y: 1.65, z: 0.105 },
             { x: 0, y: 1.62, z: 0.115 }
         ];
         parts.push(LoftEngine.loftPath(bridgePoints, [0.008, 0.01, 0.015], 8));
         
         // Tip (bulbous)
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             0, 1.615, 0.12, 0.018, 0.015, 0.018
         ));
         
         // Nostrils (alae)
         parts.push(GeoUtils.transform(
             Primitives.createSphere(6, 6),
             -0.012, 1.61, 0.108, 0.012, 0.008, 0.01
         ));
         parts.push(GeoUtils.transform(
             Primitives.createSphere(6, 6),
             0.012, 1.61, 0.108, 0.012, 0.008, 0.01
         ));
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates ear geometry
      */
     createEar: (side) => {
         const x = 0.1 * side;
         const parts = [];
         
         // Main ear shape
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 1.67, -0.01, 0.018, 0.035, 0.012
         ));
         
         // Ear lobe
         parts.push(GeoUtils.transform(
             Primitives.createSphere(4, 4),
             x, 1.64, -0.005, 0.008, 0.012, 0.006
         ));
         
         // Tragus
         parts.push(GeoUtils.transform(
             Primitives.createSphere(4, 4),
             x * 0.92, 1.665, 0.005, 0.005, 0.008, 0.004
         ));
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates eye socket depression
      */
     createEyeSocket: (side) => {
         const x = 0.035 * side;
         const parts = [];
         
         // Socket rim
         parts.push(GeoUtils.transform(
             Primitives.createSphere(12, 12),
             x, 1.7, 0.085, 0.028, 0.02, 0.015
         ));
         
         // Eyeball
         parts.push(GeoUtils.transform(
             Primitives.createSphere(16, 16),
             x, 1.7, 0.09, 0.013, 0.013, 0.013
         ));
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates lip geometry
      */
     createLips: () => {
         const parts = [];
         
         // Upper lip with cupid's bow
         parts.push(GeoUtils.transform(
             Primitives.createSphere(10, 10),
             0, 1.58, 0.108, 0.032, 0.008, 0.012
         ));
         
         // Lower lip
         parts.push(GeoUtils.transform(
             Primitives.createSphere(10, 10),
             0, 1.565, 0.105, 0.028, 0.01, 0.01
         ));
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates neck connecting head to torso
      */
     createNeck: () => {
         const neckPoints = [
             { x: 0, y: 1.52, z: 0.02 },
             { x: 0, y: 1.48, z: 0.025 },
             { x: 0, y: 1.44, z: 0.02 },
             { x: 0, y: 1.40, z: 0.015 }
         ];
         const neckRadii = [0.065, 0.07, 0.075, 0.08];
         return LoftEngine.loftPath(neckPoints, neckRadii, 20);
     },
 
     /**
      * Creates torso with muscle definition
      */
     createTorso: () => {
         const parts = [];
         
         // Main torso loft
         const torsoProfile = [
             { y: 1.40, r: 0.08, z: 0.02 },   // Neck base
             { y: 1.38, r: 0.12, z: 0.03 },   // Shoulders start
             { y: 1.35, r: 0.18, z: 0.04 },   // Shoulder width
             { y: 1.28, r: 0.16, z: 0.05 },   // Upper chest
             { y: 1.18, r: 0.15, z: 0.045 },  // Mid chest
             { y: 1.08, r: 0.14, z: 0.04 },   // Upper abs
             { y: 0.98, r: 0.13, z: 0.035 },  // Waist
             { y: 0.88, r: 0.14, z: 0.03 },   // Hips start
             { y: 0.82, r: 0.16, z: 0.025 }   // Hip width
         ];
         
         const torsoPoints = torsoProfile.map(p => ({ x: 0, y: p.y, z: p.z }));
         const torsoRadii = torsoProfile.map(p => p.r);
         parts.push(LoftEngine.loftPath(torsoPoints, torsoRadii, 32));
         
         // Muscle definition overlays
         parts.push(SkinMeshGenerator.createPectorals());
         parts.push(SkinMeshGenerator.createAbdominals());
         parts.push(SkinMeshGenerator.createObliques());
         parts.push(SkinMeshGenerator.createBack());
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates pectoral definition
      */
     createPectorals: () => {
         const parts = [];
         // Left pec
         parts.push(GeoUtils.transform(
             Primitives.createSphere(10, 10),
             -0.07, 1.24, 0.12, 0.065, 0.045, 0.035
         ));
         // Right pec
         parts.push(GeoUtils.transform(
             Primitives.createSphere(10, 10),
             0.07, 1.24, 0.12, 0.065, 0.045, 0.035
         ));
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates abdominal definition (6-pack)
      */
     createAbdominals: () => {
         const parts = [];
         const rows = 4;
         const startY = 1.1;
         
         for (let i = 0; i < rows; i++) {
             const y = startY - i * 0.055;
             const size = 0.028 + i * 0.002;
             // Left ab
             parts.push(GeoUtils.transform(
                 Primitives.createSphere(6, 6),
                 -0.032, y, 0.13, size, 0.02, 0.018
             ));
             // Right ab
             parts.push(GeoUtils.transform(
                 Primitives.createSphere(6, 6),
                 0.032, y, 0.13, size, 0.02, 0.018
             ));
         }
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates oblique definition
      */
     createObliques: () => {
         const parts = [];
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             -0.11, 1.0, 0.07, 0.045, 0.09, 0.025
         ));
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             0.11, 1.0, 0.07, 0.045, 0.09, 0.025
         ));
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates back muscle definition
      */
     createBack: () => {
         const parts = [];
         // Lats
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             -0.1, 1.15, -0.08, 0.07, 0.12, 0.035
         ));
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             0.1, 1.15, -0.08, 0.07, 0.12, 0.035
         ));
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates both arms with muscle definition
      */
     createArms: () => {
         return [
             SkinMeshGenerator.createArm(-1),
             SkinMeshGenerator.createArm(1)
         ];
     },
 
     /**
      * Creates single arm
      */
     createArm: (side) => {
         const parts = [];
         const x = 0.2 * side;
         
         // Shoulder/deltoid
         parts.push(GeoUtils.transform(
             Primitives.createSphere(10, 10),
             x, 1.38, 0, 0.065, 0.055, 0.055
         ));
         
         // Upper arm
         const upperArmProfile = [
             { y: 1.35, r: 0.055 },
             { y: 1.25, r: 0.06 },
             { y: 1.15, r: 0.055 },
             { y: 1.05, r: 0.045 }
         ];
         const upperArmPoints = upperArmProfile.map(p => ({ x, y: p.y, z: 0 }));
         const upperArmRadii = upperArmProfile.map(p => p.r);
         parts.push(LoftEngine.loftPath(upperArmPoints, upperArmRadii, 16));
         
         // Bicep bulge
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 1.18, 0.04, 0.04, 0.065, 0.035
         ));
         
         // Tricep
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 1.2, -0.03, 0.035, 0.075, 0.03
         ));
         
         // Forearm
         const forearmProfile = [
             { y: 1.05, r: 0.045 },
             { y: 0.95, r: 0.048 },
             { y: 0.85, r: 0.04 },
             { y: 0.75, r: 0.028 }
         ];
         const forearmPoints = forearmProfile.map(p => ({ x, y: p.y, z: 0.01 }));
         const forearmRadii = forearmProfile.map(p => p.r);
         parts.push(LoftEngine.loftPath(forearmPoints, forearmRadii, 14));
         
         // Hand
         parts.push(SkinMeshGenerator.createHand(side));
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates hand with fingers
      */
     createHand: (side) => {
         const parts = [];
         const x = 0.2 * side;
         
         // Palm
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 0.7, 0.01, 0.028, 0.055, 0.018
         ));
         
         // Fingers
         const fingerData = [
             { offset: -0.02, length: 0.04, r: 0.006 },  // Thumb
             { offset: -0.012, length: 0.048, r: 0.005 }, // Index
             { offset: 0, length: 0.052, r: 0.005 },      // Middle
             { offset: 0.012, length: 0.046, r: 0.0045 }, // Ring
             { offset: 0.02, length: 0.038, r: 0.004 }    // Pinky
         ];
         
         fingerData.forEach((f, i) => {
             const fx = x + f.offset * side;
             const fy = i === 0 ? 0.68 : 0.65;
             parts.push(GeoUtils.transform(
                 Primitives.createSphere(4, 4),
                 fx, fy - f.length * 0.5, 0.01,
                 f.r, f.length, f.r * 0.8
             ));
         });
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates both legs
      */
     createLegs: () => {
         return [
             SkinMeshGenerator.createLeg(-1),
             SkinMeshGenerator.createLeg(1)
         ];
     },
 
     /**
      * Creates single leg with muscle definition
      */
     createLeg: (side) => {
         const parts = [];
         const x = 0.1 * side;
         
         // Glute/hip
         parts.push(GeoUtils.transform(
             Primitives.createSphere(10, 10),
             x, 0.8, -0.04, 0.09, 0.07, 0.07
         ));
         
         // Thigh
         const thighProfile = [
             { y: 0.78, r: 0.1 },
             { y: 0.65, r: 0.105 },
             { y: 0.52, r: 0.095 },
             { y: 0.4, r: 0.07 },
             { y: 0.35, r: 0.06 }
         ];
         const thighPoints = thighProfile.map(p => ({ x, y: p.y, z: 0.02 }));
         const thighRadii = thighProfile.map(p => p.r);
         parts.push(LoftEngine.loftPath(thighPoints, thighRadii, 20));
         
         // Quad definition
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 0.55, 0.07, 0.045, 0.11, 0.03
         ));
         
         // Knee
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 0.35, 0.045, 0.03, 0.03, 0.025
         ));
         
         // Lower leg (calf)
         const calfProfile = [
             { y: 0.35, r: 0.06, z: 0.01 },
             { y: 0.28, r: 0.065, z: 0 },
             { y: 0.18, r: 0.06, z: -0.01 },
             { y: 0.1, r: 0.045, z: -0.005 },
             { y: 0.05, r: 0.038, z: 0 }
         ];
         const calfPoints = calfProfile.map(p => ({ x, y: p.y, z: p.z }));
         const calfRadii = calfProfile.map(p => p.r);
         parts.push(LoftEngine.loftPath(calfPoints, calfRadii, 18));
         
         // Calf muscle bulge
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 0.22, -0.045, 0.04, 0.08, 0.035
         ));
         
         // Foot
         parts.push(SkinMeshGenerator.createFoot(side));
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates foot with toes
      */
     createFoot: (side) => {
         const parts = [];
         const x = 0.1 * side;
         
         // Main foot shape
         parts.push(GeoUtils.transform(
             Primitives.createSphere(8, 8),
             x, 0.025, 0.06, 0.045, 0.025, 0.09
         ));
         
         // Heel
         parts.push(GeoUtils.transform(
             Primitives.createSphere(6, 6),
             x, 0.025, -0.03, 0.03, 0.025, 0.035
         ));
         
         // Toes
         for (let i = 0; i < 5; i++) {
             const tx = x + (i - 2) * 0.012 * side * -1;
             const size = i === 0 ? 0.012 : 0.008 - i * 0.0008;
             parts.push(GeoUtils.transform(
                 Primitives.createSphere(4, 4),
                 tx, 0.012, 0.14, size, 0.01, 0.018
             ));
         }
         
         return GeoUtils.merge(parts);
     }
 };