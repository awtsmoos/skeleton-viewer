
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const SpriteGen = {
    // Returns a quad geometry. The Shader 'uSpriteType' will determine if it draws a circle, star, heart, etc.
    createProceduralSprite: (type = 'circle') => {
        // Just a plane facing Z (XY plane)
        // Primitives.createPlane is XZ. Let's rotate it 90.
        const plane = Primitives.createPlane(1);
        const geo = GeoUtils.transform(plane, 0,0,0, 1,1,1);
        
        // Rotate vertices to face Z manually for the base mesh
        for(let i=0; i<geo.vertices.length; i+=3) {
            const x = geo.vertices[i];
            const y = geo.vertices[i+1];
            const z = geo.vertices[i+2];
            // Rotate X 90 degrees: y' = -z, z' = y
            geo.vertices[i+1] = -z;
            geo.vertices[i+2] = y;
            
            // Recalculate normals: n_y' = -n_z, n_z' = n_y
            // Plane normal was 0,1,0. New normal should be 0,0,1
            geo.normals[i+1] = 0;
            geo.normals[i+2] = 1;
        }
        
        return geo;
    }
};
