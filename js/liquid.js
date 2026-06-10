class LiquidEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, radius: 150 };
        this.width = 0;
        this.height = 0;
        this.animationId = null;

        this.init();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }

    init() {
        this.resize();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        this.particles = [];
        const count = Math.min(Math.floor(this.width * this.height / 12000), 80);
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 3 + 2,
                baseRadius: Math.random() * 3 + 2,
                hue: Math.random() * 60 + 240,
                saturation: Math.random() * 30 + 60,
                lightness: Math.random() * 20 + 50
            });
        }
    }

    update() {
        const gradient = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 0,
            this.mouse.x, this.mouse.y, this.mouse.radius * 2
        );
        gradient.addColorStop(0, 'rgba(108, 92, 231, 0.03)');
        gradient.addColorStop(0.5, 'rgba(162, 155, 254, 0.02)');
        gradient.addColorStop(1, 'rgba(253, 121, 168, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Mouse interaction
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.mouse.radius) {
                const force = (this.mouse.radius - dist) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                p.vx -= Math.cos(angle) * force * 0.5;
                p.vy -= Math.sin(angle) * force * 0.5;
            }

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Boundary bounce
            if (p.x < 0 || p.x > this.width) p.vx *= -0.5;
            if (p.y < 0 || p.y > this.height) p.vy *= -0.5;

            // Damping
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                const maxDist = 120;

                if (dist2 < maxDist) {
                    const alpha = (1 - dist2 / maxDist) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Draw particle glow
            const glowSize = p.radius * 3;
            const gradient2 = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, glowSize
            );
            gradient2.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0.15)`);
            gradient2.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
            this.ctx.fillStyle = gradient2;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0.8)`;
            this.ctx.fill();
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.update();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });

        window.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });

        window.addEventListener('touchend', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('liquidCanvas');
    if (canvas) {
        new LiquidEffect(canvas);
    }
});