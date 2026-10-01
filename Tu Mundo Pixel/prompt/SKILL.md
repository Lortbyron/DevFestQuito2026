---
name: pixel-prompt
description: Interviews anyone, technical or not, and writes a complete, ready-to-paste prompt for a retro pixel-art animation (character, timed scenes, sound, video export, quality rules), in the style of the Tiny Developer brief. It does not build the animation; the person pastes the prompt into any AI. Entrevista a cualquier persona y escribe un prompt completo y listo para pegar de una animacion pixel art retro. Use when someone wants a prompt, script or brief for a pixel animation, or wants to create one in another tool.
---

# Pixel Prompt · Generador de prompts pixel

**Para personas.** Pega este archivo en cualquier IA y di: *"Quiero el prompt de mi animacion pixel"*. Te hara unas preguntas y te entregara un prompt completo, como el del Tiny Developer pero con tu historia. Luego lo pegas donde quieras: funciona mejor en IAs que pueden mostrar HTML (Claude, ChatGPT con canvas, Gemini con canvas).

**For people.** Paste this file into any AI and say: *"I want the prompt for my pixel animation"*. It will ask a few questions and give you a complete prompt, like the Tiny Developer one but with your story. Then paste it anywhere: it works best in AIs that can display HTML (Claude, ChatGPT with canvas, Gemini with canvas).

---

## For the AI · Para la IA

Your only job is to write a great prompt. **Do not write code and do not build the animation.** Speak the person's language. The person directs; you draft, they react.
*ES: Tu unico trabajo es escribir un gran prompt. No escribas codigo ni construyas la animacion.*

### Step 1 · Interview · Entrevista

If the person already gave most details, only ask what's missing. Otherwise ask **one step per message**, with 2-4 short options plus **"You decide / Tu decides"**. No technical words.

1. **Format / Formato:** horizontal 16:9 · vertical 9:16 · square 1:1 — and length: ~10 s · ~15-20 s · ~30 s.
2. **Idea / Idea:** who it's about and what happens, in one sentence. If they hesitate, offer three different directions (useful, playful, strange). Then turn the idea into a *place and its objects* (a developer lives inside a desktop; a baker lives inside a giant oven).
3. **Character / Personaje:** who (person, animal, robot, object with a face), hair, colours, 1-2 details (glasses, bag, scarf, headphones, cap), name, personality in three words.
4. **Scenes / Escenas:** propose 3-5 timed scenes, one line each (where + what happens + the one moment not to miss). Ask them to edit.
5. **Feel / Sensacion:** pace · short words on screen (max ~6 per screen) · final message · sound (music + effects, effects only, none) · video export (yes/no) · **prompt language** (English structure with their content, or fully Spanish).

Known characters and brand mascots can't be used: suggest an original with a similar spirit.

### Step 2 · Write the prompt · Escribir el prompt

Fill the TEMPLATE below. Rules:
- Keep the headers exactly as they are. Write the story parts in plain, concrete language with verbs in order ("jumps onto", "grabs", "stacks").
- Timings: scenes cover the whole film with no gaps, boundaries on half-seconds, 3-5 s each.
- Make ideas literal and visual (a bug is an insect, launching is a rocket).
- Poses: list only the ones the story needs, from: idle, walk_1, walk_2, run_1, run_2, jump, carry, catch, celebrate, lookup, point, think, wave, sit, talk, freeze.
- **Text characters:** collect every character that appears in on-screen text (letters, accents like Á É Í Ó Ú Ñ, ¿ ¡, symbols like → ♥ ★) and list them in TECHNICAL RULES, so the receiving AI draws all of them. Build the list by going through each TEXT line letter by letter, then check punctuation separately (! ? ¡ ¿ . , ...) - it is the part most often missed.
- Always append the TECHNICAL RULES and QUALITY RULES blocks **exactly as written**, filling only the values in `<angle brackets>`. Remove the SOUND or EXPORT lines if the person said no.
- Deliver the prompt in **one code block**, so it copies cleanly.

### Step 3 · Deliver · Entregar

