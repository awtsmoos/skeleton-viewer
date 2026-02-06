// B"H
/**
 * MuscleData: The Divine Flesh Repository
 * Loads and manages all muscle JSON data files
 */

import faceMusleData from '../../data/muscles/face.json';
import torsoMuscleData from '../../data/muscles/torso.json';
import limbsMuscleData from '../../data/muscles/limbs.json';

export const MuscleData = {
    face: faceMusleData,
    torso: torsoMuscleData,
    limbs: limbsMuscleData,

    /**
     * Get all visible muscles for skin surface calculation
     */
    getVisibleMuscles: () => {
        const visible = [];

        // Face expression muscles
        if (faceMusleData.expression) {
            faceMusleData.expression.forEach(m => {
                visible.push({ ...m, region: 'face', category: 'expression' });
            });
        }

        // Face mastication muscles
        if (faceMusleData.mastication) {
            faceMusleData.mastication.forEach(m => {
                visible.push({ ...m, region: 'face', category: 'mastication' });
            });
        }

        // Neck muscles
        if (faceMusleData.neck) {
            faceMusleData.neck.forEach(m => {
                visible.push({ ...m, region: 'neck', category: 'neck' });
            });
        }

        // Torso muscles
        if (torsoMuscleData.muscles) {
            torsoMuscleData.muscles.forEach(m => {
                if (m.visible !== false) {
                    visible.push({ ...m, region: 'torso', category: 'torso' });
                }
            });
        }

        // Limb muscles
        if (limbsMuscleData.muscles) {
            limbsMuscleData.muscles.forEach(m => {
                if (m.visible !== false) {
                    visible.push({ ...m, region: 'limbs', category: 'limbs' });
                }
            });
        }

        return visible;
    },

    /**
     * Get muscles by blend shape for expressions
     */
    getMusclesByBlendShape: (shapeName) => {
        const muscles = [];
        if (faceMusleData.expression) {
            faceMusleData.expression.forEach(m => {
                if (m.blendShapes && m.blendShapes.includes(shapeName)) {
                    muscles.push(m);
                }
            });
        }
        return muscles;
    },

    /**
     * Get muscles by action type
     */
    getMusclesByAction: (action) => {
        const all = MuscleData.getVisibleMuscles();
        return all.filter(m => m.action === action);
    }
};
