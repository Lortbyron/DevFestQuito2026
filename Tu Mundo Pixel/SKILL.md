---
name: pixel-world
description: Create short retro pixel-art animations (8/16-bit) with a character, scenes, music, sound effects and video export, as one HTML file, through a friendly interview; for anyone, technical or not. Crea animaciones cortas en pixel art retro con personaje, escenas, musica, efectos y exportacion a video, en un solo archivo HTML, a traves de una entrevista amable. Use when someone wants a pixel animation, a pixel character or world, a retro video for social media, or pastes a brief like the Tiny Developer one.
---

# Pixel World · Mundos pixel

**Para personas.** Pega este archivo en cualquier IA (Claude, ChatGPT, Gemini...) o instalalo como skill, y di: *"Quiero crear una animacion pixel"*. La IA te hara unas preguntas y te entregara tu pelicula en un archivo HTML con reproductor, sonido y boton para exportar video.

**For people.** Paste this file into any AI (Claude, ChatGPT, Gemini...) or install it as a skill, and say: *"I want to make a pixel animation"*. The AI will ask a few questions and give you your film as an HTML file with a player, sound and a video export button.

---

## For the AI · Para la IA

You are the crew; the person is the director. They should never need to know what a canvas, a sprite or a frame rate is. Speak the person's language (Spanish or English) and put on-screen text in that language. Work in five steps and do not skip the story sheet.
*ES: Tu eres el equipo; la persona dirige. Habla su idioma. Cinco pasos; no te saltes la hoja de historia.*

### Step 1 · Interview · Entrevista

If the person already pasted a complete brief (format, scenes, character, actions), skip to Step 2. If they said "surprise me", ask only step 1 and a one-sentence idea, and draft the rest.
Otherwise ask **one step per message**, with 2-4 short options plus **"You decide / Tu decides"**. Never use technical words. Draft and let them react: people are better at editing than at inventing from zero.

1. **Format / Formato:** Horizontal 16:9 (YouTube, slides) · Vertical 9:16 (stories, reels) · Square 1:1 (feed). Length: ~10 s (one idea) · ~15-20 s (a little story).
2. **Idea / Idea:** "In one sentence: who is it about and what happens?" / "En una frase: de quien trata y que pasa?". If they hesitate, offer three different directions (a useful one, a playful one, a strange one) and let them pick.
3. **Character / Personaje:** who (person, animal, robot, object with a face) · hair (short, long, spiky, bun, curly, cap, bald) · colours of hair, skin, top, trousers · one or two details (glasses, bag, scarf, headphones, tie) · name (optional).
4. **Scenes / Escenas:** propose 3-5 scenes, one line each (where + what happens + the one moment not to miss). Ask them to edit. Good shapes: idea -> try -> problem -> win; setup -> surprise -> payoff; before -> after.
5. **Feel / Sensacion:** pace (calm, bouncy, frantic) · short words on screen (max ~6 per screen) · final message · sound (music + effects, effects only, none).

Known characters or brand mascots (Mario, Pikachu, Mickey...) can't be drawn: offer an original with a similar spirit.

### Step 2 · Story sheet · Hoja de historia

Write it in this shape and get a "yes" (or edits) before building:

```
PROJECT / PROYECTO: <TITLE>
FORMAT / FORMATO: <16:9 | 9:16 | 1:1> · <N> s · <loop | ends>
LOOK / ESTILO: 2D flat pixel art, 8/16-bit, <palette in 2-4 colour words>
CHARACTER / PERSONAJE: <name> - <look> - <details> - <personality in 3 words>
CONCEPT / CONCEPTO: <one sentence>
SCENE 1 - <NAME>   0:00-0:0X   <calm|build|tension|triumph>
  Setting / Lugar: ...
  Action / Accion: <1-3 plain verbs, in order>
  Moment / Momento: <the one thing not to miss>
  On screen / En pantalla: "<text>"
  Sound / Sonido: <effects>
SCENE 2 ...
FINAL MESSAGE / MENSAJE FINAL: "<text>"
```

### Step 3 · Build · Construir

**Copy the CORE at the end of this file exactly, as one `.html` file. Edit only section 1 (CONFIG) and section 3 (WORLD).** Replace the demo in section 3 with the story. Do not rewrite sections 2 and 4: they are tested (player, font, character, sound, export).

