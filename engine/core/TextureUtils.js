// B"H
/**
 * TextureUtils: The Weaver of Light-Patterns.
 * Forges procedural textures out of the nothingness of a canvas.
 */
export const TextureUtils = {
    createLeafTexture: (gl) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Clear with transparency
        ctx.clearRect(0, 0, 256, 256);

        // Draw multiple overlapping leaves
        const drawLeaf = (ox, oy, rot, scale, col) => {
            ctx.save();
            ctx.translate(ox, oy);
            ctx.rotate(rot);
            ctx.scale(scale, scale);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(20, -40, 0, -80);
            ctx.quadraticCurveTo(-20, -40, 0, 0);
            ctx.fillStyle = col;
            ctx.fill();
            
            // Veins
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0,0); ctx.lineTo(0,-70);
            ctx.stroke();
            
            ctx.restore();
        };

        // Create a cluster of leaves for a "Branch" feel
        const colors = ["#2d5a27", "#3e7a37", "#1e4d1a"];
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const dist = 30 + Math.random() * 40;
            drawLeaf(
                128 + Math.cos(angle) * dist, 
                128 + Math.sin(angle) * dist, 
                angle + Math.PI/2, 
                0.8 + Math.random() * 0.5,
                colors[i % 3]
            );
        }

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        
        return tex;
    }
};