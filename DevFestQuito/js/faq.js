// FAQ: lista de preguntas a la izquierda, respuesta grande a la derecha.
(() => {
  const list = document.querySelector('.faq-split__list');
  if (!list) return;
  const btns = [...list.querySelectorAll('button')];
  const items = [...document.querySelectorAll('.faq-split__item')];
  const panel = document.querySelector('.faq-split__panel');
  let cur = 0;
  const show = i => {
    if (i === cur) return;
    const prev = items[cur]; cur = i;
    btns.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    panel.style.setProperty('--c', getComputedStyle(items[i]).getPropertyValue('--c'));
    const swap = () => { prev.hidden = true; items[i].hidden = false; };
    if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.timeline()
        .to(prev.children, { autoAlpha: 0, y: -10, duration: 0.16, stagger: 0.03 })
        .add(swap)
        .fromTo(items[i].children, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out', clearProps: 'all' });
    } else swap();
  };
  btns.forEach((b, k) => {
    b.addEventListener('click', () => show(k));
    b.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) show(k); });
  });
  panel.style.setProperty('--c', getComputedStyle(items[0]).getPropertyValue('--c'));
})();
