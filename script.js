/* =============================================
   PORTFOLIO CYBERSÉCURITÉ - JAVASCRIPT AMÉLIORÉ
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
    console.log('Initialisation du portfolio...');
    
    // Masquer l'indicateur de chargement
    setTimeout(() => {
        hideLoadingIndicator();
    }, 1500);

    // Vérifier l'URL au chargement pour afficher la bonne section
    checkInitialURL();
    
    // Initialiser les animations des barres de progression
    initializeProgressBars();
    
    // Initialiser les effets de frappe
    initializeTypingEffect();
    
    // Initialiser les événements de scroll
    initializeScrollEvents();
    
    // Initialiser les animations au scroll
    initializeScrollAnimations();
    
    // Initialiser les interactions des cartes de projet
    initializeProjectInteractions();
    
    // Initialiser les tooltips
    initializeTooltips();
    
    // Ajouter les événements de clavier pour l'accessibilité
    initializeKeyboardNavigation();
    
    // Initialiser le menu mobile
    initializeMobileMenu();
    
    // Afficher la première section ou celle dans l'URL
    if (!window.location.hash) {
        showSection('about');
    }
}

/* =============================================
   GESTION DE LA NAVIGATION
   ============================================= */

function showSection(sectionId) {
    console.log(`Affichage de la section: ${sectionId}`);
    
    // Masquer toutes les sections avec animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Petit délai pour l'animation CSS
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 50);
        
        currentSection = sectionId;
        
        // Mettre à jour la navigation
        updateNavigation(sectionId);
        
        // Faire défiler vers le haut en douceur
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Déclencher les animations de la section
        setTimeout(() => {
            triggerSectionAnimations(targetSection);
        }, 100);
        
        // Fermer le menu mobile s'il est ouvert
        if (isMenuOpen) {
            toggleMobileMenu();
        }
        
        // Mettre à jour l'URL sans recharger
        updateURL(sectionId);
        
        // Animer les barres de progression si c'est la section compétences
        if (sectionId === 'skills') {
            setTimeout(animateProgressBars, 500);
        }
    } else {
        console.warn(`Section "${sectionId}" non trouvée`);
    }
}

function updateNavigation(activeSection) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === activeSection || btn.getAttribute('onclick')?.includes(activeSection)) {
            btn.classList.add('active');
        }
    });
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        // S'assurer qu'il n'y a qu'un seul event listener
        mobileMenuBtn.removeEventListener('click', toggleMobileMenu);
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    if (navMenu) {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active', isMenuOpen);
        
        // Changer l'icône du menu
        if (menuBtn) {
            menuBtn.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Animation du menu mobile
        if (isMenuOpen) {
            navMenu.style.maxHeight = '400px';
            navMenu.style.opacity = '1';
        } else {
            navMenu.style.maxHeight = '0';
            navMenu.style.opacity = '0';
        }
        
        // Empêcher le scroll quand le menu est ouvert sur mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        }
    }
}

/* =============================================
   GESTION DU SCROLL
   ============================================= */

function initializeScrollEvents() {
    let lastScrollTop = 0;
    const topNav = document.getElementById('topNav');
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navigation sticky avec effet de masquage amélioré
        if (topNav) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scroll vers le bas - masquer la navigation
                topNav.style.transform = 'translateY(-100%)';
                topNav.style.opacity = '0.95';
            } else {
                // Scroll vers le haut - afficher la navigation
                topNav.style.transform = 'translateY(0)';
                topNav.style.opacity = '1';
            }
        }
        
        // Bouton retour en haut avec animation améliorée
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.style.transform = 'scale(1) translateY(0)';
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.style.transform = 'scale(0.8) translateY(20px)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        scrollPosition = scrollTop;
        
        // Parallax effect pour le header
        updateParallaxEffect(scrollTop);
        
        // Animations au scroll
        checkScrollAnimations();
        
        // Mise à jour de la navigation en fonction de la section visible
        updateActiveNavOnScroll();
        
    }, 16)); // 60fps
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Animation du bouton pendant le scroll
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            backToTopBtn.style.transform = 'rotate(0deg)';
        }, 600);
    }
}

