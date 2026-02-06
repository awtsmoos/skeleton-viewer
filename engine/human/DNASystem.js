// B"H
/**
 * DNASystem: The Divine Genetic Code
 * Parameterizes human variation - height, build, skin color, hair, etc.
 */

export const DNASystem = {
    /**
     * Generate a random DNA profile
     */
    generateRandom: () => {
        return {
            // Physical dimensions
            height: 0.9 + Math.random() * 0.4, // 0.9 to 1.3 multiplier
            shoulderWidth: 0.9 + Math.random() * 0.3,
            hipWidth: 0.85 + Math.random() * 0.3,
            muscleMass: 0.7 + Math.random() * 0.6,
            bodyFat: 0.05 + Math.random() * 0.3,

            // Limb proportions
            armLength: 0.95 + Math.random() * 0.1,
            legLength: 0.95 + Math.random() * 0.1,
            handSize: 0.9 + Math.random() * 0.2,
            footSize: 0.9 + Math.random() * 0.2,

            // Head/Face
            headSize: 0.95 + Math.random() * 0.1,
            faceWidth: 0.9 + Math.random() * 0.2,
            jawWidth: 0.85 + Math.random() * 0.3,
            noseSize: 0.8 + Math.random() * 0.4,
            eyeSpacing: 0.95 + Math.random() * 0.1,
            lipFullness: 0.7 + Math.random() * 0.6,

            // Skin
            skinTone: Math.random(), // 0 = light, 1 = dark
            skinSubtone: Math.random(), // warm/cool undertones

            // Hair
            hasHair: Math.random() > 0.1,
            hairColor: [
                0.1 + Math.random() * 0.4,
                0.05 + Math.random() * 0.15,
                0.02 + Math.random() * 0.08
            ],
            hairLength: Math.random(),
            hairCurl: Math.random(),

            // Facial hair (for applicable characters)
            hasBeard: Math.random() > 0.5,
            beardLength: Math.random() * 0.5,
            hasMustache: Math.random() > 0.5,

            // Eyes
            eyeColor: [
                0.2 + Math.random() * 0.4,
                0.15 + Math.random() * 0.35,
                0.1 + Math.random() * 0.5
            ],

            // Age effects
            age: 0.3 + Math.random() * 0.5, // 0 = young, 1 = elderly
            wrinkleDepth: Math.random() * 0.5
        };
    },

    /**
     * Create DNA from preset type
     */
    fromPreset: (type) => {
        const base = DNASystem.generateRandom();

        switch (type) {
            case 'athletic':
                base.muscleMass = 1.1 + Math.random() * 0.2;
                base.bodyFat = 0.08 + Math.random() * 0.07;
                base.shoulderWidth = 1.1;
                break;
            case 'slim':
                base.muscleMass = 0.7 + Math.random() * 0.1;
                base.bodyFat = 0.05 + Math.random() * 0.05;
                break;
            case 'heavy':
                base.bodyFat = 0.25 + Math.random() * 0.15;
                base.muscleMass = 0.9;
                break;
            case 'tall':
                base.height = 1.2 + Math.random() * 0.15;
                base.legLength = 1.05;
                break;
            case 'short':
                base.height = 0.85 + Math.random() * 0.1;
                break;
        }

        return base;
    },

    /**
     * Apply DNA to body dimensions
     * Returns scaling factors for each body region
     */
    applyToBody: (dna) => {
        return {
            head: {
                scale: [
                    dna.faceWidth * dna.headSize,
                    dna.headSize,
                    dna.headSize
                ]
            },
            torso: {
                shoulderScale: dna.shoulderWidth * (1 + dna.muscleMass * 0.1),
                waistScale: 1.0 + dna.bodyFat * 0.3,
                chestScale: dna.muscleMass
            },
            arms: {
                lengthScale: dna.armLength * dna.height,
                massScale: dna.muscleMass,
                handScale: dna.handSize
            },
            legs: {
                lengthScale: dna.legLength * dna.height,
                massScale: dna.muscleMass * 1.2,
                footScale: dna.footSize
            },
            skin: {
                baseColor: DNASystem.skinToneToColor(dna.skinTone, dna.skinSubtone)
            }
        };
    },

    /**
     * Convert skin tone value to RGB color
     */
    skinToneToColor: (tone, subtone) => {
        // Range from light (tone=0) to dark (tone=1)
        const r = 0.95 - tone * 0.55;
        const g = 0.75 - tone * 0.45;
        const b = 0.6 - tone * 0.35;

        // Apply warm/cool subtone
        const warmth = (subtone - 0.5) * 0.1;
        
        return [
            Math.max(0, Math.min(1, r + warmth)),
            Math.max(0, Math.min(1, g)),
            Math.max(0, Math.min(1, b - warmth))
        ];
    }
};
