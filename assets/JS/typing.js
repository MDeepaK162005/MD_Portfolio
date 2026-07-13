/* ============================================ */
/* TYPING.JS - Typing Animation Module          */
/* ============================================ */

'use strict';

// ============================================
// TYPING ANIMATION
// ============================================

class TypingAnimation {
    constructor(options = {}) {
        this.element = options.element || document.getElementById('typed-text');
        this.strings = options.strings || [
            'AI Engineer',
            'Python Developer',
            'Full Stack Developer',
            'ML Enthusiast',
            'Problem Solver',
            'Innovation Seeker'
        ];
        this.typeSpeed = options.typeSpeed || 80;
        this.backSpeed = options.backSpeed || 40;
        this.backDelay = options.backDelay || 1500;
        this.startDelay = options.startDelay || 500;
        this.loop = options.loop !== undefined ? options.loop : true;
        this.showCursor = options.showCursor !== undefined ? options.showCursor : false;
        this.cursorChar = options.cursorChar || '|';
        
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.timeout = null;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('TypingAnimation: No element provided');
            return;
        }
        
        // Clear any existing content
        this.element.textContent = '';
        
        // Start typing after delay
        setTimeout(() => {
            this.type();
        }, this.startDelay);
    }
    
    type() {
        if (this.isPaused) return;
        
        const currentString = this.strings[this.currentStringIndex];
        
        if (!this.isDeleting) {
            // Typing forward
            this.element.textContent = currentString.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentString.length) {
                // Word complete - pause before deleting
                this.isPaused = true;
                this.timeout = setTimeout(() => {
                    this.isPaused = false;
                    if (this.loop) {
                        this.isDeleting = true;
                        this.type();
                    }
                }, this.backDelay);
                return;
            }
            
            this.timeout = setTimeout(() => {
                this.type();
            }, this.typeSpeed);
        } else {
            // Deleting backward
            this.element.textContent = currentString.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                // Word deleted - move to next
                this.isDeleting = false;
                this.currentStringIndex = (this.currentStringIndex + 1) % this.strings.length;
                this.timeout = setTimeout(() => {
                    this.type();
                }, this.typeSpeed);
                return;
            }
            
            this.timeout = setTimeout(() => {
                this.type();
            }, this.backSpeed);
        }
    }
    
    // Add cursor element
    addCursor() {
        if (!this.showCursor) return;
        
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = this.cursorChar;
        cursor.style.cssText = `
            display: inline-block;
            animation: blink 0.8s step-end infinite;
            color: var(--color-primary);
            font-weight: var(--font-light);
        `;
        
        // Insert cursor after the typing element
        if (this.element.parentNode) {
            this.element.parentNode.appendChild(cursor);
        }
    }
    
    // Change strings dynamically
    setStrings(newStrings) {
        this.strings = newStrings;
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        clearTimeout(this.timeout);
        this.element.textContent = '';
        
        setTimeout(() => {
            this.type();
        }, this.startDelay);
    }
    
    // Stop typing
    stop() {
        this.isPaused = true;
        clearTimeout(this.timeout);
    }
    
    // Resume typing
    resume() {
        this.isPaused = false;
        this.type();
    }
    
    // Destroy instance
    destroy() {
        clearTimeout(this.timeout);
        this.isPaused = true;
        this.element.textContent = '';
    }
}

// ============================================
// INITIALIZE TYPING ANIMATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait for DOM to be ready
    setTimeout(() => {
        const typedElement = document.getElementById('typed-text');
        
        if (typedElement) {
            // Check if Typed.js library is available (fallback)
            if (typeof Typed !== 'undefined') {
                // Use Typed.js library
                new Typed('#typed-text', {
                    strings: [
                        'AI Engineer',
                        'Python Developer',
                        'Full Stack Developer',
                        'ML Enthusiast',
                        'Problem Solver',
                        'Innovation Seeker'
                    ],
                    typeSpeed: 80,
                    backSpeed: 40,
                    backDelay: 1500,
                    startDelay: 500,
                    loop: true,
                    showCursor: false
                });
                console.log('✅ Typing animation initialized with Typed.js');
            } else {
                // Use custom typing animation
                const typing = new TypingAnimation({
                    element: typedElement,
                    strings: [
                        'AI Engineer',
                        'Python Developer',
                        'Full Stack Developer',
                        'ML Enthusiast',
                        'Problem Solver',
                        'Innovation Seeker'
                    ],
                    typeSpeed: 80,
                    backSpeed: 40,
                    backDelay: 1500,
                    startDelay: 500,
                    loop: true,
                    showCursor: false
                });
                console.log('✅ Typing animation initialized with custom module');
            }
        } else {
            console.warn('⚠️ Typing element not found');
        }
    }, 1000); // Wait 1 second for everything to load
});

// ============================================
// EXPOSE CLASS FOR GLOBAL USE
// ============================================

if (typeof window !== 'undefined') {
    window.TypingAnimation = TypingAnimation;
}

console.log('✅ typing.js loaded successfully!');