function updateParallaxEffect(scrollTop) {
    const headerBg = document.querySelector('.header-bg-effect');
    if (headerBg && scrollTop < window.innerHeight) {
        const speed = scrollTop * 0.3;
        const rotation = scrollTop * 0.005;
        headerBg.style.transform = `translate(-50%, -50%) translateY(${speed}px) rotate(${rotation}deg)`;
        headerBg.style.opacity = Math.max(0.3, 1 - (scrollTop / window.innerHeight));
    }
}

function updateActiveNavOnScroll() {
    // Cette fonction pourrait être étendue pour changer la navigation active
    // en fonction de la section visible à l'écran
    const sections = document.querySelectorAll('.section.active');
    if (sections.length > 0) {
        const rect = sections[0].getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            // La section est visible, maintenir la navigation
            updateNavigation(currentSection);
        }
    }
}

/* =============================================
   ANIMATIONS AU SCROLL
   ============================================= */

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animations spéciales pour certains éléments
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
                
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillCategory(entry.target);
                }
                
                // Animer les compteurs si présents
                animateCounters(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .highlight-item, .certification-item, .language-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function animateTimelineItem(item) {
    const marker = item.querySelector('.timeline-marker');
    if (marker) {
        setTimeout(() => {
            marker.style.transform = 'scale(1.2)';
            setTimeout(() => {
                marker.style.transform = 'scale(1)';
            }, 300);
        }, 200);
    }
}

function animateProjectCard(card) {
    const icon = card.querySelector('.project-icon');
    if (icon) {
        setTimeout(() => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 100);
    }
}

function animateSkillCategory(category) {
    const tags = category.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'scale(1.05)';
            tag.style.borderColor = 'var(--cyber-blue)';
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
                tag.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }, 200);
        }, index * 50);
    });
}

function checkScrollAnimations() {
    const elements = document.querySelectorAll('.timeline-item:not(.animate-in), .project-card:not(.animate-in), .highlight-item:not(.animate-in)');
    const triggerBottom = window.innerHeight * 0.8;
    
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
        bar.style.transition = 'none';
    });
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.dataset.level;
        if (targetWidth) {
            setTimeout(() => {
                bar.style.transition = 'width 2s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = targetWidth + '%';
                
                // Effet de brillance
                setTimeout(() => {
                    bar.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.6)';
                    setTimeout(() => {
                        bar.style.boxShadow = 'none';
                    }, 500);
                }, 1800);
            }, index * 300);
        }
    });
}

/* =============================================
   EFFET DE FRAPPE
   ============================================= */

function initializeTypingEffect() {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        const originalText = text;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--cyber-blue)';
        subtitle.style.minHeight = '1.5em';
        
        let index = 0;
        const typeSpeed = 80;
        
        function typeWriter() {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
                
                // Effet de scintillement occasionnel
                if (Math.random() < 0.1) {
                    subtitle.style.color = 'var(--cyber-green)';
                    setTimeout(() => {
                        subtitle.style.color = 'var(--text-secondary)';
                    }, 100);
                }
                
                setTimeout(typeWriter, typeSpeed + Math.random() * 40);
            } else {
                // Effet de clignotement du curseur
                let blinkCount = 0;
                const blinkInterval = setInterval(() => {
                    subtitle.style.borderRight = subtitle.style.borderRight === '2px solid transparent' 
                        ? '2px solid var(--cyber-blue)' 
                        : '2px solid transparent';
                    blinkCount++;
                    if (blinkCount > 8) {
                        clearInterval(blinkInterval);
                        subtitle.style.borderRight = 'none';
                    }
                }, 400);
            }
        }
        
        setTimeout(typeWriter, 2500);
    }
}

/* =============================================
   ANIMATIONS DES SECTIONS
   ============================================= */

function triggerSectionAnimations(section) {
    const animatedElements = section.querySelectorAll('.timeline-item, .project-card, .skill-category, .highlight-item, .certification-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'none';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Effet de brillance sur certains éléments
            if (element.classList.contains('project-card') || element.classList.contains('highlight-item')) {
                setTimeout(() => {
                    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                    setTimeout(() => {
                        element.style.boxShadow = '';
                    }, 800);
                }, 600);
            }
        }, index * 150 + 200);
    });
}

/* =============================================
   GESTION DES PROJETS
   ============================================= */

function initializeProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Effet 3D amélioré au survol
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
            
            // Animation de l'icône du projet
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Effet 3D basé sur la position de la souris
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) { // Seulement sur desktop
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            }
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
        if (isNaN(target)) return;
        
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
                
                // Effet de brillance à la fin
                counter.style.color = 'var(--cyber-green)';
                setTimeout(() => {
                    counter.style.color = '';
                }, 500);
            }
        };
        
        updateCounter();
    });
}

/* =============================================
   GESTION DU CV
   ============================================= */

function downloadCV() {
    // Animation du bouton
    const downloadBtns = document.querySelectorAll('[onclick="downloadCV()"]');
    downloadBtns.forEach(btn => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Notification avec délai réaliste
    showNotification('Préparation du téléchargement...', 'info');
    
    setTimeout(() => {
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = 'https://github.com/Ahmad-Abdoul-Lattif/Mon-CV/raw/master/CV_Ahmad_Sawadogo.pdf';
        link.download = 'Ahmad_Abdoul_Latif_SAWADOGO_CV.pdf';
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('CV téléchargé avec succès!', 'success');
    }, 1000);
}

/* =============================================
   SYSTÈME DE NOTIFICATIONS
   ============================================= */

function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    });
    
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
    
    // Styles dynamiques
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid ${colors[type] || colors.info};
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        font-family: var(--font-primary);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 4 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

/* =============================================
   GESTION DE L'INDICATEUR DE CHARGEMENT
   ============================================= */

function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        loadingIndicator.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 500);
    }
}

/* =============================================
   TOOLTIPS
   ============================================= */

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]:not([data-tooltip-initialized])');
    
    tooltipElements.forEach(element => {
        // Convertir le titre en tooltip personnalisé
        const title = element.getAttribute('title');
        if (title) {
            element.setAttribute('data-tooltip', title);
            element.removeAttribute('title');
            element.setAttribute('data-tooltip-initialized', 'true');
            
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        }
    });
}

function showTooltip(event) {
    const tooltipText = event.target.dataset.tooltip;
    if (!tooltipText) return;
    
    // Supprimer les tooltips existants
    document.querySelectorAll('.custom-tooltip').forEach(t => t.remove());
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = tooltipText;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(5px);
        animation: tooltipFadeIn 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    // Positionner le tooltip de manière intelligente
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;
    
    // Ajustements pour éviter de sortir de l'écran
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    
    event.target.tooltipElement = tooltip;
}

function hideTooltip(event) {
    if (event.target.tooltipElement) {
        event.target.tooltipElement.style.animation = 'tooltipFadeOut 0.2s ease';
        setTimeout(() => {
            if (event.target.tooltipElement) {
                event.target.tooltipElement.remove();
                event.target.tooltipElement = null;
            }
        }, 200);
    }
}

/* =============================================
   NAVIGATION CLAVIER POUR L'ACCESSIBILITÉ
   ============================================= */

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Navigation avec les flèches (Alt + flèches)
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
        
        // Raccourcis numériques (1-6 pour les sections)
        if (event.ctrlKey && event.key >= '1' && event.key <= '6') {
            event.preventDefault();
            const sections = ['about', 'education', 'experience', 'projects', 'skills', 'certifications'];
            const sectionIndex = parseInt(event.key) - 1;
            if (sections[sectionIndex]) {
                showSection(sections[sectionIndex]);
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

function checkInitialURL() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        currentSection = hash;
        return hash;
    }
    return 'about';
}

// Gérer la navigation par l'URL
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    } else {
        showSection('about');
    }
});

/* =============================================
   EFFETS VISUELS AVANCÉS
   ============================================= */

function initializeAdvancedEffects() {
    // Effet de glitch sur le titre principal
    initializeGlitchEffect();
    
    // Initialiser les effets de particules cyber
    if (window.innerWidth > 768) { // Seulement sur desktop pour les performances
        createCyberParticles();
    }
    
    // Observer les changements de thème système
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(handleThemeChange);
    }
}

