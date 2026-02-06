// B"H
/**
 * JawGen: The Word of Power.
 * Defines the mechanical constraints of the separate mandible.
 */
export const JawGen = {
    pivot: { x: 0, y: 1.64, z: 0 },
    maxOpenAngle: 0.4, // Radians
    
    getRotation: (time) => {
        // Simulates the breath of speech
        return Math.abs(Math.sin(time * 5.0)) * JawGen.maxOpenAngle;
    }
};