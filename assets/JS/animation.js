/* ============================================ */
/* ANIMATION.JS - Advanced Animation Module     */
/* ============================================ */

'use strict';

// ============================================
// ANIMATION CONTROLLER CLASS
// ============================================

class AnimationController {
    constructor() {
        this.animations = [];
        this.observers = [];
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Initialize AOS
        this.initAOS();
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize counter animations
        this.initCounters();
        
        // Initialize skill circle animations
        this.initSkillCircles();
        
        // Initialize 3D tilt
        this.initTilt();
        
        // Initialize floating elements
        this.initFloating();
        
        // Initialize mouse parallax
        this.initParallax();
        
        this.isInitialized = true;
        console.log('✅ Animation controller initialized');
    }
    
    // ============================================
    // AOS (Animate On Scroll)
    // ============================================
    
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                delay: 0,
                disable: function() {
                    return window.innerWidth < 768;
                }
            });
            console.log('✅ AOS initialized');
        } else {
            console.warn('⚠️ AOS library not found, using fallback');
            this.fallbackAOS();
        }
    }
    
    fallbackAOS() {
        // Manual scroll reveal
        const elements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;
                    
                    setTimeout(() => {
                        el.classList.add('aos-animate');
                    }, delay);
                    
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }
    
    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    initScrollAnimations() {
        // Elements to animate on scroll
        const selectors = [
            '.section-header',
            '.hero-content',
            '.hero-image-wrapper',
            '.about-wrapper',
            '.skills-grid',
            '.projects-grid',
            '.certificates-grid',
            '.services-grid',
            '.timeline-item',
            '.contact-wrapper'
        ];
        
        const elements = document.querySelectorAll(selectors.join(','));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.getAttribute('data-delay')) || 0;
                    
                    // Add animation class with delay
                    setTimeout(() => {
                        el.classList.add('animate-in');
                    }, delay);
                    
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }
    
    // ============================================
    // COUNTER ANIMATIONS
    // ============================================
    
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        let hasAnimated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    this.animateCounters(counters);
                }
            });
        }, {
            threshold: 0.5
        });
        
        if (counters.length) {
            observer.observe(counters[0].closest('.about-stats') || counters[0]);
        }
    }
    
    animateCounters(counters) {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target) return;
            
            let current = 0;
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            const interval = duration / steps;
            
            counter.textContent = '0';
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.round(current);
            }, interval);
        });
    }
    
    // ============================================
    // SKILL CIRCLE ANIMATIONS
    // ============================================
    
    initSkillCircles() {
        const circles = document.querySelectorAll('.skill-circle');
        let hasAnimated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    this.animateSkillCircles(circles);
                }
            });
        }, {
            threshold: 0.3
        });
        
        if (circles.length) {
            observer.observe(circles[0].closest('.skills-grid') || circles[0]);
        }
    }
    
    animateSkillCircles(circles) {
        circles.forEach(circle => {
            const percent = parseInt(circle.getAttribute('data-percent'));
            if (!percent) return;
            
            const progressCircle = circle.querySelector('.skill-progress');
            if (!progressCircle) return;
            
            const circumference = 2 * Math.PI * 50;
            const offset = circumference - (percent / 100) * circumference;
            
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;
            
            // Animate with delay
            const delay = parseInt(circle.closest('.skill-card')?.getAttribute('data-aos-delay')) || 0;
            setTimeout(() => {
                progressCircle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                progressCircle.style.strokeDashoffset = offset;
            }, delay + 300);
        });
    }
    
    // ============================================
    // 3D TILT EFFECT (Vanilla Tilt)
    // ============================================
    
    initTilt() {
        // Check if VanillaTilt is available
        if (typeof VanillaTilt !== 'undefined') {
            // Hero image card
            const heroCard = document.getElementById('heroImageCard');
            if (heroCard) {
                VanillaTilt.init(heroCard, {
                    max: 15,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.3,
                    scale: 1.02,
                    perspective: 1000,
                    easing: 'cubic-bezier(.03,.98,.52,.99)',
                    gyroscope: true,
                    gyroscopeMinAngleX: -45,
                    gyroscopeMinAngleY: -45
                });
            }
            
            // Project cards
            const projectCards = document.querySelectorAll('.project-card');
            if (projectCards.length) {
                VanillaTilt.init(projectCards, {
                    max: 8,
                    speed: 300,
                    glare: false,
                    scale: 1.02,
                    perspective: 800,
                    easing: 'cubic-bezier(.03,.98,.52,.99)'
                });
            }
            
            // Service cards
            const serviceCards = document.querySelectorAll('.service-card');
            if (serviceCards.length) {
                VanillaTilt.init(serviceCards, {
                    max: 5,
                    speed: 200,
                    glare: false,
                    scale: 1.02,
                    perspective: 600
                });
            }
            
            console.log('✅ 3D Tilt initialized');
        } else {
            console.warn('⚠️ VanillaTilt library not found');
        }
    }
    
    // ============================================
    // FLOATING ANIMATIONS
    // ============================================
    
    initFloating() {
        const floatingElements = document.querySelectorAll('.floating-badge, .float-animate');
        
        floatingElements.forEach((el, index) => {
            const delay = (index % 3) * 1;
            const duration = 3 + (index % 2);
            
            el.style.animation = `float${(index % 3) + 1} ${duration}s ease-in-out ${delay}s infinite`;
        });
    }
    
    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    
    initParallax() {
        // Only on desktop
        if (window.innerWidth < 1024) return;
        
        const hero = document.querySelector('.hero-wrapper');
        if (!hero) return;
        
        let isAnimating = false;
        
        document.addEventListener('mousemove', function(e) {
            if (isAnimating) return;
            isAnimating = true;
            
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 8;
                const y = (e.clientY / window.innerHeight - 0.5) * 8;
                
                hero.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
                
                isAnimating = false;
            });
        });
        
        // Reset on mouse leave
        hero.addEventListener('mouseleave', function() {
            hero.style.transition = 'transform 0.5s ease';
            hero.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
            
            setTimeout(() => {
                hero.style.transition = 'none';
            }, 500);
        });
    }
    
    // ============================================
    // TYPING ANIMATION (Fallback)
    // ============================================
    
    initTyping(element, strings) {
        if (!element) return null;
        
        // Check if Typed.js is available
        if (typeof Typed !== 'undefined') {
            return new Typed(element, {
                strings: strings,
                typeSpeed: 80,
                backSpeed: 40,
                backDelay: 1500,
                startDelay: 500,
                loop: true,
                showCursor: false
            });
        }
        
        // Fallback - simple typing
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout = null;
        
        function type() {
            const currentString = strings[index];
            
            if (!isDeleting) {
                element.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentString.length) {
                    isDeleting = true;
                    timeout = setTimeout(type, 1500);
                    return;
                }
                
                timeout = setTimeout(type, 80);
            } else {
                element.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    index = (index + 1) % strings.length;
                    timeout = setTimeout(type, 80);
                    return;
                }
                
                timeout = setTimeout(type, 40);
            }
        }
        
        setTimeout(type, 500);
        
        return {
            stop: () => clearTimeout(timeout),
            destroy: () => {
                clearTimeout(timeout);
                element.textContent = '';
            }
        };
    }
    
    // ============================================
    // DESTROY METHOD
    // ============================================
    
    destroy() {
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        // Clear all timeouts
        // Note: Can't clear all timeouts, but we can track them
        console.log('Animation controller destroyed');
    }
}

// ============================================
// INITIALIZE ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait for everything to load
    setTimeout(() => {
        const controller = new AnimationController();
        
        // Expose for debugging
        window.animationController = controller;
        
        console.log('✅ Animation system ready');
    }, 500);
});

// ============================================
// EXPOSE CLASS FOR GLOBAL USE
// ============================================

if (typeof window !== 'undefined') {
    window.AnimationController = AnimationController;
}

console.log('✅ animation.js loaded successfully!');