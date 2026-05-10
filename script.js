/* ----------------------------------------------------------
   The Mint Box Studio — interactions
   ---------------------------------------------------------- */

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* current year in footer */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* mobile nav */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

/* sticky header style on scroll */
const header = document.querySelector('.site-header');
if (header) {
  const update = () => header.classList.toggle('scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* light up ambient motifs after first paint */
const ambient = document.querySelector('.ambient');
if (ambient) requestAnimationFrame(() => requestAnimationFrame(() => ambient.classList.add('lit')));

/* reveal on scroll */
const targets = document.querySelectorAll('.hero-grid, .about-grid, .cards, .shop-grid, .showcase-grid, .brand-strip, .quote, .contact-grid, .ws-group, .section-head, .page-hero');
if (!reduced && 'IntersectionObserver' in window) {
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach(el => io.observe(el));
}

/* ---- ambient motif drift on scroll ----
   Each motif drifts at a different rate and direction so the
   background quietly shifts as you read — never violent, never
   tracking the cursor. */
if (!reduced && ambient) {
  const motifs = ambient.querySelectorAll('.motif');
  const rates = [0.18, -0.12, 0.22, -0.16, 0.10, -0.20]; // px per scroll-px
  const rotRates = [0.04, -0.03, 0.05, -0.02, 0.03, -0.04];
  const baseRots = [-12, 18, 28, -22, 0, 8];
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    motifs.forEach((m, i) => {
      const dy = (y * rates[i % rates.length]).toFixed(1);
      const rot = (baseRots[i] + y * rotRates[i % rotRates.length]).toFixed(2);
      m.style.transform = `translate3d(0, ${dy}px, 0) rotate(${rot}deg)`;
    });
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

/* contact form — graceful client-side handler (mailto fallback) */
const cform = document.querySelector('.contact-form');
if (cform) {
  cform.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(cform);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const subject = (data.get('subject') || 'Workshop enquiry').toString();
    const message = (data.get('message') || '').toString().trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const href = `mailto:themintboxstudio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    const note = cform.querySelector('.form-note');
    if (note) { note.textContent = "Opening your mail app — if nothing happens, write to themintboxstudio@gmail.com directly."; note.hidden = false; }
  });
}
