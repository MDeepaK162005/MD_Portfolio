/* ============================================ */
/* PARTICLES.JS - Particle Background Module    */
/* ============================================ */

'use strict';

// ============================================
// PARTICLE SYSTEM CLASS
// ============================================

class ParticleSystem {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('particles-bg');
        this.count = options.count || 80;
        this.color = options.color || '#00E5FF';
        this.size = options.size || { min: 1, max: 3 };
        this.speed = options.speed || { x: 0.3, y: 0.3 };
        this.opacity = options.opacity || { min: 0.2, max: 0.8 };
        this.connectDistance = options.connectDistance || 150;
        this.mouseRadius = options.mouseRadius || 200;
        
        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.mouseX = null;
        this.mouseY = null;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.warn('ParticleSystem: Container not found');
            return;
        }
        
        // Set container styles
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
        `;
        
        // Get dimensions
        this.resize();
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Create particles
        this.createParticles();
        
        // Event listeners
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        
        // Start animation
        this.start();
        
        console.log('✅ Particle system initialized with ' + this.count + ' particles');
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.speed.x * 2,
                vy: (Math.random() - 0.5) * this.speed.y * 2,
                size: this.size.min + Math.random() * (this.size.max - this.size.min),
                opacity: this.opacity.min + Math.random() * (this.opacity.max - this.opacity.min),
                targetOpacity: this.opacity.min + Math.random() * (this.opacity.max - this.opacity.min)
            });
        }
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        
        // Reposition particles on resize
        if (this.particles.length) {
            this.particles.forEach(p => {
                p.x = Math.min(p.x, this.width);
                p.y = Math.min(p.y, this.height);
            });
        }
    }
    
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    onMouseLeave() {
        this.mouseX = null;
        this.mouseY = null;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.particles.forEach((p, index) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            
            // Clamp position
            p.x = Math.max(0, Math.min(p.x, this.width));
            p.y = Math.max(0, Math.min(p.y, this.height));
            
            // Mouse interaction
            if (this.mouseX !== null && this.mouseY !== null) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouseRadius) {
                    const force = (this.mouseRadius - dist) / this.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 2;
                    const pushY = Math.sin(angle) * force * 2;
                    p.x -= pushX;
                    p.y -= pushY;
                    
                    // Increase opacity near mouse
                    p.targetOpacity = this.opacity.min + (this.opacity.max - this.opacity.min) * (1 - force * 0.5);
                } else {
                    p.targetOpacity = this.opacity.min + Math.random() * (this.opacity.max - this.opacity.min) * 0.5;
                }
            }
            
            // Smooth opacity transition
            p.opacity += (p.targetOpacity - p.opacity) * 0.02;
            
            // Draw particle
            this.drawParticle(p);
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
    
    drawParticle(p) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, this.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        
        // Glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.globalAlpha = 1;
    }
    
    drawConnections() {
        const ctx = this.ctx;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.connectDistance) {
                    const opacity = (1 - dist / this.connectDistance) * 0.3;
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = opacity;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    // Set particle color
    setColor(color) {
        this.color = color;
    }
    
    // Update particle count
    setCount(count) {
        this.count = count;
        this.createParticles();
    }
    
    // Destroy system
    destroy() {
        this.stop();
        if (this.canvas) {
            this.canvas.remove();
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
        window.removeEventListener('resize', this.resize);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseleave', this.onMouseLeave);
        console.log('Particle system destroyed');
    }
}

// ============================================
// INITIALIZE PARTICLES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if tsParticles is available (library)
    if (typeof tsParticles !== 'undefined') {
        // Use tsParticles library for better performance
        tsParticles.load('particles-bg', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00E5FF'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00E5FF',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 200,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 3
                    }
                }
            },
            retina_detect: true
        });
        console.log('✅ Particles initialized with tsParticles library');
    } else {
        // Use custom particle system
        const container = document.getElementById('particles-bg');
        if (container) {
            // Check if device is mobile - reduce particles
            const isMobile = window.innerWidth < 768;
            const particleCount = isMobile ? 30 : 80;
            
            const particles = new ParticleSystem({
                container: container,
                count: particleCount,
                color: '#00E5FF',
                size: { min: 1, max: isMobile ? 2 : 3 },
                speed: { x: 0.3, y: 0.3 },
                opacity: { min: 0.2, max: 0.8 },
                connectDistance: isMobile ? 100 : 150,
                mouseRadius: isMobile ? 100 : 200
            });
            
            // Expose for debugging
            window.particleSystem = particles;
            console.log('✅ Particles initialized with custom system');
        } else {
            console.warn('⚠️ Particle container not found');
        }
    }
});

// ============================================
// EXPOSE CLASS FOR GLOBAL USE
// ============================================

if (typeof window !== 'undefined') {
    window.ParticleSystem = ParticleSystem;
}

console.log('✅ particles.js loaded successfully!');