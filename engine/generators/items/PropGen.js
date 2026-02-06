
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';

export const PropGen = {
    createBrokenRuler: () => {
        const geos = [];
        // Left Piece (Jagged end on right)
        geos.push(GeoUtils.transform(Primitives.createCube(), -0.6, 0, 0, 0.5, 0.05, 0.15));
        // Markings
        for(let i=0; i<5; i++) {
             geos.push(GeoUtils.transform(Primitives.createCube(), -1.0 + i*0.2, 0.05, 0.05, 0.01, 0.01, 0.05));
        }
        
        // Right Piece (Jagged end on left, rotated slightly to look snapped)
        const rightPart = GeoUtils.transform(Primitives.createCube(), 0.6, 0, 0, 0.5, 0.05, 0.15);
        // Rotate logic manually on vertices for "Snap"
        for(let i=0; i<rightPart.vertices.length; i+=3) {
            const x = rightPart.vertices[i];
            const y = rightPart.vertices[i+1];
            // Rotate Z roughly 15 degrees
            const th = 0.2;
            rightPart.vertices[i] = x * Math.cos(th) - y * Math.sin(th);
            rightPart.vertices[i+1] = x * Math.sin(th) + y * Math.cos(th);
            // Offset y to look fallen
            rightPart.vertices[i+1] -= 0.2;
        }
        geos.push(rightPart);
        
        return GeoUtils.merge(geos);
    },

    createChainStrand: (length = 10) => {
        const geos = [];
        // Approximate torus with 4 cubes for a link
        const link = () => {
            const g = [];
            const th = 0.05;
            const sz = 0.2;
            g.push(GeoUtils.transform(Primitives.createCube(), sz, 0, 0, th, th, sz)); // R
            g.push(GeoUtils.transform(Primitives.createCube(), -sz, 0, 0, th, th, sz)); // L
            g.push(GeoUtils.transform(Primitives.createCube(), 0, 0, sz, sz, th, th)); // F
            g.push(GeoUtils.transform(Primitives.createCube(), 0, 0, -sz, sz, th, th)); // B
            return GeoUtils.merge(g);
        };

        for(let i=0; i<length; i++) {
            const l = link();
            // Rotate every other link 90 deg around X (swap Y/Z)
            if (i % 2 !== 0) {
                for(let v=0; v<l.vertices.length; v+=3) {
                    const y = l.vertices[v+1];
                    const z = l.vertices[v+2];
                    l.vertices[v+1] = -z;
                    l.vertices[v+2] = y;
                }
            }
            // Move along X
            const moved = GeoUtils.transform(l, i * 0.3, 0, 0, 1, 1, 1);
            geos.push(moved);
        }
        return GeoUtils.merge(geos);
    },

    createScalesOfJustice: () => {
        const geos = [];
        // Base
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 0, 0, 0.5, 0.1, 0.5));
        // Pillar
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 1.5, 0, 0.1, 1.5, 0.1));
        // Crossbar
        geos.push(GeoUtils.transform(Primitives.createCube(), 0, 3.0, 0, 1.5, 0.05, 0.05));
        
        // Dishes (Hemispheres)
        const dish = Primitives.createSphere(12,12);
        // Left Dish
        geos.push(GeoUtils.transform(dish, -1.5, 2.0, 0, 0.5, 0.2, 0.5));
        // Right Dish
        geos.push(GeoUtils.transform(dish, 1.5, 2.0, 0, 0.5, 0.2, 0.5));
        
        return GeoUtils.merge(geos);
    }
};
