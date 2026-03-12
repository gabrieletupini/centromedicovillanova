/* ── Centro Medico Villanova — script.js ── */

// ── Navbar scroll shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.doctor-card, .step-card, .insurance-card, .cta-box, .contact-row, .orari-box').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── Load insurance data from affiliazioni.json ──
// (Dynamically replaces the static cards if the JSON is reachable)
async function loadAffiliazioni() {
  try {
    // Works both from /public (local dev) and from GitHub Pages path
    const basePath = window.location.pathname.includes('/website-creator') ? '/website-creator' : '';
    const res = await fetch(`${basePath}/b2b/affiliazioni.json`);
    if (!res.ok) return; // Fall back to static HTML cards

    const data = await res.json();
    const grid = document.getElementById('insurance-grid');
    if (!grid) return;

    const attive = data.affiliazioni.filter(a => a.attiva);
    if (attive.length === 0) return;

    grid.innerHTML = attive.map(ins => `
      <div class="insurance-card reveal">
        <div class="ins-sigla" style="background:${ins.colore}">${ins.logo_sigla}</div>
        <div class="ins-info">
          <h4 class="ins-nome">${ins.nome}</h4>
          <p class="ins-tipo">${ins.tipo}</p>
          <span class="legend-badge legend-${ins.modalita}">${ins.modalita === 'diretto' ? 'Diretto' : 'Rimborso'}</span>
        </div>
      </div>
    `).join('');

    // Re-observe new cards
    grid.querySelectorAll('.insurance-card').forEach(el => {
      revealObserver.observe(el);
    });
  } catch (err) {
    // Static HTML fallback remains in place
  }
}
loadAffiliazioni();

// ── CTA Sara button — opens the Sara widget ──
const ctaSaraBtn = document.getElementById('cta-sara-btn');
if (ctaSaraBtn) {
  ctaSaraBtn.addEventListener('click', () => {
    // Try to click the Sara FAB (injected by sara-widget.js)
    const fab = document.querySelector('[id="sara-widget-host"]');
    if (fab && fab.shadowRoot) {
      const innerFab = fab.shadowRoot.querySelector('.sara-fab');
      if (innerFab) innerFab.click();
    }
  });
}

// ── Staggered card animations ──
document.querySelectorAll('.specialists-grid .doctor-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
document.querySelectorAll('.insurance-grid .insurance-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});

// ── Active nav link on scroll ──
const sections = ['home', 'specialisti', 'come-funziona', 'convenzioni', 'contatti'];
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--navy)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});
