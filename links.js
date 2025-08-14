// Enhanced Portfolio JavaScript with Fluid Cursor Effects and File Management
// Author: Soumik Sahoo Portfolio Enhancement

class EnhancedPortfolioManager {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.fileLinks = {};
        this.isInitialized = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        
        this.init();
    }

    // Initialize all functionality
    init() {
        if (this.isInitialized) return;
        
        this.initializeCursor();
        this.initializeFileLinks();
        this.attachEventListeners();
        this.createParticleBackground();
        this.initializeScrollAnimations();
        this.addInteractiveEffects();
        
        this.isInitialized = true;
        console.log('Enhanced Portfolio Manager initialized successfully');
    }

    // Enhanced Fluid Cursor System
    initializeCursor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.cursorFollower) {
            console.warn('Cursor elements not found');
            return;
        }

        // Smooth cursor movement with requestAnimationFrame
        const updateCursor = () => {
            this.cursor.style.left = this.mouseX + 'px';
            this.cursor.style.top = this.mouseY + 'px';
            
            // Smooth follower with easing
            this.followerX += (this.mouseX - this.followerX) * 0.1;
            this.followerY += (this.mouseY - this.followerY) * 0.1;
            
            this.cursorFollower.style.left = this.followerX + 'px';
            this.cursorFollower.style.top = this.followerY + 'px';
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();

        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Enhanced hover effects
        const hoverElements = document.querySelectorAll('.hover-glow, .achievement-card, .lab-section, .specialization, .journey-item, [data-file-link]');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
                element.style.cursor = 'none';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            });
        });

        // Click ripple effect
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
    }

    // Create ripple effect on click
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // File Links Configuration
    initializeFileLinks() {
        this.fileLinks = {
            // Research Projects
            'research': {
                'condensed-matter': {
                    file: 'files/research/condensed-matter-physics.pdf',
                    description: 'Condensed Matter Physics Research Papers'
                },
                'physics-ai': {
                    file: 'files/research/physics-informed-ai.pdf',
                    description: 'Physics-Informed Neural Networks Project'
                },
                'astrophysics': {
                    file: 'files/research/computational-astrophysics.pdf',
                    description: 'Computational Astrophysics Research'
                },
                'quantum-wave': {
                    file: 'files/research/quantum-wave-function.pdf',
                    description: 'Quantum Wave Function Analysis'
                },
                'particle-interaction': {
                    file: 'files/research/particle-interaction-study.pdf',
                    description: 'Particle Interaction Simulations'
                }
            },
            
            // Academic Achievements
            'achievements': {
                'nest': {
                    file: 'files/achievements/nest-2022-certificate.pdf',
                    description: 'NEST 2022 Achievement Certificate'
                },
                'jee-advanced': {
                    file: 'files/achievements/jee-advanced-scorecard.pdf',
                    description: 'JEE Advanced 2023 Score Card'
                },
                'jee-mains': {
                    file: 'files/achievements/jee-mains-scorecard.pdf',
                    description: 'JEE Mains 2023 Score Card'
                },
                'jee-combined': {
                    file: 'files/achievements/jee-combined-results.pdf',
                    description: 'Combined JEE Results and Analysis'
                }
            },
            
            // Academic Documents
            'academic': {
                'transcript': {
                    file: 'files/academic/iit-bombay-transcript.pdf',
                    description: 'IIT Bombay Academic Transcript'
                },
                'current': {
                    file: 'files/academic/current-semester-report.pdf',
                    description: 'Current Academic Progress Report'
                },
                'higher-secondary': {
                    file: 'files/academic/higher-secondary-certificate.pdf',
                    description: 'Higher Secondary Education Certificate'
                },
                'secondary': {
                    file: 'files/academic/secondary-school-certificate.pdf',
                    description: 'Secondary School Certificate'
                }
            },
            
            // Portfolio Assets
            'portfolio': {
                'skills': {
                    file: 'files/portfolio/skills-overview.pdf',
                    description: 'Complete Skills and Competencies Overview'
                },
                'cv': {
                    file: 'files/portfolio/soumik-sahoo-cv.pdf',
                    description: 'Complete Academic and Research CV'
                },
                'research-portfolio': {
                    file: 'files/portfolio/research-portfolio.pdf',
                    description: 'Comprehensive Research Portfolio'
                }
            }
        };
    }

    // Attach all event listeners
    attachEventListeners() {
        // File link event handlers
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-file-link]');
            if (element) {
                e.preventDefault();
                const linkData = element.getAttribute('data-file-link').split('.');
                if (linkData.length === 2) {
                    this.openFile(linkData[0], linkData[1]);
                }
            }
        });

        // Enhanced hover effects for file links
        const fileElements = document.querySelectorAll('[data-file-link]');
        fileElements.forEach(element => {
            element.classList.add('file-link-indicator');
            
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
                element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
                element.style.boxShadow = '';
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.updateParticles();
        });
    }

    // File opening functionality
    openFile(category, fileKey) {
        const fileData = this.fileLinks[category]?.[fileKey];
        
        if (!fileData) {
            console.warn(`File link not found for ${category}.${fileKey}`);
            this.showFileNotAvailable(`${category} - ${fileKey}`);
            return;
        }

        // Add loading animation
        this.showLoadingAnimation();

        // Check if file exists and open
        this.checkFileExists(fileData.file)
            .then(exists => {
                this.hideLoadingAnimation();
                
                if (exists) {
                    window.open(fileData.file, '_blank');
                    this.trackFileAccess(category, fileKey);
                } else {
                    this.showFileNotAvailable(fileData.description);
                }
            })
            .catch(() => {
                this.hideLoadingAnimation();
                // If check fails, try to open anyway
                window.open(fileData.file, '_blank');
                this.trackFileAccess(category, fileKey);
            });
    }

    // Check if file exists
    checkFileExists(filePath) {
        return new Promise((resolve) => {
            fetch(filePath, { method: 'HEAD' })
                .then(response => resolve(response.ok))
                .catch(() => resolve(false));
        });
    }

    // Track file access for analytics
    trackFileAccess(category, fileKey) {
        console.log(`File accessed: ${category}.${fileKey}`);
        // Add analytics tracking here if needed
    }

    // Loading animation
    showLoadingAnimation() {
        const loader = document.createElement('div');
        loader.id = 'file-loader';
        loader.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.7); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
            ">
                <div style="
                    background: white; padding: 2rem; border-radius: 8px;
                    text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <div style="
                        width: 40px; height: 40px; border: 4px solid #f3f3f3;
                        border-top: 4px solid #667eea; border-radius: 50%;
                        animation: spin 1s linear infinite; margin: 0 auto 1rem;
                    "></div>
                    <p>Loading file...</p>
                </div>
            </div>
        `;
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loader);
    }

    // Hide loading animation
    hideLoadingAnimation() {
        const loader = document.getElementById('file-loader');
        if (loader) {
            loader.remove();
        }
    }

    // Show file not available modal
    showFileNotAvailable(description) {
        const modal = document.createElement('div');
        modal.id = 'file-modal';
        modal.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.7); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: white; padding: 3rem; border-radius: 15px;
                    max-width: 500px; text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    transform: scale(0.9); animation: modalSlideIn 0.3s ease forwards;
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                    <h3 style="color: #667eea; margin-bottom: 1rem;">${description}</h3>
                    <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
                        This document is currently being prepared and will be available soon. 
                        Thank you for your interest in my work!
                    </p>
                    <button onclick="this.closest('#file-modal').remove()" style="
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white; border: none; padding: 12px 30px;
                        border-radius: 25px; cursor: pointer; font-size: 1rem;
                        transition: transform 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.05)'"
                       onmouseout="this.style.transform='scale(1)'">
                        Got it!
                    </button>
                </div>
            </div>
        `;
        
        // Add modal animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes modalSlideIn {
                from { transform: scale(0.9) translateY(20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.getElementById('file-modal')) {
                this.closeModal();
            }
        }, 10000);
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('file-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Create animated particle background
    createParticleBackground() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const numberOfParticles = 50;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random positioning and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (3 + Math.random() * 6) + 's';
            
            particlesContainer.appendChild(particle);
        }
    }

    // Update particles on resize
    updateParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
        });
    }

    // Initialize scroll animations
    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animatedElements = document.querySelectorAll('.fade-in');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // Add interactive effects
    addInteractiveEffects() {
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.particles');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Dynamic gradient effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            document.body.style.background = `
                linear-gradient(
                    ${135 + (x * 30)}deg, 
                    hsl(${230 + (x * 20)}, ${70 + (y * 10)}%, ${60 + (y * 10)}%) 0%, 
                    hsl(${280 + (x * 20)}, ${70 + (y * 10)}%, ${50 + (y * 10)}%) 100%
                )
            `;
        });

        // Add smooth scrolling to internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Utility methods for dynamic file management
    addFileLink(category, fileKey, filePath, description) {
        if (!this.fileLinks[category]) {
            this.fileLinks[category] = {};
        }
        this.fileLinks[category][fileKey] = {
            file: filePath,
            description: description
        };
        console.log(`Added file link: ${category}.${fileKey}`);
    }

    updateFileLink(category, fileKey, filePath, description) {
        if (this.fileLinks[category]?.[fileKey]) {
            this.fileLinks[category][fileKey] = {
                file: filePath,
                description: description || this.fileLinks[category][fileKey].description
            };
            console.log(`Updated file link: ${category}.${fileKey}`);
        }
    }

    removeFileLink(category, fileKey) {
        if (this.fileLinks[category]?.[fileKey]) {
            delete this.fileLinks[category][fileKey];
            console.log(`Removed file link: ${category}.${fileKey}`);
        }
    }

    // Get all file links
    getAllFileLinks() {
        return this.fileLinks;
    }

    // Debug method
    debugInfo() {
        console.log('Enhanced Portfolio Manager Debug Info:');
        console.log('Initialized:', this.isInitialized);
        console.log('Cursor elements:', this.cursor, this.cursorFollower);
        console.log('File links:', this.fileLinks);
        console.log('Mouse position:', { x: this.mouseX, y: this.mouseY });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the enhanced portfolio manager
    window.portfolioManager = new EnhancedPortfolioManager();
    
    // Add some additional interactive features
    setTimeout(() => {
        // Add typing effect to subtitle if needed
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.style.overflow = 'hidden';
            subtitle.style.borderRight = '2px solid #667eea';
            subtitle.style.whiteSpace = 'nowrap';
            subtitle.style.animation = 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite';
        }
        
        // Add hover sound effects (optional)
        const hoverElements = document.querySelectorAll('.hover-glow');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                // Add subtle sound effect here if desired
                element.style.filter = 'brightness(1.05)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = 'brightness(1)';
            });
        });
    }, 1000);
});

// Add typing animation styles
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
    }
    
    @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: #667eea; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(typingStyles);

// Export for external use
window.EnhancedPortfolioManager = EnhancedPortfolioManager;
