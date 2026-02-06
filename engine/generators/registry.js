// B"H
import { Primitives } from './Primitives.js';
import { LibraryLayout } from './library/LibraryLayout.js';
import { GlobeGen } from './cosmos/GlobeGen.js';
import { BookGen } from './library/BookGen.js';
import { CharacterGen } from './CharacterGen.js';
import { CityGen } from './architecture/CityGen.js';
import { LayoutGen } from './layout/LayoutGen.js';
import { ComparisonLayout } from './layout/ComparisonLayout.js';
import { PropGen } from './items/PropGen.js';
import { CosmosGen } from './CosmosGen.js';
import { BioGen } from './BioGen.js';
import { HebrewFontGen } from './text/HebrewFontGen.js';
import { JudaicaGen } from './judaica/JudaicaGen.js';
import { AnimalGen } from './nature/AnimalGen.js';
import { VehicleGen } from './vehicles/VehicleGen.js';
import { NatureGen } from './NatureGen.js';
import { TechGen } from './TechGen.js';
import { MagicGen } from './MagicGen.js';
import { HairGen } from './clothing/HairGen.js';

export const GeneratorRegistry = {
    // Primitives
    'cube': Primitives.createCube,
    'sphere': Primitives.createSphere,
    'plane': Primitives.createPlane,
    'pyramid': Primitives.createPyramid,
    
    // Layouts
    'layout_cosmic_library': LibraryLayout.createCosmicLibrary,
    'layout_split_reality': ComparisonLayout.createSplitReality,
    'layout_tunnel': LayoutGen.createTunnel,
    'layout_burst': LayoutGen.createHorizonBurst,
    'layout_grid': LayoutGen.createGrid,
    'city_block': CityGen.createCityBlock,

    // Nature & Cosmos
    'earth_hologram': GlobeGen.createHolographicEarth,
    'black_hole': CosmosGen.createBlackHole,
    'star': CosmosGen.createStar,
    'galaxy': CosmosGen.createGalaxySpiral,
    'mountain_range': NatureGen.createMountainRange,
    'flower': NatureGen.createFlower,
    'tree': NatureGen.createFractalTree,
    
    // Bio
    'dna_strand': BioGen.createDNA,
    'virus': BioGen.createVirus,
    'animal_elephant': AnimalGen.createElephant,
    'animal_lion': AnimalGen.createLion,
    'animal_giraffe': AnimalGen.createGiraffe,
    'humanoid': CharacterGen.createRiggedHumanoid, // Upgraded to new system
    'human_rigged': CharacterGen.createRiggedHumanoid,
    'muscle_belly': BioGen.createMuscleBelly, // For musculature

    // Tech
    'microchip': TechGen.createMicrochip,
    'server_rack': TechGen.createServerRack,
    'vehicle_car': VehicleGen.createCarChassis,
    
    // Magic/Mystic
    'portal_ring': MagicGen.createPortalRing,
    'energy_beam': MagicGen.createEnergyBeam,
    'shield_hex': MagicGen.createShieldHex,
    
    // Judaica
    'hebrew_aleph': () => HebrewFontGen.createLetter('aleph'),
    'hebrew_bet': () => HebrewFontGen.createLetter('bet'),
    'hebrew_shin': () => HebrewFontGen.createLetter('shin'),
    'book_tanya': JudaicaGen.createTanya,
    'book_tome': BookGen.createBook,
    'book_open': BookGen.createOpenBook,
    'building_770': JudaicaGen.create770Facade,
    'box_tzedakah': JudaicaGen.createTzedakahBox,
    
    // Props & Clothing
    'broken_ruler': PropGen.createBrokenRuler,
    'chain_strand': PropGen.createChainStrand,
    'scales_justice': PropGen.createScalesOfJustice,
    
    // Custom Parts (Pass blueprint)
    'hair_custom': (bp) => HairGen.createHairstyle(bp?.style || 1, bp?.color),
    'beard_custom': (bp) => HairGen.createFacialHair(bp?.style || 1),

    get: (type, blueprint) => {
        // Special case for procedural geometry passed directly in the blueprint
        if (type.includes('_procedural') && blueprint && blueprint.geometry) {
            return blueprint.geometry;
        }

        const gen = GeneratorRegistry[type];
        if (gen) {
             // Generators that return a scene graph root object (not geometry)
             // The renderer will traverse this. The leaf nodes will have standard geometry types.
            if (type === 'human_rigged') {
                return gen(blueprint); // Return the root object, not geometry
            }
            return gen(blueprint);
        }

        // Fallback for abstract nodes that have no geometry themselves
        if (type === 'group' || type.endsWith('_group')) {
            return null;
        }
        
        console.warn(`Generator type '${type}' not found, defaulting to a cube, the potential of all form.`);
        return Primitives.createCube();
    }
};