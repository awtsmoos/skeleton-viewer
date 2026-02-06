// B"H
/**
 * BodyProfile: The Divine Contour System
 * Defines cross-section profiles at each body height for unified skin mesh
 */

import { Vec3 } from '../math/Vec3.js';

export const BodyProfile = {
    /**
     * Get complete body profile for skin generation
     * Returns array of cross-sections from feet to head
     */
    getFullProfile: (dna = null) => {
        const sections = [];
        const muscleScale = dna?.muscleMass || 1.0;
        const fatScale = 1 + (dna?.bodyFat || 0.1) * 0.5;

        // FEET (Y: 0.0 - 0.05)
        sections.push(...BodyProfile.getFeetSections(dna));

        // LOWER LEGS (Y: 0.05 - 0.35)
        sections.push(...BodyProfile.getLowerLegSections(muscleScale));

        // KNEES (Y: 0.35 - 0.42)
        sections.push(...BodyProfile.getKneeSections());

        // UPPER LEGS / THIGHS (Y: 0.42 - 0.78)
        sections.push(...BodyProfile.getThighSections(muscleScale, fatScale));

        // PELVIS / HIPS (Y: 0.78 - 0.88)
        sections.push(...BodyProfile.getPelvisSections(dna));

        // ABDOMEN (Y: 0.88 - 1.08)
        sections.push(...BodyProfile.getAbdomenSections(muscleScale, fatScale));

        // CHEST / RIBCAGE (Y: 1.08 - 1.32)
        sections.push(...BodyProfile.getChestSections(muscleScale));

        // SHOULDERS (Y: 1.32 - 1.42)
        sections.push(...BodyProfile.getShoulderSections(dna));

        // NECK (Y: 1.42 - 1.55)
        sections.push(...BodyProfile.getNeckSections());

        // HEAD (Y: 1.55 - 1.82)
        sections.push(...BodyProfile.getHeadSections(dna));

        return sections;
    },

    /**
     * Get profile sections for feet
     */
    getFeetSections: (dna) => {
        const footScale = dna?.footSize || 1.0;
        return [
            { y: 0.0, shapes: [
                { type: 'foot', side: 'left', cx: -0.1, cz: 0.06, rx: 0.04 * footScale, rz: 0.08 * footScale },
                { type: 'foot', side: 'right', cx: 0.1, cz: 0.06, rx: 0.04 * footScale, rz: 0.08 * footScale }
            ]},
            { y: 0.05, shapes: [
                { type: 'ankle', side: 'left', cx: -0.1, cz: 0, rx: 0.035, rz: 0.035 },
                { type: 'ankle', side: 'right', cx: 0.1, cz: 0, rx: 0.035, rz: 0.035 }
            ]}
        ];
    },

    /**
     * Get profile sections for lower legs (calves/shins)
     */
    getLowerLegSections: (muscleScale) => {
        const calfRadius = 0.055 * (0.9 + muscleScale * 0.15);
        return [
            { y: 0.10, shapes: [
                { type: 'calf', side: 'left', cx: -0.1, cz: 0, rx: 0.04, rz: 0.045 },
                { type: 'calf', side: 'right', cx: 0.1, cz: 0, rx: 0.04, rz: 0.045 }
            ]},
            { y: 0.18, shapes: [
                { type: 'calf_max', side: 'left', cx: -0.1, cz: -0.01, rx: calfRadius, rz: calfRadius * 1.1 },
                { type: 'calf_max', side: 'right', cx: 0.1, cz: -0.01, rx: calfRadius, rz: calfRadius * 1.1 }
            ]},
            { y: 0.28, shapes: [
                { type: 'shin', side: 'left', cx: -0.1, cz: 0, rx: 0.045, rz: 0.05 },
                { type: 'shin', side: 'right', cx: 0.1, cz: 0, rx: 0.045, rz: 0.05 }
            ]}
        ];
    },

    /**
     * Get profile sections for knees
     */
    getKneeSections: () => {
        return [
            { y: 0.35, shapes: [
                { type: 'knee', side: 'left', cx: -0.1, cz: 0.02, rx: 0.055, rz: 0.05 },
                { type: 'knee', side: 'right', cx: 0.1, cz: 0.02, rx: 0.055, rz: 0.05 }
            ]},
            { y: 0.40, shapes: [
                { type: 'above_knee', side: 'left', cx: -0.1, cz: 0.01, rx: 0.06, rz: 0.055 },
                { type: 'above_knee', side: 'right', cx: 0.1, cz: 0.01, rx: 0.06, rz: 0.055 }
            ]}
        ];
    },

    /**
     * Get profile sections for thighs
     */
    getThighSections: (muscleScale, fatScale) => {
        const thighBase = 0.085 * fatScale * (0.85 + muscleScale * 0.2);
        return [
            { y: 0.48, shapes: [
                { type: 'mid_thigh', side: 'left', cx: -0.1, cz: 0, rx: thighBase * 0.9, rz: thighBase * 0.95 },
                { type: 'mid_thigh', side: 'right', cx: 0.1, cz: 0, rx: thighBase * 0.9, rz: thighBase * 0.95 }
            ]},
            { y: 0.58, shapes: [
                { type: 'upper_thigh', side: 'left', cx: -0.1, cz: 0, rx: thighBase, rz: thighBase * 1.05 },
                { type: 'upper_thigh', side: 'right', cx: 0.1, cz: 0, rx: thighBase, rz: thighBase * 1.05 }
            ]},
            { y: 0.70, shapes: [
                { type: 'thigh_top', side: 'left', cx: -0.1, cz: -0.01, rx: thighBase * 1.05, rz: thighBase * 1.1 },
                { type: 'thigh_top', side: 'right', cx: 0.1, cz: -0.01, rx: thighBase * 1.05, rz: thighBase * 1.1 }
            ]}
        ];
    },

    /**
     * Get profile sections for pelvis/hips
     */
    getPelvisSections: (dna) => {
        const hipWidth = (dna?.hipWidth || 1.0) * 0.14;
        return [
            { y: 0.78, shapes: [
                { type: 'pelvis_low', cx: 0, cz: 0, rx: hipWidth, rz: 0.1 }
            ]},
            { y: 0.85, shapes: [
                { type: 'pelvis_mid', cx: 0, cz: 0, rx: hipWidth * 1.1, rz: 0.1 }
            ]},
            { y: 0.88, shapes: [
                { type: 'pelvis_top', cx: 0, cz: 0, rx: hipWidth, rz: 0.09 }
            ]}
        ];
    },

    /**
     * Get profile sections for abdomen
     */
    getAbdomenSections: (muscleScale, fatScale) => {
        const waistRadius = 0.12 * fatScale;
        return [
            { y: 0.92, shapes: [
                { type: 'lower_abs', cx: 0, cz: 0.02, rx: waistRadius, rz: 0.09 }
            ]},
            { y: 0.98, shapes: [
                { type: 'waist', cx: 0, cz: 0.02, rx: waistRadius * 0.95, rz: 0.085 }
            ]},
            { y: 1.05, shapes: [
                { type: 'upper_abs', cx: 0, cz: 0.025, rx: waistRadius * 1.05, rz: 0.09 }
            ]}
        ];
    },

    /**
     * Get profile sections for chest/ribcage
     */
    getChestSections: (muscleScale) => {
        const chestDepth = 0.11 * (0.9 + muscleScale * 0.15);
        return [
            { y: 1.10, shapes: [
                { type: 'lower_chest', cx: 0, cz: 0.03, rx: 0.15, rz: chestDepth }
            ]},
            { y: 1.18, shapes: [
                { type: 'chest', cx: 0, cz: 0.04, rx: 0.16, rz: chestDepth * 1.05 }
            ]},
            { y: 1.26, shapes: [
                { type: 'upper_chest', cx: 0, cz: 0.035, rx: 0.17, rz: chestDepth }
            ]},
            { y: 1.32, shapes: [
                { type: 'chest_top', cx: 0, cz: 0.03, rx: 0.16, rz: chestDepth * 0.95 }
            ]}
        ];
    },

    /**
     * Get profile sections for shoulders
     */
    getShoulderSections: (dna) => {
        const shoulderWidth = (dna?.shoulderWidth || 1.0) * 0.2;
        return [
            { y: 1.35, shapes: [
                { type: 'shoulder', cx: 0, cz: 0.01, rx: shoulderWidth, rz: 0.08 }
            ]},
            { y: 1.40, shapes: [
                { type: 'shoulder_top', cx: 0, cz: 0, rx: shoulderWidth * 0.7, rz: 0.06 }
            ]}
        ];
    },

    /**
     * Get profile sections for neck
     */
    getNeckSections: () => {
        return [
            { y: 1.42, shapes: [
                { type: 'neck_base', cx: 0, cz: 0.01, rx: 0.065, rz: 0.055 }
            ]},
            { y: 1.48, shapes: [
                { type: 'neck_mid', cx: 0, cz: 0.015, rx: 0.055, rz: 0.05 }
            ]},
            { y: 1.54, shapes: [
                { type: 'neck_top', cx: 0, cz: 0.02, rx: 0.05, rz: 0.045 }
            ]}
        ];
    },

    /**
     * Get profile sections for head
     */
    getHeadSections: (dna) => {
        const faceWidth = dna?.faceWidth || 1.0;
        const jawWidth = dna?.jawWidth || 1.0;
        return [
            { y: 1.55, shapes: [{ type: 'chin', cx: 0, cz: 0.08, rx: 0.06 * jawWidth, rz: 0.06 }]},
            { y: 1.58, shapes: [{ type: 'jaw', cx: 0, cz: 0.065, rx: 0.075 * jawWidth, rz: 0.07 }]},
            { y: 1.62, shapes: [{ type: 'lower_face', cx: 0, cz: 0.05, rx: 0.085 * faceWidth, rz: 0.08 }]},
            { y: 1.67, shapes: [{ type: 'cheek', cx: 0, cz: 0.04, rx: 0.1 * faceWidth, rz: 0.09 }]},
            { y: 1.72, shapes: [{ type: 'eye_level', cx: 0, cz: 0.03, rx: 0.095 * faceWidth, rz: 0.1 }]},
            { y: 1.76, shapes: [{ type: 'forehead', cx: 0, cz: 0.01, rx: 0.1 * faceWidth, rz: 0.11 }]},
            { y: 1.80, shapes: [{ type: 'crown', cx: 0, cz: -0.02, rx: 0.09, rz: 0.1 }]},
            { y: 1.82, shapes: [{ type: 'top', cx: 0, cz: -0.03, rx: 0.05, rz: 0.06 }]}
        ];
    }
};