function initializeGlitchEffect() {
    const title = document.getElementById('mainTitle');
    if (!title) return;
    
    const originalText = title.textContent;
    
    setInterval(() => {
        if (Math.random() < 0.05) { // 5% de chance
            // Effet de glitch textuel
            const glitchChars = '!@#$%^&*()[]{}|;:,.<>?';
            let glitchedText = '';
            
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            title.textContent = glitchedText;
            title.style.textShadow = `
                2px 0 #ff0000,
                -2px 0 #00ffff,
                0 0 10px var(--cyber-green)
            `;
            
            setTimeout(() => {
                title.textContent = originalText;
                title.style.textShadow = '';
            }, 100);
        }
    }, 3000);
}

function createCyberParticles() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cyber-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.5 ? 'var(--cyber-blue)' : 'var(--cyber-green)'};
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: float ${Math.random() * 15 + 10}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            border-radius: 50%;
            box-shadow: 0 0 ${Math.random() * 10 + 5}px currentColor;
            pointer-events: none;
        `;
        
        header.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentElement) {
                particle.remove();
            }
        }, (Math.random() * 15 + 10) * 1000);
    }
    
    // Recréer les particules périodiquement
    setTimeout(createCyberParticles, 20000);
}

function handleThemeChange(mediaQuery) {
    // Gérer les changements de thème système si nécessaire
    if (mediaQuery.matches) {
        console.log('Thème sombre détecté');
    } else {
        console.log('Thème clair détecté');
    }
}

/* =============================================
   OPTIMISATION DES PERFORMANCES
   ============================================= */

// Throttle function pour optimiser les événements de scroll
function throttle(func, wait) {
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

// Debounce function pour optimiser le redimensionnement
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* =============================================
   GESTION DES ÉVÉNEMENTS DE RESIZE
   ============================================= */

function handleResize() {
    // Recalculer les animations si nécessaire
    if (isMenuOpen && window.innerWidth > 768) {
        toggleMobileMenu();
    }
    
    // Réinitialiser les effets de parallax
    updateParallaxEffect(scrollPosition);
    
    // Réajuster les tooltips
    document.querySelectorAll('.custom-tooltip').forEach(tooltip => tooltip.remove());
}

// Optimiser les événements de resize
window.addEventListener('resize', debounce(handleResize, 250));

/* =============================================
   INTERACTION AVEC LES LIENS SOCIAUX
   ============================================= */

function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Animation au clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Tracking ou analytics ici si nécessaire
            console.log(`Clic sur le lien social: ${this.href}`);
        });
    });
}

/* =============================================
   GESTION DES FORMULAIRES DE CONTACT
   ============================================= */

function initializeContactForms() {
    const contactLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            showNotification('Ouverture du client de messagerie...', 'info');
        });
    });
    
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            showNotification('Numéro de téléphone copié', 'success');
        });
    });
}

/* =============================================
   ANIMATIONS PERSONNALISÉES POUR LES CERTIFICATIONS
   ============================================= */

function initializeCertificationAnimations() {
    const certItems = document.querySelectorAll('.certification-item');
    
    certItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.cert-badge');
            const icon = this.querySelector('.cert-icon');
            
            if (badge) {
                badge.style.animation = 'bounce 0.6s ease';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.cert-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

/* =============================================
   SYSTÈME D'EASTER EGGS
   ============================================= */

function initializeEasterEggs() {
    let konami = [];
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konami.push(e.keyCode);
        if (konami.length > konamiCode.length) {
            konami.shift();
        }
        
        if (konami.length === konamiCode.length) {
            if (konami.every((key, index) => key === konamiCode[index])) {
                activateEasterEgg();
                konami = [];
            }
        }
    });
}

function activateEasterEgg() {
    // Effet visuel spécial
    document.body.style.animation = 'matrix 2s ease-in-out';
    showNotification('🎉 Code Konami activé! Mode Hacker ON', 'success');
    
    // Ajouter temporairement un effet matrix
    const matrixEffect = document.createElement('div');
    matrixEffect.innerHTML = '01010101'.repeat(100);
    matrixEffect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: var(--cyber-green);
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        pointer-events: none;
        animation: matrixRain 3s linear;
        opacity: 0.3;
    `;
    
    document.body.appendChild(matrixEffect);
    
    setTimeout(() => {
        matrixEffect.remove();
        document.body.style.animation = '';
    }, 3000);
}

/* =============================================
   ANALYTICS ET TRACKING
   ============================================= */

