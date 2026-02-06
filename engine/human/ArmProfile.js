// B"H
/**
 * ArmProfile: The Divine Limb Contours
 * Defines cross-section profiles for arms
 */

export const ArmProfile = {
    /**
     * Get arm profile sections
     * @param {string} side - 'left' or 'right'
     * @param {Object} dna - DNA parameters
     */
    getArmSections: (side, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const muscleScale = dna?.muscleMass || 1.0;
        const armLength = dna?.armLength || 1.0;
        
        const baseX = 0.2 * mult;
        const shoulderY = 1.35;

        // Calculate arm positions based on length
        const upperArmLen = 0.3 * armLength;
        const forearmLen = 0.28 * armLength;
        
        const sections = [];

        // SHOULDER CAP (deltoid)
        sections.push({
            y: shoulderY,
            cx: baseX,
            cz: 0,
            rx: 0.06 * (0.9 + muscleScale * 0.15),
            ry: 0.05,
            type: 'shoulder_cap'
        });

        // UPPER ARM - bicep/tricep region
        const bicepRadius = 0.05 * (0.85 + muscleScale * 0.2);
        
        sections.push({
            y: shoulderY - 0.08,
            cx: baseX,
            cz: 0.01,
            rx: bicepRadius * 0.85,
            ry: bicepRadius * 0.9,
            type: 'upper_arm_top'
        });

        sections.push({
            y: shoulderY - 0.15,
            cx: baseX,
            cz: 0.015,
            rx: bicepRadius,
            ry: bicepRadius * 1.1,
            type: 'bicep_peak'
        });

        sections.push({
            y: shoulderY - 0.25,
            cx: baseX,
            cz: 0.01,
            rx: bicepRadius * 0.9,
            ry: bicepRadius * 0.95,
            type: 'bicep_low'
        });

        // ELBOW
        const elbowY = shoulderY - upperArmLen;
        sections.push({
            y: elbowY,
            cx: baseX,
            cz: 0,
            rx: 0.04,
            ry: 0.042,
            type: 'elbow'
        });

        // FOREARM
        const forearmRadius = 0.038 * (0.9 + muscleScale * 0.1);
        
        sections.push({
            y: elbowY - 0.08,
            cx: baseX,
            cz: 0.01,
            rx: forearmRadius * 1.1,
            ry: forearmRadius * 1.05,
            type: 'forearm_top'
        });

        sections.push({
            y: elbowY - 0.15,
            cx: baseX,
            cz: 0.008,
            rx: forearmRadius,
            ry: forearmRadius,
            type: 'forearm_mid'
        });

        sections.push({
            y: elbowY - 0.22,
            cx: baseX,
            cz: 0.005,
            rx: forearmRadius * 0.8,
            ry: forearmRadius * 0.85,
            type: 'forearm_low'
        });

        // WRIST
        const wristY = elbowY - forearmLen;
        sections.push({
            y: wristY,
            cx: baseX,
            cz: 0,
            rx: 0.025,
            ry: 0.022,
            type: 'wrist'
        });

        return sections;
    },

    /**
     * Get hand profile sections
     */
    getHandSections: (side, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const handScale = dna?.handSize || 1.0;
        const baseX = 0.2 * mult;
        const baseY = 0.75; // Wrist level

        const sections = [];

        // Palm
        sections.push({
            y: baseY - 0.02,
            cx: baseX,
            cz: 0.01,
            rx: 0.035 * handScale,
            ry: 0.015 * handScale,
            type: 'palm_base'
        });

        sections.push({
            y: baseY - 0.05,
            cx: baseX,
            cz: 0.015,
            rx: 0.04 * handScale,
            ry: 0.012 * handScale,
            type: 'palm_mid'
        });

        sections.push({
            y: baseY - 0.08,
            cx: baseX,
            cz: 0.01,
            rx: 0.038 * handScale,
            ry: 0.01 * handScale,
            type: 'palm_end'
        });

        return sections;
    },

    /**
     * Get finger profile (for detailed hands)
     * @param {number} fingerIndex - 0=thumb, 1=index, 2=middle, 3=ring, 4=pinky
     */
    getFingerProfile: (side, fingerIndex, dna = null) => {
        const mult = side === 'left' ? -1 : 1;
        const handScale = dna?.handSize || 1.0;
        const baseX = 0.2 * mult;
        const baseY = 0.67; // End of palm

        // Finger lengths (relative to middle finger)
        const lengths = [0.6, 0.9, 1.0, 0.95, 0.75];
        const spacing = [-0.03, -0.015, 0, 0.015, 0.028];

        const fingerLen = 0.06 * lengths[fingerIndex] * handScale;
        const fingerX = baseX + spacing[fingerIndex] * mult;
        const radius = (fingerIndex === 0 ? 0.008 : 0.006) * handScale;

        return {
            base: { x: fingerX, y: baseY, z: 0.01 },
            tip: { x: fingerX, y: baseY - fingerLen, z: 0.01 },
            radius: radius,
            segments: fingerIndex === 0 ? 2 : 3 // Thumb has 2 segments, others have 3
        };
    }
};
