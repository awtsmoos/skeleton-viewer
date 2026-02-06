// B"H
/**
 * ExpressionSystem: The Divine Emotional Countenance
 * Manages facial expressions through muscle-based blend shapes
 */

import { MuscleData } from './MuscleData.js';

export const ExpressionSystem = {
    /**
     * Predefined expression presets
     */
    presets: {
        neutral: {
            frontalis: 0,           // forehead
            orbicularis_oculi: 0,   // around eyes
            zygomaticus_major: 0,   // smile muscle
            orbicularis_oris: 0,    // around lips
            corrugator: 0,          // frown
            depressor_anguli: 0,    // mouth corners down
            mentalis: 0             // chin
        },
        happy: {
            frontalis: 0.2,
            orbicularis_oculi: 0.6,
            zygomaticus_major: 1.0,
            orbicularis_oris: 0.3,
            corrugator: 0,
            depressor_anguli: 0,
            mentalis: 0.1
        },
        sad: {
            frontalis: 0.4,
            orbicularis_oculi: 0.2,
            zygomaticus_major: 0,
            orbicularis_oris: 0.1,
            corrugator: 0.3,
            depressor_anguli: 0.8,
            mentalis: 0.5
        },
        angry: {
            frontalis: 0.1,
            orbicularis_oculi: 0.4,
            zygomaticus_major: 0,
            orbicularis_oris: 0.5,
            corrugator: 1.0,
            depressor_anguli: 0.3,
            mentalis: 0.4
        },
        surprised: {
            frontalis: 1.0,
            orbicularis_oculi: 0,
            zygomaticus_major: 0.2,
            orbicularis_oris: 0.5,
            corrugator: 0,
            depressor_anguli: 0,
            mentalis: 0
        },
        fear: {
            frontalis: 0.9,
            orbicularis_oculi: 0.7,
            zygomaticus_major: 0,
            orbicularis_oris: 0.4,
            corrugator: 0.5,
            depressor_anguli: 0.6,
            mentalis: 0.3
        },
        disgust: {
            frontalis: 0.2,
            orbicularis_oculi: 0.5,
            zygomaticus_major: 0,
            orbicularis_oris: 0.3,
            corrugator: 0.6,
            depressor_anguli: 0.4,
            mentalis: 0.2
        },
        contempt: {
            frontalis: 0.1,
            orbicularis_oculi: 0.2,
            zygomaticus_major: 0.3, // Only one side in real contempt
            orbicularis_oris: 0.2,
            corrugator: 0.2,
            depressor_anguli: 0,
            mentalis: 0.1
        }
    },

    /**
     * Get expression blend shapes
     */
    getExpression: (name) => {
        return ExpressionSystem.presets[name] || ExpressionSystem.presets.neutral;
    },

    /**
     * Blend between two expressions
     */
    blend: (from, to, t) => {
        const result = {};
        const fromExpr = typeof from === 'string' ? ExpressionSystem.getExpression(from) : from;
        const toExpr = typeof to === 'string' ? ExpressionSystem.getExpression(to) : to;

        Object.keys(fromExpr).forEach(key => {
            const fromVal = fromExpr[key] || 0;
            const toVal = toExpr[key] || 0;
            result[key] = fromVal + (toVal - fromVal) * t;
        });

        return result;
    },

    /**
     * Combine multiple expressions
     */
    combine: (expressions) => {
        const result = { ...ExpressionSystem.presets.neutral };

        expressions.forEach(({ expression, weight }) => {
            const expr = typeof expression === 'string' 
                ? ExpressionSystem.getExpression(expression) 
                : expression;
            
            Object.keys(expr).forEach(key => {
                result[key] = Math.min(1, (result[key] || 0) + (expr[key] || 0) * weight);
            });
        });

        return result;
    },

    /**
     * Apply expression to face mesh
     * Returns vertex offsets for blend shape deformation
     */
    getVertexOffsets: (expression, faceProfile) => {
        const offsets = [];
        
        // Map muscles to vertex regions
        const muscleRegions = {
            frontalis: { minY: 1.72, maxY: 1.78, offsetY: 0.005 },
            orbicularis_oculi: { minY: 1.68, maxY: 1.72, offsetY: 0 },
            zygomaticus_major: { minY: 1.62, maxY: 1.68, offsetY: 0.003, offsetZ: 0.002 },
            orbicularis_oris: { minY: 1.56, maxY: 1.60, offsetZ: 0.002 },
            corrugator: { minY: 1.71, maxY: 1.74, offsetY: -0.003 },
            depressor_anguli: { minY: 1.55, maxY: 1.58, offsetY: -0.004 },
            mentalis: { minY: 1.52, maxY: 1.56, offsetY: 0.002, offsetZ: 0.003 }
        };

        Object.keys(expression).forEach(muscle => {
            const region = muscleRegions[muscle];
            if (region && expression[muscle] > 0) {
                offsets.push({
                    muscle,
                    intensity: expression[muscle],
                    ...region
                });
            }
        });

        return offsets;
    },

    /**
     * Get eyelid state from expression
     */
    getEyelidState: (expression) => {
        const oculi = expression.orbicularis_oculi || 0;
        return {
            open: 1 - oculi * 0.8, // Squinting closes eyes
            squint: oculi > 0.3 ? (oculi - 0.3) * 1.4 : 0
        };
    },

    /**
     * Get eyebrow state from expression
     */
    getEyebrowState: (expression) => {
        const frontalis = expression.frontalis || 0;
        const corrugator = expression.corrugator || 0;

        return {
            raised: frontalis * 0.8,
            furrowed: corrugator * 0.6,
            innerRaise: (frontalis - corrugator) * 0.4
        };
    }
};
