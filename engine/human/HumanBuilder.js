 // B"H
 /**
  * HumanBuilder: Main entry point for creating hyper-realistic humans
  * Orchestrates skeleton, muscle, and skin generation from JSON data
  */
 
 import { SkeletonLoader } from './SkeletonLoader.js';
 import { MuscleLoader } from './MuscleLoader.js';
 import { AnimationLoader } from './AnimationLoader.js';
 import { BoneGeometry } from './BoneGeometry.js';
 import { MuscleGeometry } from './MuscleGeometry.js';
 import { SkinMeshGenerator } from './SkinMeshGenerator.js';
 import { GeoUtils } from '../generators/GeoUtils.js';
 import { createObject } from '../../types/objects.js';
 
 export const HumanBuilder = {
     /**
      * Creates a complete hyper-realistic human
      * @param {Object} options Configuration options
      * @returns {Object} Scene graph with skeleton, muscles, and skin
      */
     create: (options = {}) => {
         const id = `human_${Date.now()}`;
         const root = createObject(id, 'human_complete', 'Adam Kadmon');
         
         // Load data from JSON files
         const skeletonData = SkeletonLoader.loadComplete();
         const muscleData = MuscleLoader.getVisibleMuscles();
         
         // 1. Build skeleton hierarchy
         const skeletonGroup = HumanBuilder.buildSkeletonGroup(skeletonData);
         skeletonGroup.name = 'Skeleton';
         skeletonGroup.active = options.showSkeleton !== false;
         
         // 2. Build muscle layer
         const muscleGroup = HumanBuilder.buildMuscleGroup(muscleData);
         muscleGroup.name = 'Musculature';
         muscleGroup.active = options.showMuscles !== false;
         
         // 3. Generate continuous skin mesh
         const skinGeo = SkinMeshGenerator.generate(skeletonData, muscleData);
         const skinObject = createObject(`${id}_skin`, 'human_skin', 'Skin');
         skinObject.name = 'Skin';
         skinObject.active = options.showSkin !== false;
         skinObject.material = {
             type: 'skin',
             color: options.skinColor || [0.85, 0.7, 0.6],
             roughness: 0.5,
             subsurface: 0.3
         };
         skinObject.blueprint.geometry = skinGeo;
         
         // Assemble hierarchy
         root.children = [skeletonGroup, muscleGroup, skinObject];
         
         // Add components
         root.components = {
             animation: {
                 active: true,
                 state: options.animation || 'idle',
                 blendFactor: 0,
                 facialExpression: 'neutral',
                 blinkState: 0
             },
             anatomyToggles: {
                 showSkeleton: options.showSkeleton !== false,
                 showMuscles: options.showMuscles !== false,
                 showSkin: options.showSkin !== false
             },
             rig: {
                 type: 'humanoid',
                 boneCount: SkeletonLoader.getBoneCount()
             }
         };
         
         return root;
     },
 
     /**
      * Builds skeleton group from data
      */
     buildSkeletonGroup: (data) => {
         const group = createObject('skeleton_group', 'group', 'Skeleton');
         const boneMap = SkeletonLoader.buildBoneMap();
         const allBoneGeos = [];
         
         boneMap.forEach((bone, id) => {
             const geo = BoneGeometry.create(bone);
             if (geo && geo.vertices) {
                 const pos = bone.position || [0, 0, 0];
                 const transformed = GeoUtils.transform(
                     geo, pos[0], pos[1], pos[2], 1, 1, 1
                 );
                 allBoneGeos.push(transformed);
             }
         });
         
         // Merge all bones into single geometry
         if (allBoneGeos.length > 0) {
             group.blueprint = { geometry: GeoUtils.merge(allBoneGeos) };
         }
         
         group.material = {
             type: 'bone',
             color: [0.95, 0.92, 0.85]
         };
         
         return group;
     },
 
     /**
      * Builds muscle group from data
      */
     buildMuscleGroup: (muscles) => {
         const group = createObject('muscle_group', 'group', 'Muscles');
         const allMuscleGeos = [];
         
         muscles.forEach(muscle => {
             let geo;
             
             if (muscle.positions) {
                 // Multi-head muscle
                 geo = MuscleGeometry.createMultiHead(muscle);
             } else {
                 geo = MuscleGeometry.create(muscle);
             }
             
             if (geo && geo.vertices) {
                 const pos = muscle.position || [0, 0, 0];
                 const transformed = GeoUtils.transform(
                     geo, pos[0], pos[1], pos[2], 1, 1, 1
                 );
                 allMuscleGeos.push(transformed);
             }
         });
         
         if (allMuscleGeos.length > 0) {
             group.blueprint = { geometry: GeoUtils.merge(allMuscleGeos) };
         }
         
         group.material = {
             type: 'muscle',
             color: [0.7, 0.25, 0.2]
         };
         
         return group;
     },
 
     /**
      * Updates animation state
      */
     animate: (humanRoot, animationName, time) => {
         if (!humanRoot.components.animation) return;
         
         const anim = AnimationLoader.get(animationName);
         if (!anim) return;
         
         // Sample animation for each bone
         const boneMap = SkeletonLoader.buildBoneMap();
         boneMap.forEach((bone, id) => {
             const sample = AnimationLoader.sampleAnimation(animationName, id, time);
             if (sample) {
                 bone.animatedRotation = sample.rotation;
                 bone.animatedPosition = sample.position;
             }
         });
     }
 };