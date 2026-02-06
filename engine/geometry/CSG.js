// B"H
/**
 * CSG: Constructive Solid Geometry.
 * The Law of the Mold and the Puncture.
 */
export const CSG = {
    // --- CONSTANTS ---
    EYE_X: 0.04,
    EYE_Y: 1.72, 
    
    // Stage 1: The Mold (Anatomical Socket)
    CAVITY_R: 0.035, 
    CAVITY_D: 0.042,

    // Stage 2: The Puncture (Small optic circular void)
    PUNCTURE_R: 0.007,
    SNAP_EPSILON: 0.005,

    /**
     * Carves anatomical features into the vertex grid.
     * @param {number} x, y, z
     * @returns {Object} { pos: {x,y,z}, isVoid: boolean }
     */
    carveAnatomy: (x, y, z) => {
        const result = { pos: { x, y, z }, isVoid: false };

        // Only process the facial region (Front hemisphere)
        if (z < 0.005) return result;

        const dL = Math.sqrt(Math.pow(x + CSG.EYE_X, 2) + Math.pow(y - CSG.EYE_Y, 2));
        const dR = Math.sqrt(Math.pow(x - CSG.EYE_X, 2) + Math.pow(y - CSG.EYE_Y, 2));
        const dist = Math.min(dL, dR);
        const side = dL < dR ? -1 : 1;

        // --- THE OPTIC PUNCTURE ---
        if (dist < CSG.PUNCTURE_R) {
            result.isVoid = true;
            return result;
        }

        // --- BOUNDARY SNAPPING (Clean Edge) ---
        if (dist < CSG.PUNCTURE_R + CSG.SNAP_EPSILON) {
            const centerX = CSG.EYE_X * side;
            const centerY = CSG.EYE_Y;
            const dx = x - centerX;
            const dy = y - centerY;
            const mag = Math.sqrt(dx*dx + dy*dy);
            if (mag > 0) {
                result.pos.x = centerX + (dx / mag) * CSG.PUNCTURE_R;
                result.pos.y = centerY + (dy / mag) * CSG.PUNCTURE_R;
            }
        }

        // --- THE ORBITAL CAVITY ---
        if (dist < CSG.CAVITY_R) {
            const t = 1.0 - (dist / CSG.CAVITY_R);
            const smoothT = t * t * (3.0 - 2.0 * t); 
            result.pos.z -= smoothT * CSG.CAVITY_D;
        }
        
        // --- THE PIRIFORM APERTURE (Tiny Slit) ---
        const nx = Math.abs(x);
        const ny = y - 1.63; 
        const nw = 0.004; // Extremely narrow
        const nh = 0.012; // Short
        
        if (nx < nw && Math.abs(ny) < nh) {
            result.isVoid = true;
        }

        return result;
    }
};
