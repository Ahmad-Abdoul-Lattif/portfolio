/* ═══════════════════════════════════════════════
   AHMAD A.L. SAWADOGO — PORTFOLIO JS
   ═══════════════════════════════════════════════ */

'use strict';

// ── SECTION NAVIGATION ──
const sections = ['about','education','experience','projects','skills','certifications'];
let current = 'about';

function go(id) {
  if (!document.getElementById(id)) return;

  // Hide all
  document.querySelectorAll('.sec').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  // Show target
  const target = document.getElementById(id);
  target.style.display = 'block';
  requestAnimationFrame(() => target.classList.add('active'));

  // Update nav
  document.querySelectorAll('.nl').forEach(b => {
    b.classList.toggle('active', b.dataset.s === id);
  });

  current = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#' + id);

  // Close mobile menu if open
  closeMobileMenu();
}

// ── INIT SECTIONS ──
function initSections() {
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const hash = window.location.hash.slice(1);
  go(sections.includes(hash) ? hash : 'about');
}

// ── NAV BUTTONS ──
document.querySelectorAll('.nl').forEach(btn => {
  btn.addEventListener('click', () => go(btn.dataset.s));
});

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on outside click
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    closeMobileMenu();
  }
});

// ── SCROLL EFFECTS ──
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Nav shadow on scroll
  nav.style.boxShadow = y > 10 ? '0 1px 30px rgba(0,0,0,0.4)' : 'none';

  // Back to top
  btt.classList.toggle('show', y > 400);

  lastScroll = y;
}, { passive: true });

// ── KEYBOARD NAV ──
document.addEventListener('keydown', e => {
  if (e.altKey) {
    const idx = sections.indexOf(current);
    if (e.key === 'ArrowRight' && idx < sections.length - 1) go(sections[idx + 1]);
    if (e.key === 'ArrowLeft'  && idx > 0)                   go(sections[idx - 1]);
  }
  if (e.key === 'Escape') closeMobileMenu();
});

// ── CV DOWNLOAD ──
function downloadCV() {
  showToast('Téléchargement en cours…', 'info');
  setTimeout(() => {
    const a = document.createElement('a');
    a.href = 'https://github.com/Ahmad-Abdoul-Lattif/Mon-CV/raw/master/CV_Ahmad_Sawadogo.pdf';
    a.download = 'CV_Ahmad_Abdoul_Latif_SAWADOGO.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('CV téléchargé avec succès !', 'success');
  }, 800);
}

// ── TOAST NOTIFICATION ──
function showToast(msg, type = 'info') {
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const colors = { success: '#34d399', info: '#4f8ef7', error: '#f87171' };
  const icons  = { success: 'check-circle', info: 'info-circle', error: 'exclamation-circle' };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${msg}`;
  toast.style.cssText = `
    position: fixed; bottom: 80px; right: 28px; z-index: 9999;
    background: #1a1d25; border: 1px solid ${colors[type]}44;
    border-left: 3px solid ${colors[type]};
    color: #f0f2f5; padding: 12px 18px; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    animation: toastIn 0.3s ease;
    max-width: 320px;
  `;
  toast.querySelector('i').style.color = colors[type];

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── INTERSECTION OBSERVER — fade in cards ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeCards() {
  document.querySelectorAll('.ah-card, .proj-card, .sk-card, .cert-card, .tl-body, .training-item, .oc-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
    observer.observe(el);
  });
}

// ── DYNAMIC STYLES ──
const dynStyle = document.createElement('style');
dynStyle.textContent = `
  @keyframes toastIn  { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
  @keyframes toastOut { from { opacity:1; transform: translateX(0); }    to { opacity:0; transform: translateX(20px); } }
`;
document.head.appendChild(dynStyle);

// ── POPSTATE ──
window.addEventListener('popstate', () => {
  const hash = window.location.hash.slice(1);
  if (sections.includes(hash)) go(hash);
});

// ── FOOTER NAV ──
document.querySelectorAll('.footer-nav button').forEach(btn => {
  btn.addEventListener('click', () => go(btn.textContent.trim().toLowerCase()
    .replace('à propos','about')
    .replace('formation','education')
    .replace('expérience','experience')
    .replace('projets','projects')
    .replace('compétences','skills')
    .replace('certifications','certifications')
  ));
});

// ── BOOT ──
document.addEventListener('DOMContentLoaded', () => {
  initSections();
  setTimeout(observeCards, 200);
  console.log('%cPortfolio Ahmad A.L. SAWADOGO', 'color:#4f8ef7;font-family:monospace;font-size:14px;font-weight:bold;');
});

window.downloadCV = downloadCV;
window.go = go;