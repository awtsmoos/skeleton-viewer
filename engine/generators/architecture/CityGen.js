// B"H
import { Builder } from '../Builder.js';

export const CityGen = {
    createSkyscraper: () => {
        const height = 2 + Math.random() * 4;
        const width = 1 + Math.random() * 0.5;
        const depth = 1 + Math.random() * 0.5;
        
        const floors = Math.floor(height * 2);
        
        const parts = [
            { type: 'cube', pos: [0, height/2, 0], scale: [width, height, depth] }
        ];

        parts.push({
            type: 'grid',
            rows: floors,
            cols: 2,
            size: [width * 1.05, height],
            item: { type: 'cube', scale: [0.1, 0.3, depth * 1.05] }, 
            pos: [0, height/2, 0]
        });

        parts.push({
            type: 'stack',
            count: 3,
            step: { pos: [0, 0.5, 0], scale: [0.7, 1, 0.7] },
            item: { type: 'cube', pos: [0, height + 0.25, 0], scale: [width*0.5, 0.5, depth*0.5] }
        });
        
        parts.push({
            type: 'cube', 
            pos: [0, height + 2.0, 0], 
            scale: [0.05, 2.0, 0.05]
        });

        if (Math.random() > 0.5) {
             parts.push({ type: 'sphere', pos: [0.2, height, 0.2], scale: [0.5, 0.2, 0.5] });
        }

        return Builder.build({ type: 'group', parts });
    },

    createCityBlock: () => {
        const streetWidth = 4.0;
        const buildings = [];
        
        for(let x=0; x<3; x++) {
            for(let z=0; z<3; z++) {
                if (Math.random() > 0.8) continue;
                buildings.push({
                    type: 'group',
                    pos: [(x - 1) * streetWidth, 0, (z - 1) * streetWidth],
                    parts: CityGen.getSkyscraperSchema().parts 
                });
            }
        }
        
        buildings.push({ type: 'plane', scale: [15, 1, 15], pos: [0, 0.01, 0] });
        
        buildings.push({
            type: 'grid', rows: 4, cols: 4, size: [12, 12],
            item: {
                type: 'group',
                parts: [
                    { type: 'cube', scale: [0.1, 2, 0.1], pos: [0,1,0] }, 
                    { type: 'cube', scale: [0.5, 0.1, 0.1], pos: [0.2, 2, 0] }, 
                    { type: 'cube', scale: [0.1, 0.2, 0.1], pos: [0.4, 1.9, 0] } 
                ]
            }
        });

        return Builder.build({ type: 'group', parts: buildings });
    },
    
    getSkyscraperSchema: () => {
        const height = 2 + Math.random() * 6;
        const width = 1 + Math.random() * 1.5;
        const depth = 1 + Math.random() * 1.5;
        
        const parts = [
            { type: 'cube', pos: [0, height/2, 0], scale: [width, height, depth] },
            { type: 'cube', pos: [0, height + 1, 0], scale: [0.1, 2, 0.1] }
        ];
        
        if (Math.random() > 0.5) {
             parts.push({
                 type: 'ring', count: 4, radius: width * 0.8,
                 item: { type: 'cube', pos: [0, height*0.8, 0], scale: [0.2, 0.2, 0.2] }
             });
        }
        
        return { type: 'group', parts };
    }
};