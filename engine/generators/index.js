
// B"H
/**
 * Generators Index: The Divine Creation Registry
 * This is the central directory of all creative powers within the engine. When a "type" of object
 * is called for, this registry finds the corresponding artisan (generator function) to manifest it.
 * It is the switchboard of creation, directing the flow of divine energy into specific forms.
 */
import { AdamKadmon } from './AdamKadmon.js';
import { Eretz } from './Eretz.js';
import { Ilanot } from './Ilanot.js';
import { Primitives } from './Primitives.js';
import { SkeletonGen } from './bio/SkeletonGen.js';
import { MusculatureGen } from './bio/MusculatureGen.js';
import { SkinGen } from './character/SkinGen.js';
import { BoneHierarchy } from '../human/BoneHierarchy.js';

/**
 * Generator registry - maps type names to generator functions
 */
const generatorRegistry = new Map();

// Register primitive generators
generatorRegistry.set('cube', () => Primitives.createCube());
generatorRegistry.set('sphere', (bp) => Primitives.createSphere(bp?.latBands || 16, bp?.longBands || 16));
generatorRegistry.set('pyramid', () => Primitives.createPyramid());
generatorRegistry.set('plane', (bp) => Primitives.createPlane(bp?.segments || 1, bp?.noiseFn || null, bp?.scale || 1));

// Register terrain/world generators
generatorRegistry.set('ground', () => Eretz.generate());
generatorRegistry.set('tree', (bp) => Ilanot.generate(bp?.pos?.[0] || 0, bp?.pos?.[2] || 0));

// Register legacy human generator
generatorRegistry.set('adam', () => AdamKadmon.generate());

// Register NEW unified human generators (MAIN SYSTEM)
// Note: These now rely on a pre-built hierarchy for full generation.
const getFullAnatomy = () => {
    const hierarchy = BoneHierarchy.build();
    return {
        skeleton: SkeletonGen.createFullSkeleton206(hierarchy),
        skin: SkinGen.createUnifiedSkin(hierarchy)
    };
};

generatorRegistry.set('human_skin_procedural', (bp) => {
    if (bp?.geometry) return bp.geometry;
    const hierarchy = BoneHierarchy.build();
    return SkinGen.createUnifiedSkin(hierarchy);
});

// Register skeleton generator
generatorRegistry.set('skeleton_206', () => {
    const hierarchy = BoneHierarchy.build();
    return SkeletonGen.createFullSkeleton206(hierarchy);
});

// Register musculature generator
generatorRegistry.set('musculature', () => MusculatureGen.createFullMusculature());

// Register unified skin generator
generatorRegistry.set('skin', () => {
    const hierarchy = BoneHierarchy.build();
    return SkinGen.createUnifiedSkin(hierarchy);
});


// Skybox (just uses cube)
generatorRegistry.set('skybox_geo', () => Primitives.createCube());

export const Generators = {
    /**
     * Get geometry from type name. This is the main access point for creation.
     * @param {string} type - Generator type name.
     * @param {Object} blueprint - Optional parameters for the generator.
     * @returns {Object} Geometry data { vertices, normals, indices } or a complex object for multi-part generators.
     */
    get: (type, blueprint = {}) => {
        if (generatorRegistry.has(type)) {
            return generatorRegistry.get(type)(blueprint);
        }

        // Fallback to cube, the most basic form of existence.
        console.warn(`Unknown generator type: ${type}, falling back to cube`);
        return Primitives.createCube();
    },

    register: (name, generatorFn) => generatorRegistry.set(name, generatorFn),
    has: (name) => generatorRegistry.has(name),
    list: () => Array.from(generatorRegistry.keys()),
};