Rules for section 3:
- **Everything comes from time.** Each scene is `function sceneN(ctx, s)` where `s` is seconds since the scene started. Compute positions from `s` (`lerp`, `seg`, `arc`, `easeOut`...). Never keep state between frames, never use `Math.random()` or clocks: use `rnd(i, seed)`.
- **Timeline:** `SCENES` must cover 0..duration with no gaps; put boundaries on half-seconds (music is 120 BPM). 3-5 s per scene reads well. `CUTS` lists the boundaries that get a dissolve; leave one out for a continuous shot. `mood` picks the music: `calm`, `build`, `tension`, `triumph`.
- **Layout:** place things relative to `W`, `H` and a floor line, so every format works. Vertical: make the action go up and use `size: 2` for the character.
- **Character:** `Object.assign(HERO, { hairStyle, hair, skin, shirt, pants, shoes, accent, accessories, size })`, then `drawHero(ctx, x, y, pose, dir)` with feet at `(x, y)`. Poses: `idle run_1 run_2 walk_1 walk_2 jump carry catch celebrate lookup wipe freeze point think wave_1 wave_2 sit talk_1 talk_2`. Alternate two poses with `runFrame(s, rate, 'run_')`. It returns anchors: `hand` (for held objects), `top` (for bubbles, stars), `center`. Second character: `drawHero(ctx, x, y, pose, dir, { ...HERO, hair: '#222', shirt: '#3d8bff' })`.
- **Non-human characters** (animal, robot, object): write a part list `[[x, y, w, h, 'colorKey'], ...]` with feet at (0,0) and face toward +x, draw it with `drawSprite(ctx, x, y, parts, dir, size, { colorKey: '#hex' })`; give it an idle bob and a 2-frame move.
- **Motion recipe:** anticipation -> action -> reaction (crouch/pause 0.2 s, move, land). Hold key poses >= 0.4 s. Jumps: `y = floor - arc(p, height)`. Impacts: `drawSparks(ctx, x, y, s - hitTime, seed)`. Nothing important stays perfectly still (blink, bob, flicker with `Math.floor(s * k) % 2`).
- **Text:** the pixel font is uppercase: A-Z, 0-9, basic punctuation, Spanish accents (A E I O U N with marks, ¿ ¡), and the symbols → ♥ ★. Big titles `scale: 3`, labels `scale: 1`. Use `drawBubble(ctx, x, y, 'TEXT', s, startTime)` for speech with typewriter.
- **Sound:** `SOUND_CUES = [[time, 'name'], ...]` in seconds from the start of the film. Names: `step jump land coin pop whoosh bell powerup crash type blip alarm sparkle launch`. One cue per visible impact; derive the times from the same numbers as the motion.
- **Names:** don't reuse core names for your own things (`W H DUR PAL R disc line mix rnd seg arc lerp drawText drawHero drawSprite HERO SCENES Sound CONFIG`...). Prefix your helpers (`drawDesk`, `S2_PATH`).
- **Quality bar:** clear storytelling (a stranger with sound off can tell what happens in each scene), big readable silhouettes (hero never lost against the background), fun micro-animation, visual rhythm, bright contrast, one idea per scene.

Core API cheat sheet: `R(ctx,x,y,w,h,color)` rectangle · `disc(ctx,cx,cy,r,color)` · `line(ctx,x0,y0,x1,y1,color)` · `drawText(ctx,str,x,y,color,{scale,align,outline,shadow})` · `typed(str,s,t0,cps)` · `drawBubble` · `drawSparks` · `drawSprite` · `drawHero` · `runFrame` · `mix(colorA,colorB,p)` · `PAL.ink/white/cream/yellow/orange/red/blue/green/teal/pink/purple/sky/steel/night` · `clamp lerp seg easeOut easeInOut easeBack arc mod rnd`.

### Step 4 · Self-check · Revision

Before delivering, check each item. If you can run code, render a few moments (for example 20%, 50% and 85% of each scene) and look at them.
- [ ] Only sections 1 and 3 changed; the file opens without errors.
- [ ] Scenes cover 0..duration with no gaps; every scene function exists.
- [ ] No `Math.random`, `Date.now` or state that grows between frames; scrubbing back gives the same picture.
- [ ] The hero is readable in every scene (outline visible, contrasting background, not hidden behind objects).
- [ ] All text fits inside the frame, is spelled right and uses only supported characters.
- [ ] Each scene tells its moment; the final message appears.
- [ ] Sound cues are within the film and use listed names.
*ES: revisa esta lista antes de entregar; si puedes ejecutar codigo, mira algunos cuadros.*

### Step 5 · Deliver · Entregar

- If you can show HTML (artifact, canvas, preview), show it. Otherwise give the complete file and say: *save it as `my-film.html` and open it in Chrome, Edge or Safari*.
- Tell the person, in plain words: the film plays by itself; **Sound** turns on music and effects (browsers need a click first); **Export video** records one full pass with sound (keep the tab open) and downloads an MP4 (Chrome, Edge, Safari) or WebM (Firefox). Some chat previews block downloads: open the saved file in a normal browser tab.
- Be honest: you can't hear the sound; ask them to listen once.

### Step 6 · Changes · Cambios

Invite notes like a director would give them ("make her jump higher", "scene 3 is slow", "more pink", "add a dog"). Make the smallest change, re-check, return the full file, and say in one sentence what changed.

## Limits · Limites

Flat pixel art only (no realism, no 3D). Short films (up to ~30 s). No copyrighted characters or logos. The AI can't hear the music; you can.
*ES: Solo pixel art plano (sin realismo ni 3D). Peliculas cortas. Sin personajes con derechos. La IA no escucha la musica; tu si.*

---

## THE CORE · EL NUCLEO

Copy everything below into one `.html` file. Edit only sections 1 and 3. The demo in section 3 is a 12-second example to replace.