function trackUserInteraction(action, element) {
    // Système de tracking simple (peut être étendu avec Google Analytics)
    const data = {
        action: action,
        element: element,
        timestamp: new Date().toISOString(),
        section: currentSection,
        userAgent: navigator.userAgent
    };
    
    console.log('User Interaction:', data);
    
    // Ici vous pouvez envoyer les données à votre service d'analytics
    // gtag('event', action, { ... }) pour Google Analytics par exemple
}

/* =============================================
   INITIALISATION FINALE ET OPTIMISATIONS
   ============================================= */

// Initialiser les effets avancés après le chargement complet
window.addEventListener('load', function() {
    initializeAdvancedEffects();
    initializeSocialLinks();
    initializeContactForms();
    initializeCertificationAnimations();
    initializeEasterEggs();
    
    // Précharger les ressources importantes
    preloadCriticalResources();
    
    // Initialiser les tooltips après le chargement complet
    setTimeout(initializeTooltips, 100);
    
    console.log('Portfolio entièrement initialisé et optimisé!');
});

function preloadCriticalResources() {
    // Précharger le CV
    const cvLink = document.createElement('link');
    cvLink.rel = 'prefetch';
    cvLink.href = 'https://github.com/Ahmad-Abdoul-Lattif/Mon-CV/raw/master/CV_Ahmad_Sawadogo.pdf';
    document.head.appendChild(cvLink);
    
    // Précharger les images importantes
    const profileImg = document.querySelector('.profile-img img');
    if (profileImg && profileImg.src) {
        const preloadImg = document.createElement('link');
        preloadImg.rel = 'preload';
        preloadImg.as = 'image';
        preloadImg.href = profileImg.src;
        document.head.appendChild(preloadImg);
    }
}

/* =============================================
   STYLES CSS DYNAMIQUES ÉTENDUS
   ============================================= */

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Animations personnalisées */
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
    
    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes tooltipFadeOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
        }
    }
    
    @keyframes float {
        0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.7;
        }
        33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
            opacity: 1;
        }
        66% {
            transform: translateY(-10px) translateX(-5px) rotate(240deg);
            opacity: 0.8;
        }
        100% {
            transform: translateY(0px) translateX(0px) rotate(360deg);
            opacity: 0.7;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    @keyframes matrix {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg) saturate(2); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes matrixRain {
        0% {
            transform: translateY(-100%);
            opacity: 0.3;
        }
        100% {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
    
    /* Amélioration des performances */
    .section {
        will-change: transform, opacity;
    }
    
    .project-card, .skill-category, .certification-item {
        will-change: transform;
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }
    
    .progress-fill {
        will-change: width;
    }
    
    /* Scrollbar personnalisée améliorée */
    ::-webkit-scrollbar {
        width: 12px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--bg-secondary);
        border-radius: 6px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, var(--cyber-blue), var(--cyber-purple));
        border-radius: 6px;
        border: 2px solid var(--bg-secondary);
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, var(--cyber-green), var(--cyber-blue));
    }
    
    /* Focus amélioré pour l'accessibilité */
    .nav-btn:focus,
    .cta-button:focus,
    .cert-link:focus {
        outline: 2px solid var(--cyber-blue);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    }
    
    /* Navigation mobile améliorée */
    @media (max-width: 768px) {
        .nav-menu {
            transition: all 0.3s ease;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
        }
        
        .nav-menu.active {
            max-height: 400px;
            opacity: 1;
        }
        
        .top-navigation {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
    }
    
    /* Effets de hover personnalisés */
    .highlight-item:hover {
        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
    }
    
    .timeline-item:hover .timeline-marker {
        transform: scale(1.2);
        box-shadow: 0 0 20px currentColor;
    }
`;

document.head.appendChild(dynamicStyles);

/* =============================================
   EXPORT DES FONCTIONS GLOBALES
   ============================================= */

// Rendre les fonctions principales accessibles globalement pour les événements onclick
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.downloadCV = downloadCV;

// Debug et développement
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.portfolioDebug = {
        currentSection: () => currentSection,
        isMenuOpen: () => isMenuOpen,
        scrollPosition: () => scrollPosition,
        showSection,
        triggerSectionAnimations,
        animateProgressBars,
        trackUserInteraction
    };
    console.log('Mode développement activé. Utilisez window.portfolioDebug pour déboguer.');
}