// DevFest Quito 2026 — Agenda (timeline con filtros) + "Momentos que conectan".
//
// ✏️ PARA EDITAR LA AGENDA: modifica solo este arreglo.
//   time:  hora 'HH:MM'
//   title / desc: título y línea corta
//   detail: texto que aparece al desplegar la fila
//   tags:  filtros a los que pertenece: keynote · ia · cloud · startups · comunidad · talleres
//   icon:  id del ícono del sprite (a-badge, a-mic, a-spark, a-people, a-panel, a-music, a-rocket, a-learn)
//   color: color del punto del timeline
//   photo: imagen para la tarjeta de "Momentos" (vacío = ilustración de colores)
const AGENDA = [
  { time: '08:30', title: 'Registro y bienvenida', desc: 'Acreditación, entrega de kits y networking.', detail: 'Llega temprano al Campus USFQ en Cumbayá: acreditación, swag de la comunidad, snacks y los primeros encuentros del día.', moment: 'Acreditación, swag y networking.', tags: ['comunidad'], icon: 'a-badge', color: '#1A73E8', photo: '' },
  { time: '10:00', title: 'Keynote inaugural', desc: 'Innovando juntos desde Quito.', detail: 'Apertura oficial del Google DevFest Quito 2026 junto a GDG Quito y Nestlab USFQ.', moment: 'Innovando juntos desde Quito.', tags: ['keynote'], icon: 'a-mic', color: '#34A853', photo: '' },
  { time: '11:30', title: 'Sesiones técnicas', desc: 'IA, Web, Cloud y más.', detail: 'Charlas sobre inteligencia artificial, desarrollo web y Google Cloud con speakers nacionales e internacionales.', moment: 'IA, Web, Cloud y más.', tags: ['ia', 'cloud'], icon: 'a-spark', color: '#FBBC04', photo: '' },
  { time: '14:00', title: 'Workshops', desc: 'Aprende en comunidad.', detail: 'Talleres prácticos sobre las últimas tecnologías e innovaciones. Trae tu laptop.', moment: 'Aprende en comunidad.', tags: ['talleres', 'ia', 'cloud'], icon: 'a-people', color: '#EA4335', photo: '' },
  { time: '16:00', title: 'Panel comunidad', desc: 'Historias que inspiran.', detail: 'Líderes empresariales y fundadores de startups de todo el país comparten experiencias, visiones y lecciones aprendidas.', moment: 'Historias que inspiran.', tags: ['comunidad', 'startups'], icon: 'a-panel', color: '#A142F4', photo: '' },
  { time: '17:30', title: 'Cierre especial', desc: 'Tecnología + Cultura.', detail: 'Cerramos el día celebrando a la comunidad tech del Ecuador.', moment: 'Tecnología + Cultura.', tags: ['comunidad'], icon: 'a-music', color: '#1A73E8', photo: '' },
];
// Imagen de la tarjeta lateral de la agenda (p. ej. 'assets/agenda/quito.jpg'). Vacío = ilustración.
const AGENDA_SIDE_IMAGE = 'assets/agenda/quito.webp';

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LABEL = { keynote: 'Keynote', ia: 'IA', cloud: 'Cloud', startups: 'Startups', comunidad: 'Comunidad', talleres: 'Talleres' };

  // ---------- timeline ----------
  const list = $('.tl');
  if (!list) return;
  list.innerHTML = AGENDA.map((a, i) => `
    <li class="tl__item" data-tags="${a.tags.join(' ')}" data-i="${i}" style="--dot:${a.color}">
      <time class="tl__time" datetime="2026-09-26T${a.time}-05:00">${a.time}</time>
      <span class="tl__dot" aria-hidden="true"></span>
      <div class="tl__card">
        <button class="tl__head" type="button" aria-expanded="false" aria-controls="tl-d-${i}">
          <svg class="tl__ico" aria-hidden="true"><use href="#${a.icon}"/></svg>
          <span class="tl__txt"><b>${esc(a.title)}</b><small>${esc(a.desc)}</small></span>
          <span class="tl__chev" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m7 4 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="tl__detail" id="tl-d-${i}" role="region">
          <div><p>${esc(a.detail)}</p><ul class="tl__tags">${a.tags.map(t => `<li>${LABEL[t] || t}</li>`).join('')}</ul></div>
        </div>
      </div>
    </li>`).join('');

  const items = $$('.tl__item', list);
  const toggle = (item, force) => {
    const open = force ?? !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    $('.tl__head', item).setAttribute('aria-expanded', String(open));
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 460);
  };
  items.forEach(it => $('.tl__head', it).addEventListener('click', () => toggle(it)));

  // filtros
  const chips = $$('#agenda .chip'), empty = $('.tl__empty');
  function filter(f) {
    chips.forEach(c => { const on = c.dataset.filter === f; c.classList.toggle('is-on', on); c.setAttribute('aria-selected', String(on)); });
    const shown = items.filter(it => { const ok = f === 'all' || it.dataset.tags.split(' ').includes(f); it.hidden = !ok; return ok; });
    empty.hidden = shown.length > 0;
    if (window.gsap) gsap.fromTo(shown, { x: -24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: 'expo.out', clearProps: 'transform,opacity,visibility' });
    window.ScrollTrigger && ScrollTrigger.refresh();
  }
  chips.forEach(c => c.addEventListener('click', () => filter(c.dataset.filter)));

  // "Ver agenda completa": despliega / contrae todas las filas
  const allBtn = $('[data-agenda-all]');
  allBtn && allBtn.addEventListener('click', () => {
    const expand = allBtn.getAttribute('aria-pressed') !== 'true';
    filter('all');
    items.forEach(it => toggle(it, expand));
    allBtn.setAttribute('aria-pressed', String(expand));
    allBtn.firstChild.textContent = expand ? 'Contraer agenda ' : 'Ver agenda completa ';
  });

  // imagen lateral opcional
  if (AGENDA_SIDE_IMAGE) {
    const art = $('.agenda-side__art');
    if (art) {
      art.innerHTML = `<img src="${esc(AGENDA_SIDE_IMAGE)}" alt="Quito: centro histórico con la iglesia de cúpula azul y el volcán Pichincha al fondo" loading="lazy">`;
      art.closest('.agenda-side').classList.add('agenda-side--photo');
    }
  }

  // ---------- momentos ----------
  const track = $('.moments__track');
  if (track) {
    track.innerHTML = AGENDA.map((a, i) => `
      <article class="moment" style="--c:${a.color}">
        <div class="moment__media">
          ${a.photo ? `<img src="${esc(a.photo)}" alt="${esc(a.title)}" loading="lazy">`
            : `<span class="moment__blob moment__blob--a"></span><span class="moment__blob moment__blob--b"></span><svg class="moment__glyph" aria-hidden="true"><use href="#${a.icon}"/></svg>`}
          <span class="moment__time">${a.time}</span>
          <span class="moment__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        </div>
        <div class="moment__body">
          <h3><svg aria-hidden="true"><use href="#${a.icon}"/></svg>${esc(a.title)}</h3>
          <p>${esc(a.moment)}</p>
          <button class="go go--sm" type="button" data-agenda-go="${i}" aria-label="Ver ${esc(a.title)} en la agenda"><svg><use href="#i-arrow"/></svg></button>
        </div>
      </article>`).join('');
  }

  // desde "Momentos" → ir a la fila de la agenda y desplegarla
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-agenda-go]');
    if (!b) return;
    filter('all');
    const it = items[+b.dataset.agendaGo];
    toggle(it, true);
    const nav = $('.nav').offsetHeight;
    if (window.__lenis) window.__lenis.scrollTo(it, { offset: -nav - 40, duration: 1.4 });
    else it.scrollIntoView({ behavior: 'smooth', block: 'center' });
    it.classList.add('is-focus'); setTimeout(() => it.classList.remove('is-focus'), 2000);
  });
})();