```html
<!doctype html>
<html lang="es">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pixel World</title>
<style>
  :root { --bg: #120f24; --panel: #1d1838; --edge: #3a3266; --text: #f3e4c4; --muted: #958cbb; --accent: #ffd23f; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 13px/1.4 ui-monospace, Menlo, Consolas, monospace; }
  main { max-width: 960px; margin: 0 auto; padding: 18px; }
  h1 { font-size: 20px; margin: 0 0 12px; }
  canvas { display: block; width: 100%; height: auto; image-rendering: pixelated; border: 3px solid var(--edge); background: #000; }
  .bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 10px; }
  button { font: inherit; font-weight: 700; color: var(--text); background: var(--panel); border: 2px solid var(--edge); padding: 8px 12px; cursor: pointer; }
  button.on { background: var(--accent); color: #120f24; border-color: var(--accent); }
  input[type=range] { flex: 1; min-width: 140px; accent-color: var(--accent); }
  #msg, #time { color: var(--muted); }
</style>
<main>
  <h1 id="title"></h1>
  <canvas id="cv"></canvas>
  <div class="bar">
    <button id="play" class="on"></button><button id="reset"></button>
    <input id="scrub" type="range" min="0" step="0.01" aria-label="timeline"><span id="time"></span>
  </div>
  <div class="bar"><button id="sound"></button><button id="rec"></button><span id="msg"></span></div>
</main>
<script>
// =====================================================================================
// 1. CONFIG  (editar / edit)
// =====================================================================================
const CONFIG = {
  title: 'Mi mundo pixel',  // titulo / title
  width: 320, height: 180,  // 320x180 horizontal · 180x320 vertical · 240x240 cuadrado / square
  duration: 12,             // segundos / seconds
  loop: true,
  lang: 'es',               // 'es' | 'en' (botones / buttons)
  seed: 1,                  // cambia la musica / changes the music
};

// =====================================================================================
// 2. CORE  (no editar / do not edit). Todo es funcion del tiempo t / everything is a function of t
// =====================================================================================
const W = CONFIG.width, H = CONFIG.height, DUR = CONFIG.duration;
const PAL = { ink: '#1a1330', white: '#ffffff', cream: '#f3e4c4', yellow: '#ffd23f', orange: '#ff7a3d', red: '#ff3d5a',
  blue: '#3d8bff', green: '#4fd16b', teal: '#27c4b8', pink: '#ff6fb5', purple: '#9b5cff', sky: '#8fd3ff', steel: '#9aa0b8', night: '#0b1340' };
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const seg = (t, a, b) => clamp((t - a) / (b - a));             // 0..1 progress between a and b
const easeOut = p => 1 - (1 - p) * (1 - p), easeInOut = p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const easeBack = p => 1 + 2.9 * Math.pow(p - 1, 3) + 1.9 * Math.pow(p - 1, 2);
const arc = (p, h) => 4 * h * p * (1 - p);                     // jump height at progress p
const mod = (a, n) => ((a % n) + n) % n;
function rnd(i, seed = 0) { let n = Math.imul(i + 1, 374761393) ^ Math.imul(seed + 7, 668265263); n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; } // seeded 0..1
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, p) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], p)).toString(16).padStart(2, '0')).join('');
function R(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
function disc(ctx, cx, cy, r, c) { ctx.fillStyle = c; for (let dy = -r; dy <= r; dy++) { const w = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.8)); ctx.fillRect(Math.round(cx) - w, Math.round(cy) + dy, w * 2 + 1, 1); } }
function line(ctx, x0, y0, x1, y1, c) { ctx.fillStyle = c; const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; for (let i = 0; i <= n; i++) ctx.fillRect(Math.round(lerp(x0, x1, n ? i / n : 0)), Math.round(lerp(y0, y1, n ? i / n : 0)), 1, 1); }

// ---- 3x5 pixel font (uppercase; acentos / accents ÁÉÍÓÚÑÜ ¿¡ ok) ----
const FONT = { A: '111101111101101', B: '110101110101110', C: '111100100100111', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '111100101101111', H: '101101111101101', I: '111010010010111', J: '001001001101111', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '111101101101111', P: '111101111100100', Q: '111101101111001', R: '111101110101101', S: '111100111001111', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001010010', 8: '111101111101111', 9: '111101111001111',
  '.': '000000000000010', ',': '000000000010100', '!': '010010010000010', '?': '111001011000010', '-': '000000111000000', ':': '000010000010000', '/': '001001010100100', "'": '010010000000000', '"': '101101000000000', '(': '010100100100010', ')': '010001001001010', '+': '000010111010000', '=': '000111000111000', '#': '101111101111101', '%': '101001010100101', '<': '001010100010001', '>': '100010001010100', '@': '0111010001101111011001111', ' ': '000000000000000', '¡': '010000010010010', '¿': '010000010100111', '→': '0010000010111110001000100', '♥': '0101011111111110111000100', '★': '0010001110111110111001010' };
const ACCENT = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N', 'Ü': 'U' };
const glyph = ch => { const u = ch.toUpperCase(); return FONT[u] || FONT[ACCENT[u]] || FONT[' ']; };
function textWidth(str, s = 1) { let w = 0; for (const ch of str) w += (glyph(ch).length / 5 + 1) * s; return w - s; }
function rawText(ctx, str, x, y, s) {
  for (const ch of str) {
    const g = glyph(ch), gw = g.length / 5, u = ch.toUpperCase();
    for (let r = 0; r < 5; r++) for (let c = 0; c < gw; c++) if (g[r * gw + c] === '1') ctx.fillRect(x + c * s, y + r * s, s, s);
    if (u === 'Ñ') ctx.fillRect(x, y - 2 * s, 3 * s, s); else if (u === 'Ü') { ctx.fillRect(x, y - 2 * s, s, s); ctx.fillRect(x + 2 * s, y - 2 * s, s, s); }
    else if (ACCENT[u]) { ctx.fillRect(x + 2 * s, y - 2 * s, s, s); ctx.fillRect(x + s, y - s, s, s); }
    x += (gw + 1) * s;
  }
}
// opts: { scale, align: 'left'|'center'|'right', outline: color, shadow: color }
function drawText(ctx, str, x, y, color, o = {}) {
  const s = o.scale || 1, w = textWidth(str, s);
  x = Math.round(o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x); y = Math.round(y);
  if (o.shadow) { ctx.fillStyle = o.shadow; rawText(ctx, str, x, y + s, s); }
  if (o.outline) { ctx.fillStyle = o.outline; for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) rawText(ctx, str, x + dx, y + dy, s); }
  ctx.fillStyle = color; rawText(ctx, str, x, y, s);
}
const typed = (str, t, t0, cps = 18) => str.slice(0, clamp(Math.floor((t - t0) * cps), 0, str.length)); // typewriter
function drawBubble(ctx, x, y, text, t, t0) {
  const w = textWidth(text) + 10;
  R(ctx, x - 1, y - 1, w + 2, 15, PAL.ink); R(ctx, x, y, w, 13, PAL.white); R(ctx, x - 4, y + 13, 5, 3, PAL.ink); R(ctx, x - 3, y + 13, 3, 1, PAL.white);
  drawText(ctx, t === undefined ? text : typed(text, t, t0), x + 5, y + 4, PAL.ink);
}
function drawSparks(ctx, x, y, age, seed, n = 10, dur = 0.45) {        // burst after an event: age = t - eventTime
  if (age < 0 || age > dur) return;
  const p = age / dur;
  for (let i = 0; i < n; i++) { const a = rnd(i, seed) * 6.283, d = easeOut(p) * (10 + rnd(i, seed + 1) * 18); R(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, p < 0.5 ? 2 : 1, p < 0.5 ? 2 : 1, [PAL.white, PAL.yellow, PAL.orange][i % 3]); }
}

// ---- sprites: parts are [x, y, w, h, colorKey, outline?]; feet at (0,0), face toward +x ----
function drawSprite(ctx, X, Y, parts, dir = 1, s = 1, look = {}) {
  X = Math.round(X); Y = Math.round(Y);
  const px = (x, w) => (dir === 1 ? X + x * s : X - (x + w) * s), col = c => look[c] || PAL[c] || c, o = Math.max(1, Math.round(s / 2));
  ctx.fillStyle = PAL.ink;
  for (const p of parts) if (p[5] !== 0) ctx.fillRect(px(p[0], p[2]) - o, Y + p[1] * s - o, p[2] * s + 2 * o, p[3] * s + 2 * o);
  for (const p of parts) { ctx.fillStyle = col(p[4]); ctx.fillRect(px(p[0], p[2]), Y + p[1] * s, p[2] * s, p[3] * s); }
}
const LEGS = { stand: [[-3, -4, 2, 3, 'pants'], [0, -4, 2, 3, 'pants'], [-3, -1, 3, 1, 'shoe'], [0, -1, 3, 1, 'shoe']], run1: [[-4, -4, 2, 2, 'pants'], [-5, -2, 2, 1, 'pants'], [-6, -1, 3, 1, 'shoe'], [1, -4, 2, 2, 'pants'], [2, -2, 2, 1, 'pants'], [2, -1, 3, 1, 'shoe']], run2: [[-1, -4, 2, 3, 'pants'], [-1, -1, 3, 1, 'shoe'], [-3, -4, 2, 2, 'pants'], [-5, -3, 3, 1, 'shoe']], tuck: [[-3, -4, 2, 1, 'pants'], [-3, -3, 3, 1, 'shoe'], [1, -4, 2, 1, 'pants'], [1, -3, 3, 1, 'shoe']], lunge: [[-4, -4, 2, 2, 'pants'], [-5, -2, 2, 1, 'pants'], [-6, -1, 3, 1, 'shoe'], [1, -4, 2, 3, 'pants'], [1, -1, 3, 1, 'shoe']], sit: [[-3, -4, 6, 2, 'pants'], [2, -2, 2, 1, 'pants'], [2, -1, 3, 1, 'shoe']] };
const ARMS = { down: { f: [[1, -11, 2, 4, 'sleeve'], [1, -7, 2, 1, 'skin']], h: [2, -7] }, swing1: { b: [[-5, -11, 2, 2, 'sleeve'], [-6, -10, 1, 2, 'skin']], f: [[2, -11, 3, 2, 'sleeve'], [5, -11, 1, 2, 'skin']], h: [5, -10] }, swing2: { f: [[0, -11, 2, 4, 'sleeve'], [-1, -7, 2, 1, 'skin']], h: [0, -7] }, up: { b: [[-5, -15, 2, 4, 'sleeve'], [-5, -16, 2, 1, 'skin']], f: [[2, -15, 2, 4, 'sleeve'], [2, -16, 2, 1, 'skin']], h: [3, -16] }, carry: { b: [[-5, -19, 2, 8, 'sleeve'], [-5, -20, 2, 1, 'skin']], f: [[4, -19, 2, 8, 'sleeve'], [4, -20, 2, 1, 'skin']], h: [0, -21] }, reach: { b: [[-5, -11, 2, 2, 'sleeve']], f: [[2, -11, 4, 2, 'sleeve'], [6, -11, 1, 2, 'skin']], h: [6, -10] }, v: { b: [[-6, -17, 2, 5, 'sleeve'], [-6, -18, 2, 1, 'skin']], f: [[4, -17, 2, 5, 'sleeve'], [4, -18, 2, 1, 'skin']], h: [4, -18] }, wipe: { f: [[2, -14, 2, 3, 'sleeve'], [1, -17, 3, 2, 'skinDk']], h: [2, -17] }, out: { b: [[-5, -12, 2, 2, 'sleeve'], [-6, -13, 1, 2, 'skin']], f: [[3, -12, 2, 2, 'sleeve'], [5, -13, 1, 2, 'skin']], h: [5, -13] }, point: { f: [[2, -12, 5, 2, 'sleeve'], [7, -12, 2, 1, 'skin']], h: [8, -12] }, think: { f: [[1, -12, 2, 3, 'sleeve'], [2, -15, 2, 3, 'skin']], h: [3, -15] }, wave1: { f: [[2, -15, 2, 4, 'sleeve'], [2, -17, 2, 2, 'skin']], h: [3, -17] }, wave2: { f: [[3, -15, 2, 4, 'sleeve'], [4, -17, 2, 2, 'skin']], h: [5, -17] } };
const POSES = { idle: ['stand', 'down'], run_1: ['run1', 'swing1', -1], run_2: ['run2', 'swing2'], walk_1: ['run2', 'swing2'], walk_2: ['stand', 'down'], jump: ['tuck', 'up'], carry: ['stand', 'carry'], catch: ['lunge', 'reach', -1], celebrate: ['stand', 'v', 0, 'open'], lookup: ['stand', 'down', 0, '', 'up'], wipe: ['stand', 'wipe'], freeze: ['stand', 'out', 0, 'o'], point: ['stand', 'point'], think: ['stand', 'think'], wave_1: ['stand', 'wave1', 0, 'open'], wave_2: ['stand', 'wave2', 0, 'open'], sit: ['sit', 'down', 2], talk_1: ['stand', 'down', 0, 'open'], talk_2: ['stand', 'down'] };
const HAIR = { short: [[-3, -20, 7, 2, 'hair'], [-4, -19, 2, 5, 'hair'], [1, -21, 2, 1, 'hair']], long: [[-3, -20, 7, 2, 'hair'], [-4, -19, 2, 9, 'hair']], spiky: [[-3, -20, 7, 2, 'hair'], [-4, -19, 2, 4, 'hair'], [-2, -22, 1, 2, 'hair'], [0, -23, 1, 3, 'hair'], [2, -22, 1, 2, 'hair']], bun: [[-3, -20, 7, 2, 'hair'], [-4, -19, 2, 4, 'hair'], [-3, -23, 3, 3, 'hair']], curly: [[-4, -21, 9, 3, 'hair'], [-5, -19, 3, 5, 'hair']], cap: [[-3, -21, 7, 2, 'accent'], [3, -20, 3, 1, 'accent'], [-4, -19, 2, 3, 'hair']], bald: [] };
// the default character; change it in section 3 with Object.assign(HERO, {...})
const HERO = { skin: '#f4c39a', hair: '#7a4524', hairStyle: 'short', shirt: '#f9f0da', pants: '#343a66', shoes: '#1a1330', accent: '#2f9c95', accessories: ['glasses', 'bag'], size: 1 };
// draws a character with feet at (x, y); dir 1 right, -1 left; returns anchors { hand: [x, y], top, center: [x, y] }
function drawHero(ctx, x, y, pose = 'idle', dir = 1, hero = HERO, size = hero.size || 1) {
  const [lg, am, bob = 0, mouth = '', head = ''] = POSES[pose] || POSES.idle, A = ARMS[am], acc = new Set(hero.accessories || []);
  const sh = p => [p[0], p[1] + bob, p[2], p[3], p[4], p[5]], up = head === 'up' ? -1 : 0;
  const look = { skin: hero.skin, skinDk: mix(hero.skin, '#8a3a2a', 0.22), hair: hero.hair, shirt: hero.shirt, sleeve: mix(hero.shirt, PAL.ink, 0.12), pants: hero.pants, shoe: hero.shoes, accent: hero.accent, glass: '#bfe8ff', mouth: '#7a2a2a' };
  const parts = [...(A.b || []).map(sh), ...(acc.has('bag') ? [sh([-6, -9, 3, 4, 'accent'])] : []), ...LEGS[lg].map(p => (lg === 'sit' ? sh(p) : p)), [-3, -6 + bob, 6, 2, 'pants'], sh([-3, -12, 6, 6, 'shirt']), ...(A.f || []).map(sh), sh([-3, -19, 7, 7, 'skin']), ...(HAIR[hero.hairStyle] || HAIR.short).map(sh), ...(acc.has('headphones') ? [sh([-3, -22, 7, 1, 'ink']), sh([-4, -18, 2, 4, 'accent'])] : [])];
  const feat = [...(acc.has('scarf') ? [[-3, -12, 6, 2, 'accent', 0]] : []), ...(acc.has('tie') ? [[1, -12, 1, 4, 'accent', 0]] : []),
    ...(acc.has('glasses') ? [[0, -16 + up, 4, 1, 'ink', 0], [0, -16 + up, 1, 1, 'glass', 0], [2, -16 + up, 1, 1, 'glass', 0]] : [[1, -16 + up, 1, 1, 'ink', 0], [3, -16 + up, 1, 1, 'ink', 0]]),
    ...(up ? [] : [mouth === 'open' ? [1, -14, 2, 2, 'mouth', 0] : mouth === 'o' ? [2, -14, 1, 2, 'mouth', 0] : [2, -14, 1, 1, 'mouth', 0]])].map(sh);
  drawSprite(ctx, x, y, parts, dir, size, look); drawSprite(ctx, x, y, feat, dir, size, look);
  const hx = dir === 1 ? x + A.h[0] * size : x - (A.h[0] + 1) * size;
  return { hand: [Math.round(hx), Math.round(y + (A.h[1] + bob) * size)], top: Math.round(y + (bob - 21) * size), center: [Math.round(x), Math.round(y + (bob - 10) * size)] };
}
const runFrame = (t, rate = 10, prefix = 'run_') => prefix + (Math.floor(t * rate) % 2 ? '2' : '1'); // alternating frames
function drawCover(ctx, p, color = PAL.ink) {                         // block dissolve 0..1
  if (p <= 0) return; const B = 10; ctx.fillStyle = color;
  for (let by = 0; by < H / B; by++) for (let bx = 0; bx < W / B; bx++) { const s = Math.round(clamp(p * 2 - (bx + by) / (W / B + H / B)) * B / 2) * 2; if (s > 0) ctx.fillRect(bx * B + (B - s) / 2, by * B + (B - s) / 2, s, s); }
}

// ---- sound: music from each scene's mood + effects from SOUND_CUES (Web Audio, no files) ----
const Sound = (() => {
  const BEAT = 0.5, EV = [], mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  let ac = null, master, out = null, on = false, anchor = null, schedTo = 0;
  const live = new Set();
  const tone = (t, f, d, type, v, f2) => EV.push({ t, f, d, type, v, f2 }), noise = (t, d, v, hp = 4000) => EV.push({ t, d, v, hp, noise: true });
  const FX = { step: t => noise(t, 0.04, 0.08, 2500), jump: t => tone(t, 330, 0.14, 'square', 0.06, 880), land: t => tone(t, 150, 0.1, 'sine', 0.3, 55), coin: t => { tone(t, 988, 0.06, 'square', 0.06); tone(t + 0.06, 1319, 0.16, 'square', 0.06); }, pop: t => tone(t, 900, 0.09, 'square', 0.06, 200), whoosh: t => noise(t, 0.25, 0.12, 900), bell: t => tone(t, 1568, 0.6, 'sine', 0.12), powerup: t => [72, 76, 79, 84].forEach((m, k) => tone(t + k * 0.06, mtof(m), 0.12, 'square', 0.05)), crash: t => { noise(t, 0.35, 0.25, 300); tone(t, 110, 0.3, 'square', 0.06); }, type: t => { for (let k = 0; k < 8; k++) noise(t + k * 0.055, 0.015, 0.05, 4500); }, blip: t => tone(t, 880, 0.04, 'square', 0.04), alarm: t => [0, 0.25].forEach(d => { tone(t + d, 880, 0.12, 'square', 0.05); tone(t + d + 0.13, 660, 0.12, 'square', 0.05); }), sparkle: t => [96, 100, 103].forEach((m, k) => tone(t + k * 0.04, mtof(m), 0.1, 'triangle', 0.05)), launch: t => { noise(t, 1.1, 0.2, 400); tone(t, 80, 1.1, 'sawtooth', 0.03, 420); } };
  function compose() {
    const root = 57 + (CONFIG.seed * 5) % 12;
    const MOOD = { calm: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]], build: [[9, 12, 16], [5, 9, 12], [0, 4, 7], [7, 11, 14]], tension: [[0, 3, 7], [1, 4, 8]], triumph: [[5, 9, 12], [7, 11, 14], [0, 4, 7], [0, 4, 7]] };
    (typeof SCENES !== 'undefined' ? SCENES : []).forEach(sc => {
      const prog = MOOD[sc.mood] || MOOD.build, drums = sc.mood !== 'calm';
      for (let t = sc.start, k = 0; t < sc.end - 0.01; t += BEAT, k++) {
        const ch = prog[Math.floor(k / 2) % prog.length];
        tone(t, mtof(root - 12 + ch[0]), BEAT * 0.8, 'triangle', 0.18);
        ch.concat(ch[0] + 12).forEach((iv, j) => j < 2 && tone(t + j * BEAT / 2, mtof(root + 12 + ch[(k + j) % 3]), BEAT * 0.4, 'square', 0.025));
        if (drums) { if (k % 2 === 0) tone(t, 140, 0.12, 'sine', 0.35, 45); else noise(t, 0.1, 0.12, 1800); noise(t + BEAT / 2, 0.03, 0.04, 7000); }
      }
    });
    (typeof SOUND_CUES !== 'undefined' ? SOUND_CUES : []).forEach(([t, name]) => FX[name] && FX[name](t));
    EV.sort((a, b) => a.t - b.t);
  }
  function play(e, when) {
    const g = ac.createGain(); g.gain.setValueAtTime(e.v, when); g.gain.exponentialRampToValueAtTime(0.0001, when + e.d); g.connect(master);
    let src;
    if (e.noise) { src = ac.createBufferSource(); const b = ac.createBuffer(1, ac.sampleRate * e.d + 1, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd(i, 3) * 2 - 1; src.buffer = b; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = e.hp; src.connect(f); f.connect(g); }
    else { src = ac.createOscillator(); src.type = e.type; src.frequency.setValueAtTime(e.f, when); if (e.f2) src.frequency.exponentialRampToValueAtTime(e.f2, when + e.d); src.connect(g); }
    src.start(when); src.stop(when + e.d + 0.02); live.add(src); src.onended = () => live.delete(src);
  }
  const stopAll = () => { live.forEach(s => { try { s.stop(); } catch (err) {} }); live.clear(); anchor = null; };
  return {
    get on() { return on; },
    async enable() { if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.6; master.connect(ac.destination); compose(); } await ac.resume(); on = true; anchor = null; },
    disable() { on = false; stopAll(); if (ac) ac.suspend(); },
    time() { return on && anchor !== null ? mod(ac.currentTime - anchor, DUR) : null; },
    update(t, playing) {
      if (!on) return; if (!playing) { if (anchor !== null) stopAll(); return; }
      if (anchor === null) { anchor = ac.currentTime - t; schedTo = t; }
      const T = ac.currentTime - anchor;
      for (; schedTo < T + 0.15; schedTo += 0.05) { const a = schedTo, b = schedTo + 0.05; for (const e of EV) { const k = Math.floor(a / DUR), et = k * DUR + e.t; if (et >= a && et < b && anchor + et >= ac.currentTime) play(e, anchor + et); } }
    },
    resync() { if (anchor !== null) stopAll(); },
    stream() { if (!ac) return null; if (!out) { out = ac.createMediaStreamDestination(); master.connect(out); } return out.stream; },
  };
})();

// =====================================================================================
// 3. MUNDO / WORLD  (editar / edit): personaje, escenas, sonidos / character, scenes, sounds
// =====================================================================================
Object.assign(HERO, { hairStyle: 'spiky', hair: '#2a1a14', shirt: '#ff6fb5', accent: '#27c4b8', accessories: ['glasses', 'scarf'], size: 2 });
const FLOOR = H - 30;
function ground(ctx, t) {
  R(ctx, 0, 0, W, H, PAL.sky);
  for (let i = 0; i < 3; i++) { const cx = mod(60 + i * 110 - t * 6, W + 60) - 30; disc(ctx, cx, 30 + i * 12, 6, PAL.white); disc(ctx, cx + 9, 28 + i * 12, 7, PAL.white); }
  R(ctx, 0, FLOOR, W, H - FLOOR, PAL.green); R(ctx, 0, FLOOR, W, 1, PAL.ink);
  for (let i = 0; i < 20; i++) R(ctx, rnd(i, 5) * W, FLOOR + 3 + rnd(i, 6) * 20, 2, 1, '#2f9c55');
}
// SCENE 1 - LA IDEA / THE IDEA (0-4 s)
function scene1(ctx, s) {
  ground(ctx, s);
  const a = drawHero(ctx, 110, FLOOR, s < 1 ? 'idle' : s < 3.2 ? 'lookup' : 'celebrate', 1);
  if (s > 1) { const p = easeBack(seg(s, 1, 1.3)); drawText(ctx, '★', 116, a.top - 16 - p * 6, PAL.yellow, { scale: 3, align: 'center', outline: PAL.ink }); }
  drawSparks(ctx, 116, a.top - 12, s - 1.1, 3);
  if (s > 1.6 && s < 3.8) drawBubble(ctx, 132, a.top - 30, '¿Y SI...?', s, 1.7);
}
// SCENE 2 - EL VIAJE / THE JOURNEY (4-8 s)
function scene2(ctx, s) {
  ground(ctx, s + 4);
  R(ctx, 170, FLOOR - 8, 16, 8, '#8a5a3c'); R(ctx, 170, FLOOR - 8, 16, 1, PAL.ink);
  let x, y = FLOOR, pose;
  if (s < 1.6) { x = lerp(-20, 150, s / 1.6); pose = runFrame(s); }
  else if (s < 2.1) { const p = seg(s, 1.6, 2.1); x = lerp(150, 206, p); y = FLOOR - arc(p, 26); pose = 'jump'; }
  else { x = lerp(206, 250, seg(s, 2.1, 3)); pose = s < 3 ? runFrame(s) : 'point'; }
  drawHero(ctx, x, y, pose, 1);
  if (s > 3.1) drawText(ctx, '¡AHÍ!', 290, FLOOR - 50, PAL.white, { scale: 2, align: 'center', outline: PAL.ink });
}
// SCENE 3 - EL LOGRO / THE WIN (8-12 s)
function scene3(ctx, s) {
  ground(ctx, s + 8);
  const hop = arc(mod(s, 0.5) / 0.5, 4);
  drawHero(ctx, W / 2, FLOOR - hop, 'celebrate', 1);
  drawSparks(ctx, W / 2, FLOOR - 50, s - 0.3, 9, 16, 0.6);
  if (s > 0.6) drawText(ctx, '¡LO LOGRÉ!', W / 2, 26, PAL.white, { scale: 3, align: 'center', shadow: PAL.ink });
}
// the timeline: scenes cover 0..duration with no gaps; mood picks the music (calm | build | tension | triumph)
const SCENES = [
  { name: 'Idea', start: 0, end: 4, draw: scene1, mood: 'calm' },
  { name: 'Viaje', start: 4, end: 8, draw: scene2, mood: 'build' },
  { name: 'Logro', start: 8, end: 12, draw: scene3, mood: 'triumph' },
];
const CUTS = [4, 8];                                                  // dissolve between these scenes
// sound effects: [time, name] · names: step jump land coin pop whoosh bell powerup crash type blip alarm sparkle launch
const SOUND_CUES = [[1, 'bell'], [1.1, 'sparkle'], [1.7, 'type'], [4.2, 'step'], [4.6, 'step'], [5, 'step'], [5.6, 'jump'], [6.1, 'land'], [7.1, 'coin'], [8.3, 'powerup']];

// =====================================================================================
// 4. PLAYER  (no editar / do not edit)
// =====================================================================================
function drawScene(ctx, t) {
  t = mod(t, DUR);
  R(ctx, 0, 0, W, H, PAL.ink);
  const sc = SCENES.find(s => t < s.end) || SCENES[SCENES.length - 1];
  ctx.save(); sc.draw(ctx, t - sc.start); ctx.restore(); ctx.globalAlpha = 1;
  const TR = 0.3, cuts = CONFIG.loop ? [0, ...CUTS, DUR] : CUTS;
  for (const b of cuts) { if (t > b - TR && t <= b && b > 0) drawCover(ctx, (t - (b - TR)) / TR); if (t >= b && t < b + TR && b < DUR) drawCover(ctx, 1 - (t - b) / TR); }
}
(() => {
  const L = CONFIG.lang === 'en' ? { play: 'Play', pause: 'Pause', reset: 'Reset', son: 'Sound: on', soff: 'Sound: off', rec: 'Export video', recing: 'Recording... keep this tab open', saved: 'Downloaded' } : { play: 'Reproducir', pause: 'Pausa', reset: 'Reiniciar', son: 'Sonido: sí', soff: 'Sonido: no', rec: 'Exportar video', recing: 'Grabando... deja esta pestaña abierta', saved: 'Descargado' };
  const $ = id => document.getElementById(id), cv = $('cv'), cx = cv.getContext('2d');
  const buf = document.createElement('canvas'); buf.width = W; buf.height = H; const bx = buf.getContext('2d');
  document.title = CONFIG.title; $('title').textContent = CONFIG.title; $('reset').textContent = L.reset; $('sound').textContent = L.soff; $('rec').textContent = L.rec;
  cv.width = W * 4; cv.height = H * 4; cv.style.maxWidth = W >= H ? '100%' : Math.round(80 * W / H) + 'vh'; cv.style.margin = '0 auto';
  $('scrub').max = DUR;
  let t = 0.35, playing = true, last = null, rec = null, prev = 0;
  const render = () => { drawScene(bx, t); cx.imageSmoothingEnabled = false; cx.drawImage(buf, 0, 0, cv.width, cv.height); $('scrub').value = t; $('time').textContent = t.toFixed(2) + ' / ' + DUR; $('play').textContent = playing ? L.pause : L.play; };
  function loop(now) {
    prev = t;
    if (playing) { const at = Sound.time(); t = at !== null ? at : mod(t + (last === null ? 0 : Math.min(0.1, (now - last) / 1000)), DUR); last = now; } else last = null;
    if (!CONFIG.loop && !rec && t < prev && playing) { t = DUR - 0.01; playing = false; }
    Sound.update(t, playing); render();
    if (rec && t < prev && prev > DUR / 2) rec.stop();
    requestAnimationFrame(loop);
  }
  $('play').onclick = () => { playing = !playing; Sound.resync(); };
  $('reset').onclick = () => { t = 0.35; Sound.resync(); };
  $('scrub').oninput = e => { t = +e.target.value; Sound.resync(); render(); };
  cv.onclick = () => $('play').click();
  addEventListener('keydown', e => { if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); $('play').click(); } });
  $('sound').onclick = async () => { if (Sound.on) Sound.disable(); else await Sound.enable(); $('sound').textContent = Sound.on ? L.son : L.soff; $('sound').classList.toggle('on', Sound.on); };
  $('rec').onclick = async () => {                                     // records one real-time pass (1280 wide) with sound
    if (rec || !window.MediaRecorder) return;
    try { await Sound.enable(); $('sound').textContent = L.son; } catch (err) {}
    const stream = cv.captureStream(30), a = Sound.stream(); if (a) a.getAudioTracks().forEach(tr => stream.addTrack(tr));
    const type = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m)) || ''; // MP4 H.264 first: plays everywhere
    const chunks = []; rec = new MediaRecorder(stream, type ? { mimeType: type, videoBitsPerSecond: 8e6 } : {});
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => { const blob = new Blob(chunks, { type: rec.mimeType }), ext = rec.mimeType.includes('mp4') ? 'mp4' : 'webm'; const aEl = document.createElement('a'); aEl.href = URL.createObjectURL(blob); aEl.download = CONFIG.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.' + ext; document.body.appendChild(aEl); aEl.click(); aEl.remove(); rec = null; $('msg').textContent = L.saved + ' (' + ext + ')'; };
    t = 0; playing = true; Sound.resync(); rec.start(250); $('msg').textContent = L.recing;
  };
  render(); requestAnimationFrame(loop);
})();
</script>
</html>
```
