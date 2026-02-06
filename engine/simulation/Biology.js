// B"H
import { Vec3 } from '../math/Vec3.js';

export class BiologyEngine {
    
    transcribe(dna) {
        const traits = {
            scaleMod: 1.0,
            colorMod: [1.0, 1.0, 1.0],
            speedMod: 1.0,
            aggressive: false
        };

        if (!dna) return traits;

        for(let i=0; i<dna.length; i++) {
            const base = dna[i];
            switch(base) {
                case 'A': traits.scaleMod += 0.1; break; 
                case 'T': traits.speedMod += 0.1; break; 
                case 'C': traits.colorMod[2] += 0.1; break; // Blue
                case 'G': traits.colorMod[1] += 0.1; break; // Green
                case 'R': traits.colorMod[0] += 0.1; break; // Red
                case 'X': traits.aggressive = true; break; 
            }
        }
        return traits;
    }

    update(scene, dt) {
        const newObjects = [];
        const neurons = [];

        scene.objects.forEach(obj => {
            if (!obj.components.biology) return;
            const bio = obj.components.biology;

            // --- DIGESTION & NUTRIENT ABSORPTION ---
            // Simple logic: If colliding with 'food', absorb it.
            // We iterate scene objects to find food (O(N^2) - minimal RAM, slow for massive scenes, acceptable here)
            // Ideally use spatial hash.
            scene.objects.forEach(food => {
                if (obj !== food && food.type.includes('food')) {
                    const d = this.distance(obj.transform.position, food.transform.position);
                    if (d < (obj.transform.scale.x + food.transform.scale.x)/2) {
                        // EAT
                        bio.nutrients.protein += 10;
                        bio.nutrients.sugar += 10;
                        if (food.material.color[0] > 0.5) bio.nutrients.pigmentR += 5;
                        if (food.material.color[1] > 0.5) bio.nutrients.pigmentG += 5;
                        if (food.material.color[2] > 0.5) bio.nutrients.pigmentB += 5;
                        
                        // Destroy food (move away)
                        food.transform.position.y = -9999;
                    }
                }
            });

            // --- PHENOTYPE EXPRESSION VIA NUTRIENTS ---
            // Structure (Growth) requires Protein
            if (bio.nutrients.protein > 0 && obj.transform.scale.x < bio.traits.scaleMod) {
                const growth = dt * 0.5;
                obj.transform.scale.x += growth;
                obj.transform.scale.y += growth;
                obj.transform.scale.z += growth;
                bio.nutrients.protein -= growth * 10;
            }

            // Pigmentation requires Pigments
            // Lerp color towards genetic target IF nutrients available
            const targetColor = bio.traits.colorMod;
            if (bio.nutrients.pigmentR > 0 && obj.material.color[0] < targetColor[0]) {
                obj.material.color[0] += dt * 0.1;
                bio.nutrients.pigmentR -= dt;
            }
            if (bio.nutrients.pigmentG > 0 && obj.material.color[1] < targetColor[1]) {
                obj.material.color[1] += dt * 0.1;
                bio.nutrients.pigmentG -= dt;
            }


            // --- CELLULAR RESPIRATION ---
            const atpGen = bio.mitochondriaCount * 0.5 * dt;
            const consumption = bio.metabolicRate * bio.traits.scaleMod * dt;
            bio.energy = bio.energy + atpGen - consumption;
            
            // --- NEURAL ---
            if (obj.type === 'bio_neuron') {
                bio.neural.isNeuron = true;
                neurons.push(obj);
                if (bio.neural.signal > 0) {
                    bio.neural.signal -= dt * 2.0; 
                    if (bio.neural.signal < 0) bio.neural.signal = 0;
                    const intensity = bio.neural.signal;
                    obj.material.color = [1.0, 1.0 - intensity * 0.8, 0.5 - intensity * 0.5];
                    obj.material.emissive = intensity * 2.0;
                } else {
                    obj.material.color = [0.8, 0.8, 0.8];
                    obj.material.emissive = 0.0;
                }
                if (Math.random() < 0.01) bio.neural.signal = 1.0;
            }

            // --- HEMODYNAMICS ---
            if (obj.type === 'bio_rbc') {
                obj.transform.position.x += dt * 2.0;
                if (obj.transform.position.x > 20) obj.transform.position.x = -20;
                obj.transform.rotation.z += dt;
            }

            // --- MITOSIS ---
            if (bio.energy >= bio.maxEnergy && bio.telomeres > 0 && obj.type === 'bio_cell') {
                bio.energy /= 2;
                bio.telomeres -= 1;
                const childDNA = this.mutate(bio.dna);
                const child = JSON.parse(JSON.stringify(obj));
                child.id = `${obj.id}_c_${Date.now()}`;
                child.transform.position.x += 1.0; 
                child.components.biology.dna = childDNA;
                child.components.biology.energy = bio.energy;
                child.components.biology.traits = this.transcribe(childDNA); 
                newObjects.push(child);
            }
        });
        
        // --- SYNAPTIC PROPAGATION ---
        neurons.forEach(n => {
            if (n.components.biology.neural.signal > n.components.biology.neural.threshold) {
                 neurons.forEach(target => {
                     if (n !== target) {
                         const d = this.distance(n.transform.position, target.transform.position);
                         if (d < 3.0) target.components.biology.neural.signal = 1.0;
                     }
                 });
            }
        });

        if (newObjects.length > 0) {
            scene.objects.push(...newObjects);
        }
    }

    mutate(dna) {
        const bases = ['A','T','C','G'];
        let newDna = "";
        for(let i=0; i<dna.length; i++) {
            if (Math.random() < 0.05) newDna += bases[Math.floor(Math.random()*bases.length)];
            else newDna += dna[i];
        }
        return newDna;
    }

    distance(a, b) {
        return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) + Math.pow(a.z-b.z,2));
    }
}
