// File Link Manager for Portfolio
class PortfolioFileManager {
    constructor() {
        this.fileLinks = {};
        this.init();
    }

    // Configure your file links here
    initializeFileLinks() {
        this.fileLinks = {
            // Research Projects
            'research-projects': {
                'quantum-wave-function': {
                    file: 'files/quantum-research.pdf',
                    description: 'Quantum Wave Function Research Paper'
                },
                'particle-interaction': {
                    file: 'files/particle-interaction-study.pdf',
                    description: 'Particle Interaction Analysis'
                },
                'negf-formalism': {
                    file: 'files/negf-transport-study.pdf',
                    description: 'NEGF Electron Transport Research'
                }
            },
            
            // Academic Achievements
            'achievements': {
                'jee-advanced': {
                    file: 'files/jee-advanced-scorecard.pdf',
                    description: 'JEE Advanced Score Card'
                },
                'jee-mains': {
                    file: 'files/jee-mains-scorecard.pdf',
                    description: 'JEE Mains Score Card'
                },
                'nest-2022': {
                    file: 'files/nest-certificate.pdf',
                    description: 'NEST 2022 Certificate'
                }
            },
            
            // Skills and Projects
            'skills': {
                'physics-informed-ai': {
                    file: 'files/physics-ai-project.pdf',
                    description: 'Physics-Informed Neural Networks Project'
                },
                'computational-astrophysics': {
                    file: 'files/astrophysics-analysis.pdf',
                    description: 'Computational Astrophysics Work'
                },
                'condensed-matter': {
                    file: 'files/condensed-matter-research.pdf',
                    description: 'Condensed Matter Physics Research'
                }
            },
            
            // Academic Documents
            'academic': {
                'transcript': {
                    file: 'files/iit-bombay-transcript.pdf',
                    description: 'IIT Bombay Academic Transcript'
                },
                'cv': {
                    file: 'files/soumik-sahoo-cv.pdf',
                    description: 'Complete Academic CV'
                },
                'portfolio': {
                    file: 'files/research-portfolio.pdf',
                    description: 'Research Portfolio'
                }
            }
        };
    }

    // Initialize the file link system
    init() {
        this.initializeFileLinks();
        this.attachEventListeners();
        this.addVisualIndicators();
    }

    // Attach click event listeners to elements
    attachEventListeners() {
        // Research project elements
        this.addClickHandler('.quantum-wave', 'research-projects', 'quantum-wave-function');
        this.addClickHandler('.particle-interaction', 'research-projects', 'particle-interaction');
        
        // Achievement cards
        this.addClickHandler('[data-achievement="jee-advanced"]', 'achievements', 'jee-advanced');
        this.addClickHandler('[data-achievement="jee-mains"]', 'achievements', 'jee-mains');
        this.addClickHandler('[data-achievement="nest"]', 'achievements', 'nest-2022');
        
        // Skills sections
        this.addClickHandler('[data-skill="physics-ai"]', 'skills', 'physics-informed-ai');
        this.addClickHandler('[data-skill="astrophysics"]', 'skills', 'computational-astrophysics');
        this.addClickHandler('[data-skill="condensed-matter"]', 'skills', 'condensed-matter');
        
        // Academic documents
        this.addClickHandler('.academic-transcript', 'academic', 'transcript');
        this.addClickHandler('.download-cv', 'academic', 'cv');
        this.addClickHandler('.research-portfolio', 'academic', 'portfolio');

        // Generic clickable elements with data attributes
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-file-link]');
            if (element) {
                const linkData = element.getAttribute('data-file-link').split('.');
                if (linkData.length === 2) {
                    this.openFile(linkData[0], linkData[1]);
                }
            }
        });
    }

    // Add click handler for specific elements
    addClickHandler(selector, category, fileKey) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.openFile(category, fileKey);
            });
            
            // Add cursor pointer style
            element.style.cursor = 'pointer';
        });
    }

    // Add visual indicators for clickable elements
    addVisualIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .file-link-indicator {
                position: relative;
                transition: transform 0.2s ease;
            }
            
            .file-link-indicator:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .file-link-indicator::after {
                content: '📄';
                position: absolute;
                top: -5px;
                right: -5px;
                font-size: 0.8em;
                opacity: 0.7;
                pointer-events: none;
            }
            
            .file-link-indicator:hover::after {
                opacity: 1;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);

        // Add indicators to clickable elements
        Object.keys(this.fileLinks).forEach(category => {
            Object.keys(this.fileLinks[category]).forEach(fileKey => {
                const selector = `[data-file-link="${category}.${fileKey}"]`;
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.classList.add('file-link-indicator'));
            });
        });
    }

    // Open file function
    openFile(category, fileKey) {
        const fileData = this.fileLinks[category]?.[fileKey];
        
        if (!fileData) {
            console.warn(`File link not found for ${category}.${fileKey}`);
            alert('File not available yet. Please check back later.');
            return;
        }

        // Check if file exists (optional)
        this.checkFileExists(fileData.file)
            .then(exists => {
                if (exists) {
                    // Open file in new tab
                    window.open(fileData.file, '_blank');
                } else {
                    // Show user-friendly message
                    this.showFileNotAvailable(fileData.description);
                }
            })
            .catch(() => {
                // If check fails, try to open anyway
                window.open(fileData.file, '_blank');
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

    // Show file not available message
    showFileNotAvailable(description) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.7); z-index: 1000;
                display: flex; align-items: center; justify-content: center;
            ">
                <div style="
                    background: white; padding: 2rem; border-radius: 8px;
                    max-width: 400px; text-align: center;
                ">
                    <h3>📄 ${description}</h3>
                    <p>This file is currently being prepared and will be available soon.</p>
                    <button onclick="this.closest('div').remove()" style="
                        background: #007bff; color: white; border: none;
                        padding: 10px 20px; border-radius: 4px; cursor: pointer;
                    ">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Method to add new file links dynamically
    addFileLink(category, fileKey, filePath, description) {
        if (!this.fileLinks[category]) {
            this.fileLinks[category] = {};
        }
        this.fileLinks[category][fileKey] = {
            file: filePath,
            description: description
        };
    }

    // Method to update existing file links
    updateFileLink(category, fileKey, filePath, description) {
        if (this.fileLinks[category]?.[fileKey]) {
            this.fileLinks[category][fileKey] = {
                file: filePath,
                description: description || this.fileLinks[category][fileKey].description
            };
        }
    }
}

// Initialize the file manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioFileManager = new PortfolioFileManager();
});

// Add data attributes to your HTML elements like this:
/*
Example HTML modifications you should make:

<div class="research-project" data-file-link="research-projects.quantum-wave-function">
    <h3>Quantum Wave Function</h3>
    <p>Research details...</p>
</div>

<div class="achievement-card" data-file-link="achievements.jee-advanced">
    <h4>JEE Advanced 2023</h4>
    <p>Achievement details...</p>
</div>

<button data-file-link="academic.cv">Download CV</button>
<button data-file-link="academic.transcript">View Transcript</button>
*/
