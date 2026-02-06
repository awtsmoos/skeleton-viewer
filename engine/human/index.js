
// B"H
/**
 * Human Module Index: The Complete Divine Human System
 * Central export point for all human generation systems
 */

// Data Loaders
export { SkeletonData } from './SkeletonData.js';
export { MuscleData } from './MuscleData.js';
export { FaceData } from './FaceData.js';
export { AnimationData } from './AnimationData.js';

// Core Systems
export { DNASystem } from './DNASystem.js';
export { BoneHierarchy } from './BoneHierarchy.js';
export { JointSystem } from './JointSystem.js';
export { IKSystem } from './IKSystem.js';
export { SkinningSystem } from './SkinningSystem.js';

// Body Generation
export { BodyProfile } from './BodyProfile.js';
export { ArmProfile } from './ArmProfile.js';
export { UnifiedSkinGen } from './UnifiedSkinGen.js';

// NEW Unified Human Generation (MAIN SYSTEM)
export { UnifiedHumanGen } from './UnifiedHumanGen.js';
export { HumanMeshFactory } from './HumanMeshFactory.js';
export { 
    BodyMeshGen, 
    FaceMeshGen, 
    LimbMeshGen, 
    HairMeshGen,
    UnifiedBodyMesh,
    RealisticFaceMesh,
    ArmMesh,
    LegMesh
} from './mesh/index.js';

// Face Generation
export { EyeGen } from './EyeGen.js';
export { MouthGen } from './MouthGen.js';
export { NoseGen } from './NoseGen.js';
export { EarGen } from './EarGen.js';
export { JawGen } from './JawGen.js';
export { ExpressionSystem } from './ExpressionSystem.js';

// Main Factory
export { HumanFactory } from './HumanFactory.js';
