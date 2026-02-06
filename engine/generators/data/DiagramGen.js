
// B"H
import { Primitives } from '../Primitives.js';
import { GeoUtils } from '../GeoUtils.js';
import { FontGen } from '../text/FontGen.js';

export const DiagramGen = {
    createFlowChart: () => {
        const geos = [];
        const nodeGeo = Primitives.createCube();
        
        // Define a simple process flow: Start -> Process -> Decision -> End
        const nodes = [
            { id: 0, x: 0, y: 0, z: 0, type: 'start', label: "START" },
            { id: 1, x: 3, y: 0, z: 0, type: 'process', label: "THINK" },
            { id: 2, x: 6, y: 0, z: 0, type: 'decision', label: "?" },
            { id: 3, x: 6, y: 2, z: 0, type: 'process', label: "ACT" },
            { id: 4, x: 9, y: 0, z: 0, type: 'end', label: "END" }
        ];

        const edges = [
            { from: 0, to: 1 },
            { from: 1, to: 2 },
            { from: 2, to: 3 }, // Yes branch
            { from: 2, to: 4 }  // No branch
        ];

        // Build Nodes
        nodes.forEach(n => {
            let sx=1, sy=0.5, sz=0.5;
            if (n.type === 'start' || n.type === 'end') { sx=0.8; sz=0.8; } // Oval-ish
            if (n.type === 'decision') { sx=0.7; sy=0.7; } // Diamond-ish rotated?
            
            // Node Mesh
            if (n.type === 'decision') {
                 // Rotate 45 deg manually for diamond look
                 // Or just use a different shape. Let's use a cube rotated 45 on Z
                 // GeoUtils transform doesn't support rotation, we'd need a matrix.
                 // We'll stick to scaling for now.
            }
            
            geos.push(GeoUtils.transform(nodeGeo, n.x, n.y, n.z, sx, sy, sz));
            
            // Label
            const text = FontGen.createText(n.label, 0.3);
            geos.push(GeoUtils.transform(text, n.x - 0.3, n.y + 0.6, n.z, 1,1,1));
        });

        // Build Edges
        edges.forEach(e => {
            const n1 = nodes[e.from];
            const n2 = nodes[e.to];
            const mx = (n1.x + n2.x)/2;
            const my = (n1.y + n2.y)/2;
            const mz = (n1.z + n2.z)/2;
            const dist = Math.sqrt(Math.pow(n2.x-n1.x,2) + Math.pow(n2.y-n1.y,2));
            
            // Horizontal/Vertical lines only for flowcharts usually, but we do direct connections
            // Rotate? No matrix in GeoUtils yet. We make thick dots or axis-aligned connectors.
            
            // If horizontal
            if (Math.abs(n1.y - n2.y) < 0.1) {
                geos.push(GeoUtils.transform(nodeGeo, mx, my, mz, dist/2, 0.05, 0.05));
            } 
            // If vertical
            else if (Math.abs(n1.x - n2.x) < 0.1) {
                geos.push(GeoUtils.transform(nodeGeo, mx, my, mz, 0.05, dist/2, 0.05));
            }
        });

        return GeoUtils.merge(geos);
    }
};
