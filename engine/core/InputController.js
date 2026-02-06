// B"H
/**
 * InputController: The Conduit of Will
 * Translates user input (Mouse & Touch) into camera movements.
 */
export class InputController {
    constructor(canvas, cameraState) {
        this.canvas = canvas;
        this.camera = cameraState;
        
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.lastDist = 0;
        this.mode = 'none';

        this.initListeners();
    }

    initListeners() {
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());

        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.mode = (e.button === 2 || e.ctrlKey) ? 'pan' : 'orbit';
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;

        if (this.mode === 'orbit') this.orbit(dx, dy);
        if (this.mode === 'pan') this.pan(dx, dy);
    }

    onMouseUp() {
        this.isDragging = false;
        this.mode = 'none';
    }

    onWheel(e) {
        e.preventDefault();
        this.zoom(e.deltaY * 0.02);
    }

    getTouchDist(t1, t2) {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx*dx + dy*dy);
    }

    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            this.mode = 'orbit';
            this.lastX = e.touches[0].clientX;
            this.lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            this.mode = 'pan';
            this.lastX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            this.lastY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            this.lastDist = this.getTouchDist(e.touches[0], e.touches[1]);
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        if (this.mode === 'orbit' && e.touches.length === 1) {
            const dx = e.touches[0].clientX - this.lastX;
            const dy = e.touches[0].clientY - this.lastY;
            this.lastX = e.touches[0].clientX;
            this.lastY = e.touches[0].clientY;
            this.orbit(dx, dy);
        } else if (this.mode === 'pan' && e.touches.length === 2) {
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const dist = this.getTouchDist(e.touches[0], e.touches[1]);
            this.pan(centerX - this.lastX, centerY - this.lastY);
            this.zoom((this.lastDist - dist) * 0.5);
            this.lastX = centerX;
            this.lastY = centerY;
            this.lastDist = dist;
        }
    }

    onTouchEnd() { this.mode = 'none'; }

    orbit(dx, dy) {
        this.camera.theta -= dx * 0.008;
        this.camera.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.camera.phi - dy * 0.008));
    }

    pan(dx, dy) {
        const factor = this.camera.radius * 0.002;
        const cam = this.camera;
        // B"H - Corrected Pan: Positive DX moves target right along the horizontal camera axis
        const rightX = Math.cos(cam.theta + Math.PI / 2);
        const rightZ = Math.sin(cam.theta + Math.PI / 2);

        cam.target.x += dx * factor * rightX;
        cam.target.z += dx * factor * rightZ;
        cam.target.y += dy * factor;
    }

    zoom(amount) {
        this.camera.radius = Math.max(1, Math.min(1000, this.camera.radius + amount));
    }

    update() {}
}