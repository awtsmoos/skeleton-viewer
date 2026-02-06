// B"H
export class KeyframeSystem {
    update(scene, time) {
        scene.objects.forEach(obj => {
            this.animateObject(obj, time);
            if (obj.children) obj.children.forEach(c => this.animateObject(c, time));
        });
        
        // Animate Camera
        scene.cameras.forEach(cam => {
             // Future expansion for camera timeline
        });
    }

    animateObject(obj, time) {
        if (!obj.timeline || obj.timeline.length === 0) return;

        obj.timeline.forEach(track => {
            const val = this.evaluate(track, time);
            if (val !== null) {
                this.applyValue(obj, track.path, val);
            }
        });
    }

    evaluate(track, time) {
        if (!track.keys || track.keys.length === 0) return null;

        // Sort keys by time
        const keys = track.keys.sort((a,b) => a.time - b.time);
        
        // Before first
        if (time <= keys[0].time) return keys[0].value;
        // After last
        if (time >= keys[keys.length-1].time) return keys[keys.length-1].value;

        // Find range
        let k1 = keys[0];
        let k2 = keys[1];
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (time >= keys[i].time && time < keys[i+1].time) {
                k1 = keys[i];
                k2 = keys[i+1];
                break;
            }
        }

        // Interpolate
        const t = (time - k1.time) / (k2.time - k1.time);
        const easedT = this.ease(t, k2.ease);
        
        return k1.value + (k2.value - k1.value) * easedT;
    }

    ease(t, type) {
        if (type === 'linear') return t;
        if (type === 'easeIn') return t * t;
        if (type === 'easeOut') return t * (2 - t);
        if (type === 'easeInOut') return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        return t;
    }

    applyValue(obj, path, value) {
        const parts = path.split('.');
        let target = obj;
        
        // Traverse
        for(let i=0; i<parts.length-1; i++) {
            const part = parts[i];
            // Handle array indices in path like "color.0"
            if (target[part] === undefined && Array.isArray(target) && !isNaN(part)) {
                 target = target[parseInt(part)];
            } else {
                 target = target[part];
            }
            if (!target) return; // Path broken
        }
        
        const last = parts[parts.length-1];
        // Handle array assignment
        if (Array.isArray(target) && !isNaN(last)) {
            target[parseInt(last)] = value;
        } else {
            target[last] = value;
        }
    }
}

export const GlobalKeyframes = new KeyframeSystem();