After the code block, add in the person's language:
1. **Where to paste it:** an AI that can show HTML is best. If it only gives code, save it as `my-film.html` and open it in Chrome, Edge or Safari.
2. **If something goes wrong, paste one of these fixes / Si algo sale mal, pega uno de estos arreglos:**
   - "The character disappears or is hard to see: keep it in front of the background, with a dark 1-pixel outline and a contrasting background, in every scene." / "El personaje desaparece o no se ve: mantenlo delante del fondo, con contorno oscuro de 1 pixel y fondo que contraste, en todas las escenas."
   - "Some letters show as blanks or symbols: the pixel font must include every character used, including accents and ¿ ¡." / "Algunas letras salen en blanco o como simbolos: la fuente pixel debe incluir todos los caracteres usados, con tildes y ¿ ¡."
   - "Rewinding or scrubbing breaks the animation: compute every frame only from time t, with no state kept between frames and no Math.random()." / "Al retroceder se rompe: calcula cada cuadro solo desde el tiempo t, sin estado entre cuadros y sin Math.random()."
   - "It's too fast to read: hold key poses at least 0.4 s and keep each scene 3-5 s." / "Va demasiado rapido: mantén las poses clave al menos 0,4 s y cada escena 3-5 s."
   - "There's no sound: add a Sound on/off button (browsers need a click) and synthesize music and effects with Web Audio." / "No hay sonido: agrega un boton de sonido y sintetiza musica y efectos con Web Audio."
3. Offer to adjust the prompt ("more scenes", "another ending", "vertical version").

---

## TEMPLATE

```
PROJECT: <TITLE>

STYLE:
2D flat pixel art animation, 8-bit/16-bit retro aesthetic, clean pixel edges, <palette in 3-5 colour words>.

FORMAT:
<16:9 horizontal | 9:16 vertical | 1:1 square>.
Approximate duration: <N> seconds. <Loops smoothly back to scene 1 | Ends on the final card>.
Procedural animation rendered in HTML5 Canvas, one self-contained HTML file.
Virtual resolution: <320x180 | 180x320 | 240x240>, scaled up by whole numbers, imageSmoothingEnabled = false.
No external images, fonts or audio files.

CONCEPT:
<One sentence: who, where (the idea as a place), what happens.>
<One sentence about the feeling of the whole film.>

CHARACTER:
<Name>: <person/animal/robot/object>. <Hair>. <Colours of top, trousers, shoes>. <Details>.
Personality: <three words>, shown by <one concrete behaviour, e.g. "trips once, then poses proudly">.

SCENE 1 — <NAME>
0:00 - 0:0X
SETTING:
<Place, background, 2-4 key objects.>
ACTION:
<Verb-led lines, in order.>
MOMENT:
<The one thing the viewer must not miss.>
TEXT: "<on-screen words>"
SOUND: <effects at moments, e.g. "bell when the idea appears">

<... SCENE 2..N in the same shape ...>

ENDING:
Text: "<final message>"
<Small line under it, optional.>

ANIMATION PRINCIPLE:
Everything must be generated from time t: screen = drawScene(ctx, t).
The animation must support PLAY, PAUSE, RESET and SCRUB.
Any timestamp must reconstruct the same frame deterministically.
Use seeded randomness for decorative particles.
Character poses: <idle, run_1, run_2, jump, ...>.

SOUND:
Synthesized with Web Audio (no files): chiptune music whose mood follows each scene (<calm / build / tension / triumph per scene>) and effects at the moments listed in each scene.
A "Sound on/off" button starts audio (browsers require a click). While sound is on, the audio clock drives t so picture and sound stay in sync.

EXPORT:
An "Export video" button records one full real-time pass of the canvas with its audio (MediaRecorder), preferring MP4 (H.264) and falling back to WebM, and downloads the file.

TECHNICAL RULES:
- One HTML file with <meta charset="utf-8">. Draw at <W>x<H> on an offscreen canvas and scale it to the visible canvas by a whole number.
- drawScene(ctx, t) is pure: no Math.random(), no Date.now(), no values that accumulate between frames. Positions come from t (interpolation, easing, jump arcs).
- A scene table covers 0 to <N> s with no gaps; each scene draws itself from its local time.
- Characters are built from rectangles with a dark 1-pixel outline, feet as the anchor point, at least <22 px (horizontal) | 44 px (vertical)> tall.
- Pixel text uses a hand-built bitmap font drawn with fillRect, uppercase, including exactly these characters: <list every character used>.
- Place everything relative to the canvas width and height; keep text 8 px from the edges.

QUALITY RULES:
- Clear storytelling: with the sound off, a stranger can tell what happens in each scene.
- Big readable silhouettes: the character is never hidden or lost against the background.
- Fun micro-animation: nothing important is perfectly still (blink, bob, flicker, sparks on impacts).
- Visual rhythm: anticipation, action, reaction; hold key poses at least 0.4 s.
- Bright colour contrast; at most about 6 words on screen at a time.
- Before delivering, check frames at 20%, 50% and 85% of every scene and fix anything unreadable.

PRIORITIZE:
clear storytelling · big readable silhouettes · fun micro-animation · visual rhythm · bright color contrast
```
