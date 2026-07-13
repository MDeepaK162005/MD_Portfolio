/* ============================================ */
/* CURSOR.JS - Custom Cursor Module             */
/* ============================================ */

'use strict';

// ============================================
// CUSTOM CURSOR CLASS
// ============================================

class CustomCursor {
    constructor(options = {}) {
        this.dot = options.dot || document.getElementById('cursorDot');
        this.circle = options.circle || document.getElementById('cursorCircle');
        this.trail = options.trail || document.getElementById('cursorTrail');
        
        this.mouseX = -100;
        this.mouseY = -100;
        this.circleX = -100;
        this.circleY = -100;
        this.speed = options.speed || 0.15;
        this.isVisible = false;
        this.isHovering = false;
        this.trailPositions = [];
        this.maxTrailLength = options.maxTrailLength || 10;
        
        this.init();
    }
    
    init() {
        // Check if cursor elements exist
        if (!this.dot || !this.circle) {
            console.warn('CustomCursor: Cursor elements not found');
            return;
        }
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Add custom cursor styles
        this.addStyles();
        
        // Event listeners
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        document.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        
        // Hover effects
        this.setupHoverEffects();
        
        // Start animation loop
        this.animate();
        
        console.log('✅ Custom cursor initialized');
    }
    
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Update dot immediately
        this.dot.style.left = this.mouseX + 'px';
        this.dot.style.top = this.mouseY + 'px';
        
        // Add to trail
        this.trailPositions.push({ x: this.mouseX, y: this.mouseY });
        if (this.trailPositions.length > this.maxTrailLength) {
            this.trailPositions.shift();
        }
        
        // Update trail
        this.updateTrail();
    }
    
    onMouseEnter() {
        this.isVisible = true;
        this.dot.style.opacity = '1';
        this.circle.style.opacity = '0.5';
        if (this.trail) this.trail.style.opacity = '0.3';
    }
    
    onMouseLeave() {
        this.isVisible = false;
        this.dot.style.opacity = '0';
        this.circle.style.opacity = '0';
        if (this.trail) this.trail.style.opacity = '0';
        this.trailPositions = [];
    }
    
    animate() {
        // Smooth circle follow with delay
        const dx = this.mouseX - this.circleX;
        const dy = this.mouseY - this.circleY;
        
        this.circleX += dx * this.speed;
        this.circleY += dy * this.speed;
        
        this.circle.style.left = this.circleX + 'px';
        this.circle.style.top = this.circleY + 'px';
        
        requestAnimationFrame(this.animate.bind(this));
    }
    
    updateTrail() {
        if (!this.trail) return;
        
        // Update trail positions
        if (this.trailPositions.length > 0) {
            const lastPos = this.trailPositions[this.trailPositions.length - 1];
            this.trail.style.left = lastPos.x + 'px';
            this.trail.style.top = lastPos.y + 'px';
        }
    }
    
    setupHoverEffects() {
        // Hoverable elements
        const hoverElements = document.querySelectorAll(
            'a, button, .btn-primary, .btn-secondary, .project-card, .skill-card, ' +
            '.service-card, .cert-card, .tech-item, .filter-btn, .logo, ' +
            '.social-icon, .contact-social a, .footer-social a'
        );
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.dot.classList.add('hover');
                this.circle.classList.add('hover');
                if (this.trail) this.trail.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.dot.classList.remove('hover');
                this.circle.classList.remove('hover');
                if (this.trail) this.trail.classList.remove('hover');
            });
        });
        
        // Also watch for dynamically added elements
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll(
                'a:not([data-cursor-hover]), button:not([data-cursor-hover]), ' +
                '.btn-primary:not([data-cursor-hover]), .btn-secondary:not([data-cursor-hover]), ' +
                '.project-card:not([data-cursor-hover])'
            );
            
            newElements.forEach(el => {
                el.setAttribute('data-cursor-hover', 'true');
                el.addEventListener('mouseenter', () => {
                    this.isHovering = true;
                    this.dot.classList.add('hover');
                    this.circle.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    this.isHovering = false;
                    this.dot.classList.remove('hover');
                    this.circle.classList.remove('hover');
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cursor-dot {
                position: fixed;
                width: 8px;
                height: 8px;
                background: var(--color-primary, #00E5FF);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, opacity 0.3s;
                box-shadow: 0 0 10px var(--color-primary-glow, rgba(0, 229, 255, 0.5));
            }
            
            .cursor-dot.hover {
                width: 4px;
                height: 4px;
                background: var(--color-primary-light, #66F0FF);
            }
            
            .cursor-circle {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid var(--color-primary, #00E5FF);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
                transition: width 0.3s, height 0.3s, border-color 0.3s, opacity 0.3s;
                opacity: 0.5;
                box-shadow: 0 0 20px var(--color-primary-glow, rgba(0, 229, 255, 0.2));
            }
            
            .cursor-circle.hover {
                width: 60px;
                height: 60px;
                border-color: var(--color-primary-light, #66F0FF);
                opacity: 0.8;
                border-width: 3px;
            }
            
            .cursor-trail {
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--color-primary, #00E5FF);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9997;
                transform: translate(-50%, -50%);
                opacity: 0.3;
                transition: opacity 0.5s;
                box-shadow: 0 0 15px var(--color-primary-glow, rgba(0, 229, 255, 0.3));
            }
            
            .cursor-trail.hover {
                opacity: 0.6;
                width: 6px;
                height: 6px;
            }
            
            /* Hide cursor on touch devices */
            @media (hover: none) and (pointer: coarse) {
                .cursor-dot,
                .cursor-circle,
                .cursor-trail {
                    display: none !important;
                }
                body {
                    cursor: auto !important;
                }
            }
            
            /* Hide cursor on small screens */
            @media (max-width: 768px) {
                .cursor-dot,
                .cursor-circle,
                .cursor-trail {
                    display: none !important;
                }
                body {
                    cursor: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update cursor color
    setColor(color) {
        this.dot.style.background = color;
        this.circle.style.borderColor = color;
        if (this.trail) this.trail.style.background = color;
    }
    
    // Set cursor size
    setSize(dotSize, circleSize) {
        this.dot.style.width = dotSize + 'px';
        this.dot.style.height = dotSize + 'px';
        this.circle.style.width = circleSize + 'px';
        this.circle.style.height = circleSize + 'px';
    }
    
    // Destroy cursor
    destroy() {
        document.body.style.cursor = 'auto';
        if (this.dot) this.dot.remove();
        if (this.circle) this.circle.remove();
        if (this.trail) this.trail.remove();
        
        // Remove styles
        const styles = document.querySelectorAll('style[data-cursor]');
        styles.forEach(style => style.remove());
    }
}

// ============================================
// INITIALIZE CUSTOM CURSOR
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for DOM to be ready
    setTimeout(() => {
        const dot = document.getElementById('cursorDot');
        const circle = document.getElementById('cursorCircle');
        const trail = document.getElementById('cursorTrail');
        
        if (dot && circle) {
            const cursor = new CustomCursor({
                dot: dot,
                circle: circle,
                trail: trail,
                speed: 0.15,
                maxTrailLength: 10
            });
            
            // Expose for debugging
            window.customCursor = cursor;
            console.log('✅ Custom cursor initialized');
        } else {
            console.warn('⚠️ Cursor elements not found');
        }
    }, 500);
});

// ============================================
// EXPOSE CLASS FOR GLOBAL USE
// ============================================

if (typeof window !== 'undefined') {
    window.CustomCursor = CustomCursor;
}

console.log('✅ cursor.js loaded successfully!');