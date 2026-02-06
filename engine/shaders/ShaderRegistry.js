// B"H
import { UBER_VS } from './sources/uber.vs.glsl.js';
import { UBER_FS } from './sources/uber.fs.glsl.js';
import { SKY_VS } from './sources/sky.vs.glsl.js';
import { SKY_FS } from './sources/sky.fs.glsl.js';
import { WATER_VS } from './sources/water.vs.glsl.js';
import { WATER_FS } from './sources/water.fs.glsl.js';

/**
 * ShaderRegistry: The Library of Light.
 * This sacred vessel holds the compiled Words of Power—the shaders—that instruct the GPU
 * on how to manifest light and form. It is the bridge between the potential of GLSL code
 * and the actualization of the visual world.
 */
export const ShaderRegistry = {
    programs: new Map(),
    
    /**
     * Initializes and compiles all known shaders.
     * @param {WebGLRenderingContext} gl The context of creation.
     */
    init: (gl) => {
        ShaderRegistry.programs.set('uber', createProgram(gl, UBER_VS, UBER_FS));
        ShaderRegistry.programs.set('sky', createProgram(gl, SKY_VS, SKY_FS)); 
        ShaderRegistry.programs.set('water', createProgram(gl, WATER_VS, WATER_FS)); 
    },

    /**
     * Retrieves a compiled shader program by its sacred name.
     * @param {string} name The name of the shader ('uber', 'sky', 'water').
     * @returns {WebGLProgram | undefined} The compiled shader program.
     */
    get: (name) => {
        return ShaderRegistry.programs.get(name);
    }
};

/**
 * The act of creation: Compiles and links a shader program.
 * @private
 */
function createProgram(gl, vsSrc, fsSrc) {
    const p = gl.createProgram();
    if (!p) return null;

    const v = compile(gl, gl.VERTEX_SHADER, vsSrc);
    const f = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!v || !f) return null;

    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error("The Divine Words could not be linked:", gl.getProgramInfoLog(p));
        return null;
    }
    return p;
}

/**
 * The act of transcription: Compiles a single shader scroll.
 * @private
 */
function compile(gl, type, src) {
    const s = gl.createShader(type);
    if (!s) return null;

    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const typeName = type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment';
        console.error(`A flaw was found in the ${typeName} scroll:`, gl.getShaderInfoLog(s));
        return null;
    }
    return s;
}
