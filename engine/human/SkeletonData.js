// B"H
import skullData from '../../data/skeleton/skull.js';
import spineData from '../../data/skeleton/spine.js';
import armLeftData from '../../data/skeleton/arm_left.js';
import armRightData from '../../data/skeleton/arm_right.js';
import legLeftData from '../../data/skeleton/leg_left.js';
import legRightData from '../../data/skeleton/leg_right.js';
import ribcageData from '../../data/skeleton/ribcage.js';

/**
 * SkeletonData: The Treasury of the 206.
 * Merges all regional scrolls into one unified blueprint of the human form.
 */
export const SkeletonData = {
    _allBones: null,

    getAllBones: () => {
        if (SkeletonData._allBones) return SkeletonData._allBones;

        const allBones = [];
        const datasets = [
            spineData,
            skullData,
            ribcageData,
            armLeftData,
            armRightData,
            legLeftData,
            legRightData
        ];

        datasets.forEach(set => {
            if (set && set.bones) {
                set.bones.forEach(bone => {
                    allBones.push({
                        ...bone,
                        region: set.name,
                        side: set.side || 'center'
                    });
                });
            }
        });

        console.log(`B"H - SkeletonData: Unified ${allBones.length} bones from data modules.`);
        SkeletonData._allBones = allBones;
        return allBones;
    },

    getBoneById: (id) => {
        return SkeletonData.getAllBones().find(b => b.id === id);
    }
};
