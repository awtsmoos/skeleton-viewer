// B"H
/**
 * ShaderRegistry: The Divine Scribe of Light.
 * This sacred registry holds the compiled words of power—the shaders—that instruct the GPU
 * on how to manifest light and form. It is the bridge between the potential of the code
 * and the actualization of the visual world, compiling the raw GLSL scrolls into executable programs.
 */
import { UBER_VS } from '../shaders/sources/uber.vs.glsl.js';
import { UBER_FS } from '../shaders/sources/uber.fs.glsl.js';
import { SKY_VS } from '../shaders/sources/sky.vs.glsl.js';
import { SKY_FS } from '../shaders/sources/sky.fs.glsl.js';
import { WATER_VS } from '../shaders/sources/water.vs.glsl.js';
import { WATER_FS } from '../shaders/sources/water.fs.glsl.js';

export const ShaderRegistry = {
    programs: new Map(),

    /**
     * Initializes and compiles all known shaders, preparing them for divine service.
     * @param {WebGLRenderingContext} gl The context of creation.
     */
    init: function(gl) {
        this.programs.set('uber', this.create(gl, UBER_VS, UBER_FS));
        this.programs.set('sky', this.create(gl, SKY_VS, SKY_FS));
        this.programs.set('water', this.create(gl, WATER_VS, WATER_FS));
    },

    /**
     * Retrieves a compiled shader program by its sacred name.
     * @param {string} name The name of the shader program ('uber', 'sky', 'water').
     * @returns {WebGLProgram} The compiled shader program.
     */
    get: function(name) {
        return this.programs.get(name);
    },

    /**
     * The act of creation: Compiles and links a shader program from its vertex and fragment sources.
     * @param {WebGLRenderingContext} gl The context of creation.
     * @param {string} vsSource The Vertex Shader source code.
     * @param {string} fsSource The Fragment Shader source code.
     * @returns {WebGLProgram | null} The newly created program.
     */
    create: function(gl, vsSource, fsSource) {
        const program = gl.createProgram();
        if (!program) return null;

        const vs = this.compile(gl, gl.VERTEX_SHADER, vsSource);
        const fs = this.compile(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return null;

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("The Divine Words could not be linked:", gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    },

    /**
     * The act of transcription: Compiles a single shader scroll.
     * @param {WebGLRenderingContext} gl The context of creation.
     * @param {GLenum} type The type of scroll (VERTEX_SHADER or FRAGMENT_SHADER).
     * @param {string} source The source code of the scroll.
     * @returns {WebGLShader | null} The compiled shader.
     */
    compile: function(gl, type, source) {
        const s = gl.createShader(type);
        if (!s) return null;
        
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(`A flaw was found in the scroll (${type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'}):`, gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }
};