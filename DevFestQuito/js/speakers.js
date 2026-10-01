// DevFest Quito 2026 — Speakers: datos + carruseles (Internacionales / Nacionales) + vista "Ver todos".
//
// ✏️ PARA EDITAR LOS SPEAKERS: modifica solo este arreglo.
//   group:  'int' (internacional) o 'nac' (nacional)
//   name:   nombre completo
//   role:   línea corta bajo el nombre (tema · empresa)
//   country: país (se muestra en la vista "Ver todos")
//   photo:  ruta de la imagen, p. ej. 'assets/speakers/nombre.jpg'. Vacío = placeholder.
//   focus:  encuadre de la foto dentro de la tarjeta (object-position), p. ej. '60% 30%' = cara a la derecha
//   accent: 'blue' | 'red' | 'green' | 'yellow'  (color de las formas y la barra)
const SPEAKERS = [
  { group: 'int', name: 'Speaker internacional 01', role: 'Tema por confirmar', country: 'Por anunciar', photo: 'assets/speakers/internacional-01.webp', focus: '64% 30%', accent: 'blue' },
  { group: 'int', name: 'Speaker internacional 02', role: 'Tema por confirmar', country: 'Por anunciar', photo: 'assets/speakers/internacional-02.webp', focus: '62% 30%', accent: 'green' },
  { group: 'int', name: 'Speaker internacional 03', role: 'Tema por confirmar', country: 'Por anunciar', photo: 'assets/speakers/internacional-03.webp', focus: '40% 30%', accent: 'yellow' },
  { group: 'int', name: 'Speaker internacional 04', role: 'Tema por confirmar', country: 'Por anunciar', photo: 'assets/speakers/internacional-04.webp', focus: '52% 30%', accent: 'red' },
  { group: 'int', name: 'Speaker internacional 05', role: 'Tema por confirmar', country: 'Por anunciar', photo: 'assets/speakers/internacional-05.webp', focus: '52% 30%', accent: 'yellow' },
  { group: 'int', name: 'Speaker internacional 06', role: 'Tema por confirmar', country: 'Por anunciar', photo: 'assets/speakers/internacional-06.webp', focus: '52% 30%', accent: 'green' },
  { group: 'nac', name: 'Speaker nacional 01', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-01.webp', focus: '55% 30%', accent: 'red' },
  { group: 'nac', name: 'Speaker nacional 02', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-02.webp', focus: '77% 30%', accent: 'blue' },
  { group: 'nac', name: 'Speaker nacional 03', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-03.webp', focus: '30% 30%', accent: 'green' },
  { group: 'nac', name: 'Speaker nacional 04', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-04.webp', focus: '66% 30%', accent: 'yellow' },
  { group: 'nac', name: 'Speaker nacional 05', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-05.webp', focus: '52% 30%', accent: 'blue' },
  { group: 'nac', name: 'Speaker nacional 06', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-06.webp', focus: '66% 30%', accent: 'red' },
  { group: 'nac', name: 'Speaker nacional 07', role: 'Tema por confirmar', country: 'Ecuador', photo: 'assets/speakers/nacional-07.webp', focus: '48% 30%', accent: 'green' },
];

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const PAL = {
    blue:   ['#1A73E8', '#FBBC04', '#EA4335'],
    red:    ['#EA4335', '#1A73E8', '#34A853'],
    green:  ['#34A853', '#FBBC04', '#EA4335'],
    yellow: ['#FBBC04', '#34A853', '#1A73E8'],
  };
  const GROUP_LABEL = { int: 'Internacional', nac: 'Nacional' };
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arrow = '<svg><use href="#i-arrow"/></svg>';

  function card(sp, i, extended) {
    const [c1, c2, c3] = PAL[sp.accent] || PAL.blue;
    const media = sp.photo
      ? `<img src="${esc(sp.photo)}" alt="${esc(sp.name)}" loading="lazy" style="object-position:${esc(sp.focus || 'center 30%')}">`
      : `<div class="speaker__placeholder" aria-hidden="true">
           <svg viewBox="0 0 200 220"><defs><linearGradient id="sg${i}${extended ? 'x' : ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9CED8"/><stop offset="1" stop-color="#9AA1AE"/></linearGradient></defs>
             <circle cx="100" cy="86" r="42" fill="url(#sg${i}${extended ? 'x' : ''})"/><path d="M22 220c4-48 36-76 78-76s74 28 78 76z" fill="url(#sg${i}${extended ? 'x' : ''})"/></svg>
           <small>Foto próximamente</small>
         </div>`;
    return `<article class="speaker" data-group="${sp.group}" data-idx="${i}" style="--c1:${c1};--c2:${c2};--c3:${c3};--accent:${c1}">
      <div class="speaker__art${sp.photo ? ' speaker__art--photo' : ''}">
        ${sp.photo ? '' : '<span class="shape shape--circle"></span><span class="shape shape--quarter"></span><span class="shape shape--tri"></span><span class="shape shape--dots"></span>'}
        ${media}
      </div>
      <div class="speaker__info">
        <div><h3>${esc(sp.name)}</h3><p>${esc(sp.role)}</p>${extended ? `<small class="speaker__meta">${GROUP_LABEL[sp.group]} · ${esc(sp.country)}</small>` : ''}</div>
        ${extended ? `<span class="go go--sm" aria-hidden="true">${arrow}</span>` : `<button class="go go--sm" type="button" data-open-speakers data-focus="${i}" aria-label="Ver ${esc(sp.name)}">${arrow}</button>`}
      </div>
    </article>`;
  }

  // ---------- carruseles de la sección ----------
  $$('.spk-row').forEach(row => {
    const g = row.dataset.group, list = SPEAKERS.map((s, i) => [s, i]).filter(([s]) => s.group === g);
    const track = $('.spk-track', row);
    track.innerHTML = list.map(([s, i]) => card(s, i, false)).join('');
    $('.spk-count', row).textContent = String(list.length).padStart(2, '0');
    const step = dir => track.scrollBy({ left: dir * Math.max(track.clientWidth * 0.8, 260), behavior: 'smooth' });
    $('[data-dir="-1"]', row).addEventListener('click', () => step(-1));
    $('[data-dir="1"]', row).addEventListener('click', () => step(1));
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      $('[data-dir="-1"]', row).disabled = track.scrollLeft <= 2;
      $('[data-dir="1"]', row).disabled = track.scrollLeft >= max;
    };
    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync); sync();
  });

  // ---------- vista "Ver todos" ----------
  const view = $('#speakers-todos'), grid = $('.spk-grid', view), html = document.documentElement;
  grid.innerHTML = SPEAKERS.map((s, i) => card(s, i, true)).join('');
  const chips = $$('.chip', view);
  const counts = { all: SPEAKERS.length, int: SPEAKERS.filter(s => s.group === 'int').length, nac: SPEAKERS.filter(s => s.group === 'nac').length };
  chips.forEach(c => { const n = c.querySelector('span'); if (n) n.textContent = counts[c.dataset.filter]; });

  function filter(f) {
    chips.forEach(c => { const on = c.dataset.filter === f; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', String(on)); });
    const shown = $$('.speaker', grid).filter(el => { const ok = f === 'all' || el.dataset.group === f; el.hidden = !ok; return ok; });
    if (window.gsap) gsap.fromTo(shown, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out', clearProps: 'transform,opacity,visibility' });
  }
  chips.forEach(c => c.addEventListener('click', () => filter(c.dataset.filter)));

  let lastFocus = null;
  function open(opts = {}) {
    lastFocus = document.activeElement;
    view.hidden = false;
    html.classList.add('spk-open');
    window.__lenis && window.__lenis.stop();
    filter(opts.group || 'all');
    view.scrollTop = 0;
    requestAnimationFrame(() => view.classList.add('is-open'));
    if (opts.focus != null) {
      const el = $(`.speaker[data-idx="${opts.focus}"]`, grid);
      if (el) { setTimeout(() => { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.add('is-focus'); setTimeout(() => el.classList.remove('is-focus'), 1800); }, 350); }
    }
    setTimeout(() => $('.spk-view__close', view).focus({ preventScroll: true }), 50);
    if (location.hash !== '#speakers-todos') history.pushState(null, '', '#speakers-todos');
  }
  function close(fromPop) {
    if (view.hidden) return;
    view.classList.remove('is-open');
    html.classList.remove('spk-open');
    window.__lenis && window.__lenis.start();
    setTimeout(() => { view.hidden = true; }, 350);
    lastFocus && lastFocus.focus({ preventScroll: true });
    if (!fromPop && location.hash === '#speakers-todos') history.back();
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open-speakers]');
    if (!b) return;
    e.preventDefault();
    const f = b.dataset.focus;
    open({ focus: f != null ? +f : null, group: b.dataset.group });
  });
  $('.spk-view__close', view).addEventListener('click', () => close());
  addEventListener('keydown', e => {
    if (view.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // mantener el foco dentro de la vista
      const f = $$('button, a[href]', view).filter(el => !el.closest('[hidden]'));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addEventListener('popstate', () => { if (location.hash !== '#speakers-todos') close(true); });
  if (location.hash === '#speakers-todos') open();
})();
