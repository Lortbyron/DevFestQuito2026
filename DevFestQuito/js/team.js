// Organizadores: paneles que se expanden (el que se toca o se señala se abre).
(() => {
  const panels = [...document.querySelectorAll('.org-panel')];
  if (!panels.length) return;
  const on = p => panels.forEach(x => { const a = x === p; x.classList.toggle('is-on', a); x.setAttribute('aria-expanded', String(a)); });
  panels.forEach(p => {
    p.setAttribute('role', 'button');
    p.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) on(p); });
    p.addEventListener('focus', () => on(p));
    p.addEventListener('click', () => on(p));
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); on(p); } });
  });
  on(panels.find(p => p.classList.contains('is-on')) || panels[0]);
})();
