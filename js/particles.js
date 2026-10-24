// Canvas Particle & Combat FX System
// Renders swirling portal vortex, combat sparks, floating damage numbers, and camera shake.

class ParticleFX {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animId = null;
        this.isPortalActive = false;
        this.portalAngle = 0;
    }

    init(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.startLoop();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth || window.innerWidth;
        this.canvas.height = this.canvas.offsetHeight || window.innerHeight;
    }

    startLoop() {
        if (this.animId) cancelAnimationFrame(this.animId);
        const loop = () => {
            this.update();
            this.draw();
            this.animId = requestAnimationFrame(loop);
        };
        loop();
    }

    update() {
        // Update portal rotation
        this.portalAngle += 0.025;

        // Update active particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.vy += p.gravity || 0;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw portal if active
        if (this.isPortalActive) {
            this.drawPortalVortex();
        }

        // Draw particles
        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = p.glow || 8;
            this.ctx.shadowColor = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }
    }

    drawPortalVortex() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const radius = Math.min(cx, cy) * 0.45;

        this.ctx.save();
        this.ctx.translate(cx, cy);

        // Outer pulsing ring
        const pulse = Math.sin(Date.now() * 0.005) * 6;
        const grad = this.ctx.createRadialGradient(0, 0, 10, 0, 0, radius + pulse);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius + pulse + 30, 0, Math.PI * 2);
        this.ctx.fill();

        // Rotating energy runes
        const runeCount = 12;
        for (let i = 0; i < runeCount; i++) {
            const angle = this.portalAngle + (i * (Math.PI * 2 / runeCount));
            const r = radius + Math.sin(this.portalAngle * 2 + i) * 8;
            const rx = Math.cos(angle) * r;
            const ry = Math.sin(angle) * r;

            this.ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#c084fc';
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(rx - 3, ry - 3, 6, 6);
        }

        // Inner vortex spirals
        this.ctx.rotate(this.portalAngle);
        for (let spiral = 0; spiral < 3; spiral++) {
            this.ctx.strokeStyle = spiral === 0 ? '#38bdf8' : spiral === 1 ? '#a855f7' : '#ec4899';
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            for (let a = 0; a < Math.PI * 4; a += 0.2) {
                const sr = (a / (Math.PI * 4)) * (radius * 0.85);
                const sx = Math.cos(a + (spiral * Math.PI * 0.6)) * sr;
                const sy = Math.sin(a + (spiral * Math.PI * 0.6)) * sr;
                if (a === 0) this.ctx.moveTo(sx, sy);
                else this.ctx.lineTo(sx, sy);
            }
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    setPortalActive(active) {
        this.isPortalActive = active;
    }

    burstSlashSparks(x, y, count = 28) {
        const colors = ['#00f0ff', '#38bdf8', '#e0f2fe', '#a855f7'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 8;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: 3 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.025 + Math.random() * 0.03,
                gravity: 0.15,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
                glow: 12
            });
        }
    }

    burstDamageBlood(x, y, count = 20) {
        const colors = ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 3 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.03 + Math.random() * 0.03,
                gravity: 0.25,
                shape: 'rect',
                glow: 8
            });
        }
    }

    spawnFloatingText(text, x, y, color = '#00f0ff', isCrit = false) {
        const el = document.createElement('div');
        el.className = 'floating-damage-number' + (isCrit ? ' crit' : '');
        el.textContent = text;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.color = color;
        document.body.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 1200);
    }

    screenShake(element = document.body, intensity = 8, durationMs = 350) {
        const start = Date.now();
        const origTransform = element.style.transform;
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            if (elapsed >= durationMs) {
                clearInterval(interval);
                element.style.transform = origTransform || '';
                return;
            }
            const decay = 1 - (elapsed / durationMs);
            const dx = (Math.random() * 2 - 1) * intensity * decay;
            const dy = (Math.random() * 2 - 1) * intensity * decay;
            element.style.transform = `translate(${dx}px, ${dy}px)`;
        }, 16);
    }
}

export const fx = new ParticleFX();
