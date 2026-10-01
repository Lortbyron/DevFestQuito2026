// DevFest Quito 2026 — capa cinemática: preloader, smooth scroll (Lenis),
// GSAP + ScrollTrigger + SplitText, cursor, magnetismo y tilt.
(() => {
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const setLoaded = () => html.classList.add('is-loaded');

  // Sin GSAP (CDN caído) o con "reducir movimiento": sitio estático y completo.
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    $('.loader')?.remove();
    $$('[data-count]').forEach(b => { b.textContent = b.dataset.count + (b.dataset.suffix || ''); });
    setLoaded();
    return;
  }

  html.classList.add('gsap');
  gsap.registerPlugin(ScrollTrigger);
  const hasSplit = !!window.SplitText;
  if (hasSplit) gsap.registerPlugin(SplitText);
  const split = (el, opts) => hasSplit ? SplitText.create(el, opts) : null;

  // ---------- smooth scroll ----------
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.__lenis = lenis;
  }
  const navH = () => $('.nav').offsetHeight;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id); if (!el) return;
    e.preventDefault();
    const y = id === '#inicio' ? 0 : el;
    if (lenis) lenis.scrollTo(y, { offset: -navH() - 8, duration: 1.4 });
    else scrollTo({ top: y === 0 ? 0 : el.getBoundingClientRect().top + scrollY - navH() - 8, behavior: 'smooth' });
  });

  // ---------- barra de progreso ----------
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // ---------- nav: se esconde al bajar, vuelve al subir ----------
  const nav = $('.nav');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      const hide = self.direction === 1 && self.scroll() > innerHeight * 0.9 && !nav.classList.contains('is-open');
      nav.classList.toggle('is-hidden', hide);
    }
  });

  // ---------- estados iniciales (antes del preloader, sin parpadeo) ----------
  const heroTitle = split('.hero__title', { type: 'lines,chars', mask: 'lines' });
  const heroBits = ['.hero .eyebrow', '.hero__tagline', '.hero__lead', '.hero__meta li', '.hero__actions > *'];
  gsap.set(heroBits, { autoAlpha: 0, y: 28 });
  gsap.set('.gbar i', { scaleX: 0, transformOrigin: '0 50%' });
    gsap.set('.hero__scroll, .hero-visual__hint', { autoAlpha: 0, y: 12 });
  gsap.set('.brand, .nav__cta, .nav__toggle, .nav__links > a', { autoAlpha: 0, y: -20 });
  if (heroTitle) gsap.set(heroTitle.chars, { yPercent: 115, rotate: 6 });

  // ---------- preloader ----------
  const num = $('.loader__num'), bars = $$('.loader__bars i'), count = { v: 0 };
  gsap.set(bars, { yPercent: 101 });
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .to('.brand, .nav__cta, .nav__toggle, .nav__links > a', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 }, 0)
    .to(heroTitle ? heroTitle.chars : '.hero__title', { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.028 }, 0.05)
    .to('.hero .eyebrow', { autoAlpha: 1, y: 0, duration: 1 }, 0.1)
    .to('.hero__tagline', { autoAlpha: 1, y: 0, duration: 1.1 }, 0.45)
    .to('.gbar i', { scaleX: 1, duration: 0.8, stagger: 0.09, ease: 'power3.inOut' }, 0.6)
    .to(['.hero__lead', '.hero__meta li', '.hero__actions > *'], { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.7)
    .to('.hero__scroll, .hero-visual__hint', { autoAlpha: 1, y: 0, duration: 0.8 }, 1.6);

  gsap.timeline({ defaults: { ease: 'expo.inOut' } })
    .to(count, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(count.v); } })
    .to('.loader__inner', { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power3.in' }, '>-0.1')
    .to(bars, { yPercent: 0, duration: 0.8, stagger: 0.07 }, '<0.1')
    .set('.loader', { backgroundColor: 'transparent' })
    .to(bars, { yPercent: -101, duration: 0.9, stagger: 0.07 })
    .add(() => { setLoaded(); intro.play(); lenis && lenis.start(); }, '<0.25')
    .set('.loader', { display: 'none' });

  // ---------- hero: pin + cámara con scroll ----------
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1025px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=110%', pin: true, scrub: 1, anticipatePin: 1,
        onUpdate: self => { window.__heroScroll = self.progress; }
      }
    });
    tl.to('.hero__copy', { yPercent: -18, autoAlpha: 0, ease: 'power1.in' }, 0)
      .to('.hero__scroll, .hero-visual__hint', { autoAlpha: 0, duration: 0.2 }, 0);
    return () => { window.__heroScroll = 0; };
  });
  mm.add('(max-width: 1024px)', () => {
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => { window.__heroScroll = s.progress * 0.6; } });
    return () => { window.__heroScroll = 0; };
  });

  // ---------- temas ----------
  gsap.from('.topic', {
    y: 110, rotateX: -40, autoAlpha: 0, transformPerspective: 1000, transformOrigin: '50% 100%',
    duration: 1.3, stagger: 0.09, ease: 'expo.out', clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: '.topics', start: 'top 92%' }
  });

  // ---------- manifiesto: palabras que se encienden con el scroll ----------
  const st = split('.statement__text', { type: 'words' });
  if (st) {
    gsap.fromTo(st.words, { opacity: 0.14 }, {
      opacity: 1, stagger: 0.12, ease: 'none',
      scrollTrigger: { trigger: '.statement__text', start: 'top 82%', end: 'bottom 42%', scrub: true }
    });
  }
  gsap.from('.statement .eyebrow', { autoAlpha: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.statement', start: 'top 80%' } });
  $$('[data-count]').forEach(b => {
    const o = { v: 0 }, end = +b.dataset.count, suf = b.dataset.suffix || '';
    gsap.to(o, {
      v: end, duration: 2.2, ease: 'power3.out',
      onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString('es-EC') + suf; },
      scrollTrigger: { trigger: b, start: 'top 88%', once: true }
    });
  });
  gsap.from('.stats li', { y: 60, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 88%' } });

  // ---------- marquee con velocidad del scroll ----------
  const track = $('.marquee__track');
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
    let dir = 1;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const v = self.getVelocity();
        if (self.direction !== dir) dir = self.direction;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 300, 6)), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        skew(gsap.utils.clamp(-8, 8, v / -200));
      }
    });
    gsap.fromTo('.marquee', { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ---------- intros de sección ----------
  $$('.block__intro').forEach(intro => {
    const h2 = $('h2', intro), s = split(h2, { type: 'lines', mask: 'lines' });
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: intro, start: 'top 82%' } });
    tl.from($('.eyebrow', intro), { autoAlpha: 0, y: 16, duration: 0.9 })
      .from($('.rule', intro), { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, ease: 'power3.inOut' }, 0.05)
      .from(s ? s.lines : h2, { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.1)
      .from($$(':scope > p:not(.eyebrow), :scope > .btn, :scope > .when', intro), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.35);
  });

  // ---------- speakers ----------
  $$('.spk-row').forEach(row => {
    gsap.from($$('.speaker', row), {
      clipPath: 'inset(100% 0% 0% 0% round 22px)', y: 60, duration: 1.3, stagger: 0.09, ease: 'expo.out', clearProps: 'clipPath,transform',
      scrollTrigger: { trigger: row, start: 'top 85%' }
    });
    gsap.from($('.spk-row__head', row), { autoAlpha: 0, y: 24, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 88%' } });
  });

  // ---------- agenda ----------
  gsap.from('.tl__item', { x: -40, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.tl', start: 'top 85%' } });
  gsap.from('#agenda .chip', { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: '#agenda .chips', start: 'top 90%' } });
  gsap.from('.agenda-side', { clipPath: 'inset(12% 0% 0% 0% round 30px)', autoAlpha: 0, y: 60, duration: 1.4, ease: 'expo.out', clearProps: 'clipPath,transform', scrollTrigger: { trigger: '.agenda-side', start: 'top 85%' } });

  // ---------- momentos: scroll horizontal fijado (desktop) ----------
  mm.add('(min-width: 1025px)', () => {
    const track = $('.moments__track'), vp = $('.moments__viewport'), bar = $('.moments__progress i');
    if (!track || !vp) return;
    const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.moments__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => gsap.set(bar, { scaleX: self.progress })
      }
    });
    $$('.moment', track).forEach(card => {
      const glyph = $('.moment__glyph', card);
      if (glyph) gsap.fromTo(glyph, { x: 50 }, { x: -50, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
  });
  gsap.from('.moment', { y: 80, autoAlpha: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.moments', start: 'top 80%' } });

  // ---------- por qué asistir ----------
  gsap.from('.reasons .session', {
    y: 90, rotate: 2, autoAlpha: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out', clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: '.reasons', start: 'top 86%' }
  });
  gsap.from('.reasons .session__ico', { scale: 0.2, rotate: -40, autoAlpha: 0, duration: 1.1, stagger: 0.09, ease: 'back.out(2)', scrollTrigger: { trigger: '.reasons', start: 'top 82%' } });

  // ---------- pases ----------
  gsap.from('.pass', {
    y: 120, rotateX: 18, autoAlpha: 0, transformPerspective: 1100, duration: 1.4, stagger: 0.12, ease: 'expo.out',
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: '.passes', start: 'top 85%' }
  });
  gsap.from('.pass__ticket', { rotate: -70, scale: 0.3, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.passes', start: 'top 80%' } });

  // ---------- organizadores ----------
  gsap.from('.org-panel', { y: 80, autoAlpha: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.org-strip', start: 'top 85%' } });

  // ---------- auspiciantes / FAQ ----------
  gsap.from('.sponsor-card', { y: 70, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.sponsors', start: 'top 85%' } });
  gsap.from('.wm--wursta', { scale: 0.85, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.sponsors', start: 'top 80%' } });
  gsap.from('.collab li', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.collab', start: 'top 90%' } });
  gsap.from('.faq-split__list li', { x: -30, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.faq-split', start: 'top 85%' } });
  gsap.from('.faq-split__panel', { y: 60, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.faq-split', start: 'top 85%' } });

  // ---------- footer ----------
  gsap.fromTo('.footer__graphic', { yPercent: 18, scale: 0.9, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 0.8, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.footer__bar > *', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.footer__bar', start: 'top 98%' } });

  // ---------- interacciones de puntero (solo desktop) ----------
  if (finePointer) {
    // cursor
    const cur = $('.cursor');
    cur.classList.add('is-hidden');
    addEventListener('pointermove', () => { cur.classList.remove('is-hidden'); html.classList.add('has-cursor'); }, { once: true });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    const dx = gsap.quickTo('.cursor__logo', 'x', { duration: 0.14, ease: 'power3' }), dy = gsap.quickTo('.cursor__logo', 'y', { duration: 0.14, ease: 'power3' });
    const rx = gsap.quickTo('.cursor__ring', 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo('.cursor__ring', 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const view = e.target.closest('.topic, .session, .speaker, .moment');
      const link = !view && e.target.closest('a, button, summary, #hero-canvas');
      cur.classList.toggle('is-view', !!view);
      cur.classList.toggle('is-link', !!link);
    });
    document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cur.classList.remove('is-hidden'));

    // botones magnéticos
    $$('.btn, .go, .social a, .nav__links a:not(.btn)').forEach(el => {
      const k = el.classList.contains('btn') ? 0.3 : 0.4;
      const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' }), my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * k); my((e.clientY - r.top - r.height / 2) * k); });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });

    // tilt 3D en tarjetas
    $$('#speakers .speaker, .topic, .session, .pass:not(.pass--closed)').forEach(el => {
      const strength = el.classList.contains('pass') ? 6 : 9;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, { rotateY: px * strength, rotateX: -py * strength, y: -6, transformPerspective: 900, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { rotateY: 0, rotateX: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.5)', overwrite: 'auto' }));
    });
  }

  // ?still → salta todas las entradas (útil para capturas / revisión de diseño)
  if (/[?&]still/.test(location.search)) {
    gsap.globalTimeline.getChildren(false, true, true).forEach(t => { if (!t.scrollTrigger || !t.scrollTrigger.vars.scrub) t.progress(1); });
  }

  // recalcula cuando cargan fuentes e imágenes
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
