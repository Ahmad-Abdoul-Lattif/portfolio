/* =============================================
   PORTFOLIO CYBERSÉCURITÉ - JAVASCRIPT
   Ahmad Abdoul Latif SAWADOGO
   ============================================= */

// Variables globales
let currentSection = 'about';
let isMenuOpen = false;
let scrollPosition = 0;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

/* =============================================
   INITIALISATION DU PORTFOLIO
   ============================================= */

function initializePortfolio() {
    // Masquer l'indicateur de chargement
    setTimeout(() => {
        hideLoadingIndicator();
    }, 1500);

    // Initialiser les animations des barres de progression
    initializeProgressBars();
    
    // Initialiser les effets de frappe
    initializeTypingEffect();
    
    // Initialiser les événements de scroll
    initializeScrollEvents();
    
    // Initialiser les animations au scroll
    initializeScrollAnimations();
    
    // Afficher la première section
    showSection('about');
    
    // Initialiser les tooltips
    initializeTooltips();
    
    // Ajouter les événements de clavier pour l'accessibilité
    initializeKeyboardNavigation();
}

/* =============================================
   GESTION DE LA NAVIGATION
   ============================================= */

function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Mettre à jour la navigation
        updateNavigation(sectionId);
        
        // Faire défiler vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Déclencher les animations de la section
        triggerSectionAnimations(targetSection);
        
        // Fermer le menu mobile s'il est ouvert
        if (isMenuOpen) {
            toggleMobileMenu();
        }
        
        // Mettre à jour l'URL sans recharger
        updateURL(sectionId);
    }
}

function updateNavigation(activeSection) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === activeSection) {
            btn.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    if (navMenu) {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active', isMenuOpen);
        
        // Changer l'icône du menu
        if (menuBtn) {
            menuBtn.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Empêcher le scroll quand le menu est ouvert
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
}

/* =============================================
   GESTION DU SCROLL
   ============================================= */

function initializeScrollEvents() {
    let lastScrollTop = 0;
    const header = document.querySelector('.navigation');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navigation sticky avec effet de masquage
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scroll vers le bas - masquer la navigation
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scroll vers le haut - afficher la navigation
                header.style.transform = 'translateY(0)';
            }
        }
        
        // Bouton retour en haut
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        scrollPosition = scrollTop;
        
        // Parallax effect pour le header
        updateParallaxEffect(scrollTop);
        
        // Animations au scroll
        checkScrollAnimations();
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function updateParallaxEffect(scrollTop) {
    const headerBg = document.querySelector('.header-bg-effect');
    if (headerBg) {
        const speed = scrollTop * 0.5;
        headerBg.style.transform = `translateY(${speed}px) rotate(${scrollTop * 0.01}deg)`;
    }
}

/* =============================================
   ANIMATIONS AU SCROLL
   ============================================= */

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animer les barres de progression si c'est la section compétences
                if (entry.target.id === 'skills') {
                    animateProgressBars();
                }
                
                // Animer les compteurs si présents
                animateCounters(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .highlight-item, .certification-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function checkScrollAnimations() {
    const elements = document.querySelectorAll('.timeline-item, .project-card, .highlight-item');
    const triggerBottom = window.innerHeight / 5 * 4;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.classList.add('animate-in');
        }
    });
}

/* =============================================
   BARRES DE PROGRESSION
   ============================================= */

function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.dataset.level + '%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

/* =============================================
   EFFET DE FRAPPE
   ============================================= */

function initializeTypingEffect() {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--primary-color)';
        
        let index = 0;
        const typeSpeed = 50;
        
        function typeWriter() {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Effet de clignotement du curseur
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        setTimeout(typeWriter, 2000);
    }
}

/* =============================================
   ANIMATIONS DES SECTIONS
   ============================================= */

function triggerSectionAnimations(section) {
    const animatedElements = section.querySelectorAll('.timeline-item, .project-card, .skill-category, .highlight-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animer les barres de progression si c'est la section compétences
    if (section.id === 'skills') {
        setTimeout(animateProgressBars, 500);
    }
}

/* =============================================
   GESTION DES PROJETS
   ============================================= */

function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

/* =============================================
   ANIMATIONS DES COMPTEURS
   ============================================= */

function animateCounters(container) {
    const counters = container.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

/* =============================================
   GESTION DU CV
   ============================================= */

function downloadCV() {
    // Créer un lien de téléchargement fictif
    const link = document.createElement('a');
    link.href = 'https://github.com/Ahmad-Abdoul-Lattif/Mon-CV/blob/master/CV_Ahmad_Sawadogo.pdf'; // Remplacez par l'URL réelle de votre CV
    link.download = 'Ahmad_Abdoul_Latif_SAWADOGO_CV.pdf';
    
    // Afficher une notification
    showNotification('Le téléchargement du CV va commencer...', 'info');
    
    // Simuler le téléchargement
    setTimeout(() => {
        showNotification('CV téléchargé avec succès!', 'success');
    }, 1500);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* =============================================
   SYSTÈME DE NOTIFICATIONS
   ============================================= */

function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Ajouter les styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'}-color);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

/* =============================================
   GESTION DE L'INDICATEUR DE CHARGEMENT
   ============================================= */

function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 500);
    }
}

