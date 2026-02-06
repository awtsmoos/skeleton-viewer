
// B"H
/**
 * Vertex Shader for Skinned Meshes: The Divine Deformation.
 * This is where the magic of living flesh happens. It takes the static, unbound skin
 * and, using the bone transformations and influence weights, calculates the final
 * position of each vertex, creating a seamless, organic deformation.
 */
export const SKIN_VS = `
    attribute vec4 aPos;
    attribute vec3 aNorm;
    attribute vec4 aSkinIndex;  // The indices of the 4 influencing bones
    attribute vec4 aSkinWeight; // The weights of those 4 bones

    uniform mat4 uProj;
    uniform mat4 uView;
    uniform mat4 uModel;
    
    // An array of all bone transformation matrices for the current frame
    uniform mat4 uBoneMatrices[128]; // Max 128 bones for this rig

    varying vec3 vNorm;
    varying vec3 vPos;

    void main() {
        // The final transformation matrix for this specific vertex, blended from its influencers.
        mat4 skinMatrix = mat4(0.0);
        
        skinMatrix += aSkinWeight.x * uBoneMatrices[int(aSkinIndex.x)];
        skinMatrix += aSkinWeight.y * uBoneMatrices[int(aSkinIndex.y)];
        skinMatrix += aSkinWeight.z * uBoneMatrices[int(aSkinIndex.z)];
        skinMatrix += aSkinWeight.w * uBoneMatrices[int(aSkinIndex.w)];
        
        // Deform the vertex position and normal by the blended skinning matrix.
        vec4 deformedPos = skinMatrix * aPos;
        vec3 deformedNorm = (skinMatrix * vec4(aNorm, 0.0)).xyz;

        vec4 wPos = uModel * deformedPos;
        gl_Position = uProj * uView * wPos;
        
        vNorm = mat3(uModel) * deformedNorm; 
        vPos = wPos.xyz;
    }
`;
