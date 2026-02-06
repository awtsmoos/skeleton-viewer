// B"H
/**
 * The Uber Shader Vertex Source: The Great Transformation.
 */
export const UBER_VS = `
    attribute vec4 aPos;
    attribute vec3 aNorm;
    attribute vec2 aTexCoord;

    uniform mat4 uProj;
    uniform mat4 uView;
    uniform mat4 uModel;
    
    varying vec3 vNorm;
    varying vec3 vPos;
    varying vec2 vUV;

    void main() {
        vec4 wPos = uModel * aPos;
        gl_Position = uProj * uView * wPos;
        
        vNorm = mat3(uModel) * aNorm; 
        vPos = wPos.xyz;
        vUV = aTexCoord;
    }
`;