// B"H
import { Vec3 } from '../math/Vec3.js';

// 16x16x16 Grid = 4096 cells. Very Low RAM.
// cell = [density, temp, velX, velY, velZ]
const GRID_SIZE = 16;
const CELL_SIZE = 4.0; // World units per cell
const WORLD_SIZE = GRID_SIZE * CELL_SIZE;

export class AtmosphereSystem {
    constructor() {
        this.data = new Float32Array(GRID_SIZE * GRID_SIZE * GRID_SIZE * 5);
        this.globalWind = { x: 0.1, y: 0, z: 0.1 };
        this.averageTemp = 20.0; // Celsius
    }

    getIndex(x, y, z) {
        // Wrap coordinates for infinite scrolling illusion
        const ix = Math.floor((x + WORLD_SIZE/2) / CELL_SIZE) % GRID_SIZE;
        const iy = Math.floor((y + 5.0) / CELL_SIZE) % GRID_SIZE; // Offset y
        const iz = Math.floor((z + WORLD_SIZE/2) / CELL_SIZE) % GRID_SIZE;
        
        const wrapX = (ix + GRID_SIZE) % GRID_SIZE;
        const wrapY = (iy + GRID_SIZE) % GRID_SIZE;
        const wrapZ = (iz + GRID_SIZE) % GRID_SIZE;
        
        return (wrapX + wrapY * GRID_SIZE + wrapZ * GRID_SIZE * GRID_SIZE) * 5;
    }

    update(dt) {
        // 1. GLOBAL DIFFUSION (Microscopic collisions simplified)
        // Heat spreads. High pressure pushes wind.
        
        let tempSum = 0;
        const samples = 200; // Increased samples for responsiveness
        
        for(let i=0; i<samples; i++) {
            const idx = Math.floor(Math.random() * (this.data.length / 5)) * 5;
            
            // Thermodynamics: Cool down/Heat up towards ambient
            this.data[idx+1] += (20.0 - this.data[idx+1]) * dt * 0.1;
            
            // Convection: Heat rises
            if (this.data[idx+1] > 25.0) {
                 this.data[idx+3] += 0.5 * dt; 
            }
            
            // Wind Decay (Friction)
            this.data[idx+2] *= 0.95;
            this.data[idx+3] *= 0.95;
            this.data[idx+4] *= 0.95;
            
            // Apply Global Wind
            this.data[idx+2] += this.globalWind.x * dt;
            this.data[idx+4] += this.globalWind.z * dt;

            tempSum += this.data[idx+1];
        }
        
        // Update global average for Horizon Color
        this.averageTemp = (this.averageTemp * 0.95) + ((tempSum / samples) * 0.05);
    }

    getAt(pos) {
        const i = this.getIndex(pos.x, pos.y, pos.z);
        return {
            density: this.data[i],
            temp: this.data[i+1],
            velocity: { x: this.data[i+2], y: this.data[i+3], z: this.data[i+4] }
        };
    }

    injectHeat(pos, amount) {
        const i = this.getIndex(pos.x, pos.y, pos.z);
        this.data[i+1] += amount;
    }

    injectWind(pos, velocity, radius) {
        // In a real voxel engine, we'd affect multiple cells based on radius.
        // Here we affect the primary cell strongly and neighbors weakly.
        const i = this.getIndex(pos.x, pos.y, pos.z);
        
        this.data[i+2] += velocity.x;
        this.data[i+3] += velocity.y;
        this.data[i+4] += velocity.z;
    }
}

export const GlobalAtmosphere = new AtmosphereSystem();