/* =============================================
   TOOLTIPS
   ============================================= */

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltipText = event.target.dataset.tooltip;
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(tooltip);
    
    // Positionner le tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    event.target.tooltipElement = tooltip;
}

function hideTooltip(event) {
    if (event.target.tooltipElement) {
        event.target.tooltipElement.remove();
        event.target.tooltipElement = null;
    }
}

/* =============================================
   NAVIGATION CLAVIER POUR L'ACCESSIBILITÉ
   ============================================= */

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Navigation avec les flèches
        if (event.altKey) {
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    navigateToPreviousSection();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    navigateToNextSection();
                    break;
                case 'Home':
                    event.preventDefault();
                    showSection('about');
                    break;
            }
        }
        
        // Échapper pour fermer le menu mobile
        if (event.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });
}

function navigateToPreviousSection() {
    const sections = ['about', 'education', 'experience', 'projects', 'skills', 'certifications'];
    const currentIndex = sections.indexOf(currentSection);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    showSection(sections[previousIndex]);
}

function navigateToNextSection() {
    const sections = ['about', 'education', 'experience', 'projects', 'skills', 'certifications'];
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
    showSection(sections[nextIndex]);
}

/* =============================================
   GESTION DE L'URL
   ============================================= */

function updateURL(section) {
    if (history.pushState) {
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#' + section;
        history.pushState({path: newUrl}, '', newUrl);
    }
}

// Gérer la navigation par l'URL
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }
});

// Vérifier l'URL au chargement
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }
});

/* =============================================
   EFFETS VISUELS AVANCÉS
   ============================================= */

function initializeAdvancedEffects() {
    // Effet de particules cyber (optionnel)
    createCyberParticles();
    
    // Effet de glitch sur le titre principal
    initializeGlitchEffect();
}

function createCyberParticles() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'cyber-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--cyber-blue);
            opacity: 0.7;
            animation: float ${Math.random() * 10 + 5}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        header.appendChild(particle);
    }
}

function initializeGlitchEffect() {
    const title = document.getElementById('mainTitle');
    if (!title) return;
    
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de chance
            title.style.textShadow = `
                2px 0 var(--cyber-red),
                -2px 0 var(--cyber-blue),
                0 0 10px var(--cyber-green)
            `;
            setTimeout(() => {
                title.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
            }, 100);
        }
    }, 3000);
}

/* =============================================
   INTERACTIONS AVEC LES CARTES DE PROJET
   ============================================= */

function initializeProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Effet 3D au survol
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

/* =============================================
   OPTIMISATION DES PERFORMANCES
   ============================================= */

// Throttle function pour optimiser les événements de scroll
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function pour optimiser le redimensionnement
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimiser les événements de resize
window.addEventListener('resize', debounce(function() {
    // Recalculer les animations si nécessaire
    if (isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Réinitialiser les effets de parallax
    updateParallaxEffect(scrollPosition);
}, 250));

/* =============================================
   INITIALISATION FINALE
   ============================================= */

// Initialiser les effets avancés après le chargement complet
window.addEventListener('load', function() {
    initializeAdvancedEffects();
    initializeProjectInteractions();
    initializeProjectCards();
});

/* =============================================
   STYLES CSS DYNAMIQUES
   ============================================= */

// Ajouter les styles pour les animations personnalisées
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
        }
        100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out;
    }
    
    .cyber-particle {
        pointer-events: none;
        border-radius: 50%;
        box-shadow: 0 0 4px currentColor;
    }
    
    .notification {
        backdrop-filter: blur(10px);
    }
    
    .navigation {
        transition: transform 0.3s ease;
    }
    
    .custom-tooltip {
        animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(style);

/* =============================================
   EXPORT DES FONCTIONS GLOBALES
   ============================================= */

// Rendre les fonctions principales accessibles globalement
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.downloadCV = downloadCV;