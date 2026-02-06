// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { FontGen } from '../text/FontGen.js';
import { createObject } from '../../../types/objects.js'; // Use standard creator

export const GraphGen = {
    createBarChart: () => {
        const geos = [];
        const data = [1, 3, 2, 5, 4, 2, 6, 8, 5, 3];
        
        // We return a Group object containing the parts as children for logic attachment
        // But the GeneratorRegistry expects a Mesh (Geometry).
        // Since the engine is flexible, let's return a merged mesh for the bars,
        // BUT we need separate objects for labels if we want logic on them.
        // CURRENT LIMITATION: generators return Geometry {vertices, ...}.
        // To support logic, we must return a Scene Object hierarchy?
        // The 'get' method in registry returns Geometry.
        // So we will bake the visual representation into one mesh.
        // For PULSATING text, we can't easily animate vertices of a merged mesh 
        // specifically for the text part without complex shader attributes.
        
        // WORKAROUND: We return a merged mesh, but we rely on the Scene Builder 
        // (App.js or Gemini) to create complex hierarchies.
        // However, for this specific request, I will make the merging generic.
        
        // Bars
        const bar = Primitives.createCube();
        data.forEach((val, i) => {
            geos.push(GeoUtils.transform(bar, i * 1.5, val/2, 0, 0.5, val/2, 0.5));
            
            // Labels (Static for now in this mesh generator)
            // Ideally labels are separate objects.
            const label = FontGen.createText(val.toString(), 0.5);
            geos.push(GeoUtils.transform(label, i * 1.5 - 0.2, val + 0.5, 0, 1, 1, 1));
        });
        
        // Base
        geos.push(GeoUtils.transform(Primitives.createCube(), (data.length*1.5)/2 - 0.75, -0.2, 0, (data.length*1.5)/2, 0.2, 1));
        
        return GeoUtils.merge(geos);
    },

    // A scatter plot where points are distinct particles?
    // Geometry generator returns one mesh.
    createScatterPlot: () => {
        const geos = [];
        const point = Primitives.createSphere(6,6);
        for(let i=0; i<50; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            geos.push(GeoUtils.transform(point, x, y+5, z, 0.2, 0.2, 0.2));
            geos.push(GeoUtils.transform(Primitives.createCube(), x, (y+5)/2, z, 0.02, (y+5)/2, 0.02));
        }
        // Axes
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 5, 0, 0.05, 5, 0.05));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 5, 0.05, 0.05));
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.05, 0.05, 5));
        return GeoUtils.merge(geos);
    }
};