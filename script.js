'use strict';

const SECTIONS = ['about','education','experience','projects','skills','certifications'];
let current = 'about';

/* ── NAVIGATION ── */
function go(id) {
  if (!SECTIONS.includes(id) || !document.getElementById(id)) return;

  document.querySelectorAll('.sec').forEach(s => { s.classList.remove('active'); s.style.display='none'; });
  const el = document.getElementById(id);
  el.style.display = 'block';
  requestAnimationFrame(() => el.classList.add('active'));

  document.querySelectorAll('.nl').forEach(b => b.classList.toggle('active', b.dataset.s === id));
  current = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#' + id);
  closeMobile();
}

function initSections() {
  SECTIONS.forEach(id => { const el = document.getElementById(id); if(el) el.style.display='none'; });
  const hash = window.location.hash.slice(1);
  go(SECTIONS.includes(hash) ? hash : 'about');
}

document.querySelectorAll('.nl').forEach(b => b.addEventListener('click', () => go(b.dataset.s)));
document.querySelectorAll('.footer-nav button').forEach(b => {
  b.addEventListener('click', () => {
    const map = {'À propos':'about','Formation':'education','Expérience':'experience','Projets':'projects','Compétences':'skills','Certifications':'certifications'};
    go(map[b.textContent.trim()] || 'about');
  });
});

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

function closeMobile() {
  hamburger?.classList.remove('open');
  navLinks?.classList.remove('open');
}

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) closeMobile();
});

/* ── SCROLL ── */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  btt?.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ── KEYBOARD ── */
document.addEventListener('keydown', e => {
  if (e.altKey) {
    const i = SECTIONS.indexOf(current);
    if (e.key === 'ArrowRight' && i < SECTIONS.length-1) go(SECTIONS[i+1]);
    if (e.key === 'ArrowLeft'  && i > 0)                  go(SECTIONS[i-1]);
  }
  if (e.key === 'Escape') closeMobile();
});

/* ── CV DOWNLOAD ── */
function downloadCV() {
  toast('Téléchargement en cours…', 'info');
  setTimeout(() => {
    const a = document.createElement('a');
    a.href = 'https://github.com/Ahmad-Abdoul-Lattif/Mon-CV/raw/master/CV_Ahmad_Sawadogo.pdf';
    a.download = 'CV_Ahmad_Abdoul_Latif_SAWADOGO.pdf';
    a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('CV téléchargé !', 'success');
  }, 800);
}

/* ── TOAST ── */
function toast(msg, type='info') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const colors = { success:'#3fb950', info:'#58a6ff', error:'#f85149' };
  const icons  = { success:'check-circle', info:'info-circle', error:'exclamation-circle' };
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<i class="fas fa-${icons[type]}" style="color:${colors[type]}"></i> ${msg}`;
  Object.assign(el.style, {
    position:'fixed', bottom:'72px', right:'24px', zIndex:'9999',
    background:'#161b22', border:`1px solid ${colors[type]}33`,
    borderLeft:`3px solid ${colors[type]}`,
    color:'#e6edf3', padding:'11px 16px', borderRadius:'8px',
    fontFamily:'Inter,sans-serif', fontSize:'13px',
    display:'flex', alignItems:'center', gap:'9px',
    boxShadow:'0 8px 24px rgba(0,0,0,0.5)',
    animation:'toastIn 0.25s ease', maxWidth:'300px'
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.animation='toastOut 0.25s ease forwards'; setTimeout(()=>el.remove(),250); }, 3500);
}

/* ── ANIMATE ON SCROLL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; obs.unobserve(e.target); }
  });
}, { threshold:0.08, rootMargin:'0px 0px -30px 0px' });

function observeEls() {
  document.querySelectorAll('.ac-card,.proj-card,.sk-card,.cert-card,.tl-card,.ti-item,.oc-item,.lang-item').forEach((el,i) => {
    el.style.opacity='0'; el.style.transform='translateY(18px)';
    el.style.transition=`opacity 0.4s ease ${i*0.035}s, transform 0.4s ease ${i*0.035}s`;
    obs.observe(el);
  });
}

/* ── TERMINAL TYPING ── */
function typeTerminal() {
  const cursor = document.querySelector('.t-cursor');
  if (cursor) setInterval(() => { cursor.style.opacity = cursor.style.opacity==='0'?'1':'0'; }, 600);
}

/* ── POPSTATE ── */
window.addEventListener('popstate', () => {
  const hash = window.location.hash.slice(1);
  if (SECTIONS.includes(hash)) go(hash);
});

/* ── DYNAMIC STYLES ── */
const s = document.createElement('style');
s.textContent = `
  @keyframes toastIn  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes toastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(16px)} }
`;
document.head.appendChild(s);

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  initSections();
  setTimeout(observeEls, 150);
  typeTerminal();
  console.log('%c Ahmad A.L. SAWADOGO — Portfolio ', 'background:#58a6ff;color:#fff;font-family:monospace;font-size:13px;padding:4px 8px;border-radius:4px;');
});

window.downloadCV = downloadCV;
window.go = go;