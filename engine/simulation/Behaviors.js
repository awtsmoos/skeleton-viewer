// B"H
import { Vec3 } from '../math/Vec3.js';

export const Behaviors = {
    // FLOCKING (Boids implementation)
    flock: (obj, scene, time) => {
        if (!obj.components.velocity) obj.components.velocity = {x:0,y:0,z:0};
        // Find neighbors
        const neighbors = scene.objects.filter(o => o && o.id !== obj.id && o.type === obj.type && distance(o, obj) < 10);
        
        if (neighbors.length === 0) return;
        
        // Separation, Alignment, Cohesion
        let sep = {x:0,y:0,z:0}, ali = {x:0,y:0,z:0}, coh = {x:0,y:0,z:0};
        let center = {x:0,y:0,z:0};
        
        const pos = obj.transform ? obj.transform.position : obj.position;
        if (!pos) return;

        neighbors.forEach(n => {
            const nPos = n.transform ? n.transform.position : n.position;
            if (!nPos) return;

            const d = distance(n, obj);
            // Sep
            if (d < 2 && d > 0) {
                sep.x -= (nPos.x - pos.x) / d;
                sep.y -= (nPos.y - pos.y) / d;
                sep.z -= (nPos.z - pos.z) / d;
            }
            // Cohesion sum
            center.x += nPos.x;
            center.y += nPos.y;
            center.z += nPos.z;
        });
        
        center.x /= neighbors.length;
        center.y /= neighbors.length;
        center.z /= neighbors.length;
        
        coh.x = center.x - pos.x;
        coh.y = center.y - pos.y;
        coh.z = center.z - pos.z;
        
        // Apply
        obj.components.velocity.x += (sep.x * 0.1 + coh.x * 0.01) * 0.1;
        obj.components.velocity.y += (sep.y * 0.1 + coh.y * 0.01) * 0.1;
        obj.components.velocity.z += (sep.z * 0.1 + coh.z * 0.01) * 0.1;
        
        // Move
        pos.x += obj.components.velocity.x;
        pos.y += obj.components.velocity.y;
        pos.z += obj.components.velocity.z;
    },
    
    // SIMPLE BATTLE AI
    battle: (obj, scene, time) => {
        if (!obj.tags) return;
        const myTeam = obj.tags.find(t => t.startsWith('team_'));
        if (!myTeam) return;
        
        const pos = obj.transform ? obj.transform.position : obj.position;
        const rot = obj.transform ? obj.transform.rotation : obj.rotation;
        if (!pos) return;

        // Find nearest enemy
        let nearest = null;
        let minDst = Infinity;
        
        scene.objects.forEach(o => {
            if (o && o.tags && o.tags.some(t => t.startsWith('team_') && t !== myTeam)) {
                const d = distance(o, obj);
                if (d < minDst) {
                    minDst = d;
                    nearest = o;
                }
            }
        });
        
        if (nearest) {
            const nPos = nearest.transform ? nearest.transform.position : nearest.position;
            if (!nPos) return;

            // Move towards enemy
            const dx = nPos.x - pos.x;
            const dz = nPos.z - pos.z;
            const len = Math.sqrt(dx*dx + dz*dz);
            if (len > 1.0) { // Stop if close
                pos.x += (dx/len) * 0.05; // Speed
                pos.z += (dz/len) * 0.05;
                
                // Face enemy
                if (rot) rot.y = -Math.atan2(dz, dx) + Math.PI/2;
            } else {
                // "Attack" (Wiggle)
                if (rot) rot.z = Math.sin(time * 20) * 0.2;
            }
        }
    },
    
    // CITY WANDER
    wander: (obj, scene, time) => {
        const pos = obj.transform ? obj.transform.position : obj.position;
        const rot = obj.transform ? obj.transform.rotation : obj.rotation;
        if (!pos || !rot) return;

        // Simple random walk
        const noise = Math.sin(time * 0.5 + obj.id.length);
        rot.y += noise * 0.02;
        
        const speed = 0.02;
        pos.x += Math.sin(rot.y) * speed;
        pos.z += Math.cos(rot.y) * speed;
        
        // Keep within bounds roughly
        if (pos.x > 50) pos.x = -50;
        if (pos.x < -50) pos.x = 50;
    },
    
    orbit: (obj, center, speed, radius, time) => {
        const pos = obj.transform ? obj.transform.position : obj.position;
        if (!pos) return;
        pos.x = center.x + Math.cos(time * speed) * radius;
        pos.z = center.z + Math.sin(time * speed) * radius;
    }
};

function distance(a, b) {
    const aPos = a.transform ? a.transform.position : a.position;
    const bPos = b.transform ? b.transform.position : b.position;
    if (!aPos || !bPos) return 0;
    const dx = aPos.x - bPos.x;
    const dy = aPos.y - bPos.y;
    const dz = aPos.z - bPos.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}