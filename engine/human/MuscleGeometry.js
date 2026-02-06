 // B"H
 /**
  * MuscleGeometry: Generates geometry for muscles
  * Creates spindle shapes, sheets, and fan muscles
  */
 
 import { LoftEngine } from '../geometry/LoftEngine.js';
 import { Primitives } from '../generators/Primitives.js';
 import { GeoUtils } from '../generators/GeoUtils.js';
 
 export const MuscleGeometry = {
     /**
      * Creates muscle geometry based on type
      */
     create: (muscle) => {
         const type = muscle.type || 'spindle';
         
         switch (type) {
             case 'spindle':
             case 'column':
                 return MuscleGeometry.createSpindle(muscle);
             case 'fan':
             case 'sheet':
             case 'diamond':
                 return MuscleGeometry.createSheet(muscle);
             case 'digitations':
                 return MuscleGeometry.createDigitations(muscle);
             case 'segmented':
                 return MuscleGeometry.createSegmented(muscle);
             default:
                 return MuscleGeometry.createSpindle(muscle);
         }
     },
 
     /**
      * Creates spindle-shaped muscle (most common)
      */
     createSpindle: (muscle) => {
         const length = muscle.length || 0.15;
         const maxRadius = muscle.maxRadius || muscle.radius || 0.03;
         const segments = 7;
         
         const points = [];
         const radii = [];
         
         for (let i = 0; i <= segments; i++) {
             const t = i / segments;
             points.push({ x: 0, y: t * length, z: 0 });
             // Spindle shape: thin at ends, bulges in middle
             const bellyCurve = Math.sin(t * Math.PI);
             radii.push(maxRadius * 0.15 + maxRadius * 0.85 * bellyCurve);
         }
         
         return LoftEngine.loftPath(points, radii, 8);
     },
 
     /**
      * Creates sheet/fan muscle (pecs, lats)
      */
     createSheet: (muscle) => {
         const size = muscle.size || [0.1, 0.1, 0.03];
         return GeoUtils.transform(
             Primitives.createSphere(10, 10),
             0, 0, 0, size[0], size[1], size[2]
         );
     },
 
     /**
      * Creates digitations (serratus anterior)
      */
     createDigitations: (muscle) => {
         const parts = [];
         const count = muscle.digitationCount || 8;
         const pos = muscle.position || [0, 0, 0];
         
         for (let i = 0; i < count; i++) {
             const y = pos[1] - i * 0.025;
             const digit = GeoUtils.transform(
                 Primitives.createCube(),
                 pos[0], y, pos[2],
                 0.03, 0.01, 0.015
             );
             parts.push(digit);
         }
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates segmented muscle (rectus abdominis)
      */
     createSegmented: (muscle) => {
         const parts = [];
         const segments = muscle.segmentData || [];
         const lineaAlbaWidth = muscle.lineaAlba?.width || 0.015;
         
         segments.forEach(seg => {
             const size = seg.size || [0.04, 0.025, 0.03];
             // Left segment
             parts.push(GeoUtils.transform(
                 Primitives.createSphere(6, 6),
                 -size[0] * 0.5 - lineaAlbaWidth * 0.5, seg.y, 0.12,
                 size[0], size[1], size[2]
             ));
             // Right segment
             parts.push(GeoUtils.transform(
                 Primitives.createSphere(6, 6),
                 size[0] * 0.5 + lineaAlbaWidth * 0.5, seg.y, 0.12,
                 size[0], size[1], size[2]
             ));
         });
         
         return GeoUtils.merge(parts);
     },
 
     /**
      * Creates multi-head muscle (biceps, triceps)
      */
     createMultiHead: (muscle) => {
         const parts = [];
         const positions = muscle.positions || [];
         
         positions.forEach(head => {
             const pos = head.pos || [0, 0, 0];
             let geo;
             
             if (head.length && head.radius) {
                 geo = MuscleGeometry.createSpindle({
                     length: head.length,
                     maxRadius: head.radius
                 });
             } else if (head.size) {
                 geo = GeoUtils.transform(
                     Primitives.createSphere(6, 6),
                     0, 0, 0, head.size[0], head.size[1], head.size[2]
                 );
             } else {
                 geo = MuscleGeometry.createSpindle({
                     length: 0.1,
                     maxRadius: 0.02
                 });
             }
             
             parts.push(GeoUtils.transform(geo, pos[0], pos[1], pos[2], 1, 1, 1));
         });
         
         return GeoUtils.merge(parts);
     }
 };