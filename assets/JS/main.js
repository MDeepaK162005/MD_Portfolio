/* ============================================ */
/* MAIN.JS - Core JavaScript Functionality      */
/* ============================================ */

// ============================================
// 1. STRICT MODE & DOM READY
// ============================================

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Deepak AI Portfolio - Initializing...');
    
    // Initialize all modules
    initLoader();
    initNavbar();
    initMobileMenu();
    initScrollProgress();
    initBackToTop();
    initThemeToggle();
    initContactForm();
    initProjectFilters();
    initSmoothScroll();
    initParallax();
    
    console.log('✅ All modules initialized successfully!');
});

// ============================================
// 2. LOADING SCREEN
// ============================================

function initLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    
    // If loader doesn't exist, skip
    if (!loader) return;
    
    // Hide loader after 3 seconds (fallback)
    setTimeout(() => {
        if (loader.style.display !== 'none') {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s ease';
            setTimeout(() => {
                loader.style.display = 'none';
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
                document.body.style.overflow = 'auto';
            }, 800);
        }
    }, 3000);
}

// ============================================
// 3. NAVBAR SCROLL EFFECT
// ============================================

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up (optional)
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// 4. MOBILE MENU
// ============================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// 5. SCROLL PROGRESS BAR
// ============================================

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ============================================
// 6. BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 7. THEME TOGGLE (Dark/Light)
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    let isDark = true;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDark = false;
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        isDark = !isDark;
        document.body.classList.toggle('light-theme');
        this.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Animation feedback
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// ============================================
// 8. CONTACT FORM
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('input[placeholder="Your Name"]')?.value || '';
        const email = this.querySelector('input[placeholder="Your Email"]')?.value || '';
        const subject = this.querySelector('input[placeholder="Subject"]')?.value || '';
        const message = this.querySelector('textarea')?.value || '';
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show success message
        showNotification('Thank you for your message! I\'ll get back to you soon. 🚀', 'success');
        
        // Reset form
        this.reset();
        
        // Log form data (for debugging)
        console.log('📧 Form Submission:', { name, email, subject, message });
    });
}

// ============================================
// 9. PROJECT FILTERS
// ============================================

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterBtns.length || !projectCards.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || (category && category.includes(filter))) {
                    card.style.display = 'block';
                    card.style.animation = 'none';
                    // Trigger reflow
                    void card.offsetHeight;
                    card.style.animation = `fadeIn 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// 10. SMOOTH SCROLL FOR NAV LINKS
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 11. PARALLAX EFFECT ON HERO
// ============================================

function initParallax() {
    const heroWrapper = document.querySelector('.hero-wrapper');
    if (!heroWrapper) return;
    
    // Only apply on desktop
    if (window.innerWidth < 768) return;
    
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 8;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        heroWrapper.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    
    // Reset on mouse leave
    heroWrapper.addEventListener('mouseleave', function() {
        heroWrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        heroWrapper.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            heroWrapper.style.transition = 'none';
        }, 500);
    });
}

// ============================================
// 12. UTILITY FUNCTIONS
// ============================================

// Email validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--color-bg-tertiary)' : 'var(--color-bg-tertiary)'};
        border: 1px solid ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        animation: slideUp 0.5s ease forwards;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--color-text-primary);
        font-size: var(--text-sm);
    `;
    
    notification.querySelector('.notification-content i').style.cssText = `
        font-size: 24px;
        color: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        transition: color var(--transition-base);
    `;
    
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 5000);
}

// ============================================
// 13. INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

// Optional: Add custom intersection observer for elements without AOS
function initIntersectionObserver() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// 14. KEYBOARD ACCESSIBILITY
// ============================================

document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ============================================
// 15. PERFORMANCE: DEBOUNCE RESIZE
// ============================================

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle any resize-specific logic here
        console.log('📱 Window resized');
    }, 250);
});

// ============================================
// 16. CONSOLE WELCOME MESSAGE
// ============================================

console.log('%c🚀 Deepak AI Portfolio', 'font-size: 24px; font-weight: bold; color: #00E5FF;');
console.log('%cBuilt with ❤️ by Deepak', 'font-size: 14px; color: #94A3B8;');
console.log('%c👋 Thanks for visiting!', 'font-size: 14px; color: #94A3B8;');

// ============================================
// 17. EXPOSE FUNCTIONS FOR DEBUGGING
// ============================================

// Make functions available globally for debugging
window.showNotification = showNotification;
window.isValidEmail = isValidEmail;

console.log('✅ main.js loaded successfully!');