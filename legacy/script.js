// === CONFIGURATION ===
const CONFIG = {
    particles: { enabled: true, count: 50 },
    cursor: { enabled: true },
    animations: { enabled: true },
    themes: {
        cyan: { primary: '#00d4ff', secondary: '#7c3aed', tertiary: '#f59e0b' },
        purple: { primary: '#7c3aed', secondary: '#00d4ff', tertiary: '#f59e0b' },
        amber: { primary: '#f59e0b', secondary: '#00d4ff', tertiary: '#7c3aed' }
    }
};

// === PROJECT DATA EXAMPLE ===
const PROJECT_DATA = [
    {
        title: "Quantum Simulation Engine",
        description: "A GPU-accelerated simulation of quantum systems.",
        image: "assets/quantum-sim.png",
        tags: ["Quantum", "GPU", "C++"],
        pdfUrl: "assets/quantum-sim.pdf",
        projectUrl: "https://github.com/example/quantum-sim",
        liveDemo: null
    },
    {
        title: "AI-Assisted Physics Solver",
        description: "Uses ML to solve complex PDEs in physics.",
        image: "assets/ai-physics.png",
        tags: ["Machine Learning", "Physics"],
        pdfUrl: null,
        projectUrl: "https://github.com/example/ai-physics",
        liveDemo: "https://example.com/ai-physics"
    }
];

// === MAIN APPLICATION CLASS ===
class QuantumWebsite {
    constructor() {
        this.particles = [];
        this.cursor = { x: 0, y: 0 };
        this.cursorTrails = [];
        this.skillNodes = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.lastMouseMove = 0;
        this.currentTheme = 'cyan';
        this.currentMode = 'dark';

        this.init();
    }

    init() {
        this.initPreloader();
        this.initEnhancedCursor();
        this.initParticles();
        this.initNavigation();
        this.initTyped();
        this.initProjects();
        this.initSkills();
        this.initPhysicsLab();
        this.initModals();
        this.initSettings();
        this.initThemeToggle();
        this.initPerformanceToggles();
        this.initRevealAnimations();
        this.initContactForm();
    }

    initPreloader() {
        const preloader = document.getElementById('preloader');
        const loadingBar = document.getElementById('loading-bar');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            loadingBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                preloader.style.opacity = 0;
                setTimeout(() => preloader.style.display = 'none', 500);
            }
        }, 50);
    }

    initEnhancedCursor() {
        if (!CONFIG.cursor.enabled) return;
        const cursor = document.getElementById('cursor');
        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.display = 'none');
            el.addEventListener('mouseleave', () => cursor.style.display = 'block');
        });
    }

    initParticles() {
        if (!CONFIG.particles.enabled) return;
        const bg = document.getElementById('quantum-bg');
        for (let i = 0; i < CONFIG.particles.count; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.top = `${Math.random() * 100}%`;
            p.style.left = `${Math.random() * 100}%`;
            bg.appendChild(p);
        }
    }

    initNavigation() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    initTyped() {
        if (typeof Typed !== 'undefined') {
            new Typed('#typed-subtitle', {
                strings: [
                    'Physics & AI Researcher',
                    'Quantum Explorer',
                    'Computational Physicist'
                ],
                typeSpeed: 50,
                backSpeed: 25,
                loop: true
            });
        }
    }

    initProjects() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        PROJECT_DATA.forEach(project => {
            const card = document.createElement('div');
            card.className = 'glass-card project-card p-6 reveal';
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="rounded-lg mb-4">
                <h3 class="text-xl font-bold text-cyan-400 mb-2">${project.title}</h3>
                <p class="text-gray-300 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.tags.map(tag => `<span class="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs">${tag}</span>`).join('')}
                </div>
                <div class="flex gap-2">
                    ${project.pdfUrl ? `<a href="${project.pdfUrl}" target="_blank" class="pdf-link"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                    ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank" class="pdf-link"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.liveDemo ? `<a href="${project.liveDemo}" target="_blank" class="pdf-link"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    initSkills() {}
    initPhysicsLab() {}

    initModals() {
        window.openModal = id => {
            document.getElementById(id).classList.add('show');
        };
        window.closeModal = id => {
            document.getElementById(id).classList.remove('show');
        };
    }

    initSettings() {}

    initThemeToggle() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTheme = btn.dataset.theme;
                const theme = CONFIG.themes[this.currentTheme];
                document.documentElement.style.setProperty('--accent-primary', theme.primary);
                document.documentElement.style.setProperty('--accent-secondary', theme.secondary);
                document.documentElement.style.setProperty('--accent-tertiary', theme.tertiary);
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    initPerformanceToggles() {
        document.querySelectorAll('.modern-switch').forEach(switchEl => {
            switchEl.addEventListener('click', () => {
                switchEl.classList.toggle('active');
            });
        });
    }

    initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));
    }

    initContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                alert('Message sent successfully!');
                form.reset();
            });
        }
    }

    resetSettings() {
        localStorage.removeItem('quantum-settings');
        localStorage.removeItem('preferred-theme');
        localStorage.removeItem('theme-mode');
        location.reload();
    }

    exportSettings() {
        const settings = {
            theme: this.currentTheme,
            mode: this.currentMode,
            particles: CONFIG.particles.enabled,
            cursor: CONFIG.cursor.enabled,
            animations: CONFIG.animations.enabled,
            timestamp: new Date().toISOString()
        };
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'quantum-settings.json');
        linkElement.click();
    }

    shareSettings() {
        const settingsUrl = `${window.location.href}?theme=${this.currentTheme}&mode=${this.currentMode}`;
        if (navigator.share) {
            navigator.share({
                title: 'My Quantum Portfolio Settings',
                text: 'Check out my personalized quantum portfolio settings!',
                url: settingsUrl
            });
        } else {
            navigator.clipboard.writeText(settingsUrl).then(() => {
                alert('Settings URL copied to clipboard!');
            });
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    takeScreenshot() {
        alert('Screenshot feature coming soon!');
    }
}

// === INIT APP ===
document.addEventListener('DOMContentLoaded', () => {
    window.quantumApp = new QuantumWebsite();
});

// === UTILITY ===
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
