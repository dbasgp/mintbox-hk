/* ---- The Mint Box Studio · interactions ---- */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* footer year */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* mobile nav */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

/* sticky header style on scroll */
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* light up ambient yarn balls */
const ambient = document.querySelector('.ambient');
if (ambient) requestAnimationFrame(() => requestAnimationFrame(() => ambient.classList.add('lit')));

/* reveal on scroll */
const targets = document.querySelectorAll('.hero-grid, .about-grid, .ws-rail, .shop-grid, .mosaic, .brand-rail, .quote, .contact-grid, .ws-group, .section-head, .page-hero');
if (!reduced && 'IntersectionObserver' in window) {
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach(el => io.observe(el));
}

/* gentle scroll parallax for ambient crochet motifs */
if (!reduced && ambient) {
  const balls = ambient.querySelectorAll('.ball');
  const rates = [0.10, -0.07, 0.12, -0.09, 0.06, -0.11, 0.08, -0.06];
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    balls.forEach((b, i) => {
      const dy = (y * rates[i % rates.length]).toFixed(1);
      b.style.transform = `translate3d(0, ${dy}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* click any ambient crochet motif for a playful pop */
if (ambient) {
  ambient.querySelectorAll('.ball').forEach(b => {
    b.addEventListener('click', () => {
      b.classList.remove('popping');
      void b.offsetWidth; /* restart animation */
      b.classList.add('popping');
    });
    b.addEventListener('animationend', (e) => {
      if (e.animationName === 'ball-pop') b.classList.remove('popping');
    });
  });
}

/* contact form — graceful mailto fallback */
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
    window.location.href = `mailto:themintboxstudio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const note = cform.querySelector('.form-note');
    if (note) { note.textContent = "Opening your mail app — if nothing happens, write to themintboxstudio@gmail.com directly."; note.hidden = false; }
  });
}

/* tap-and-bounce on workshop cards (mobile delight) */
if (!reduced && 'ontouchstart' in window) {
  document.querySelectorAll('.ws-card, .ws-tile, .shop-card, .mosaic .tile').forEach(el => {
    el.addEventListener('touchstart', () => el.style.transform = 'scale(0.97)', { passive: true });
    el.addEventListener('touchend',   () => el.style.transform = '');
    el.addEventListener('touchcancel',() => el.style.transform = '');
  });
}
