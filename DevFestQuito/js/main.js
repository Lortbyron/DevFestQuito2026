// DevFest Quito 2026 — UI: nav, scroll spy, selección de pase, reveals.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- nav ----------
  const nav = $('.nav'), toggle = $('.nav__toggle'), links = $('#nav-links');
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setOpen(false); });

  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---------- scroll spy ----------
  const navLinks = $$('.nav__links a:not(.btn)');
  const sections = [...new Set(navLinks.map(a => a.getAttribute('href')))].map(h => $(h)).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const id = '#' + en.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id && a === navLinks.find(x => x.getAttribute('href') === id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // ---------- selección de pase ----------
  $$('[data-pass]').forEach(b => b.addEventListener('click', e => {
    // Sustituye el href="#registro" por el enlace real de registro (Eventbrite, Bevy, etc.)
    if (b.getAttribute('href') === '#registro') {
      e.preventDefault();
      $$('[data-pass]').forEach(o => { if (o.dataset.label) { o.innerHTML = o.dataset.label; delete o.dataset.label; } });
      b.dataset.label = b.innerHTML;
      b.textContent = '¡Pase ' + b.dataset.pass + ' seleccionado! ✓';
    }
  }));

  // ---------- reveal ----------
  const rv = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); rv.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; rv.observe(el); });
})();
