# Ejemplo del generador · Generator example

Una entrevista corta con `prompt/SKILL.md` y este es el prompt que entrega. Se pega tal cual en cualquier IA.
*One short interview with `prompt/SKILL.md` and this is the prompt it delivers. Paste it as-is into any AI.*

**Respuestas de la entrevista / Interview answers:** vertical · ~12 s · "una panadera que manda pan al pueblo" · Rosa, moño, pañuelo rojo, delantal verde · 3 escenas · ritmo tranquilo que termina alegre · música y efectos · exportar video · prompt con estructura en inglés y contenido en español.

```
PROJECT: LA PANADERA QUE ENVÍA PAN

STYLE:
2D flat pixel art animation, 8-bit/16-bit retro aesthetic, clean pixel edges, warm sunset palette: cream, orange, magenta, gold.

FORMAT:
9:16 vertical.
Approximate duration: 12 seconds. Loops smoothly back to scene 1.
Procedural animation rendered in HTML5 Canvas, one self-contained HTML file.
Virtual resolution: 180x320, scaled up by whole numbers, imageSmoothingEnabled = false.
No external images, fonts or audio files.

CONCEPT:
Rosa, una panadera, vive en una panadería diminuta: amasa, tiene una idea y manda una caja de pan volando en globo hasta el pueblo.
Todo se siente cálido, casero y un poco mágico, como un videojuego pequeño al atardecer.

CHARACTER:
Rosa: person. Dark hair in a bun. Cream shirt, green apron-like trousers, dark shoes. Red scarf.
Personality: curiosa, rápida, orgullosa, shown by a small proud hop every time something works.

SCENE 1 — LA IDEA
0:00 - 0:04
SETTING:
Inside the bakery: striped warm wall, a window with the sunset at the top, a wooden table with dough, loaves on a shelf.
ACTION:
Rosa kneads the dough (two alternating poses).
She stops and looks up.
A yellow star pops above her head and flashes twice.
A speech bubble types: "¿Y SI...?"
MOMENT:
The star flashing above her head.
TEXT: "¿Y SI...?"
SOUND: soft clicks while kneading, bell when the star appears, typing for the bubble.

SCENE 2 — A SUBIR
0:04 - 0:08
SETTING:
The same bakery, now with three wooden shelves in a zigzag up to the window, and an oven glowing orange at the bottom left.
ACTION:
The oven pops a cardboard box with a heart; Rosa catches it.
She carries it above her head and jumps from shelf to shelf, left and right, up to the window.
At the top she lets it go: a red balloon lifts it out of the window.
MOMENT:
The box flying out of the window under the red balloon.
TEXT: "¡A VOLAR!"
SOUND: pop from the oven, coin when she catches it, a jump and a landing on each shelf, whoosh when it flies.

SCENE 3 — EL PUEBLO
0:08 - 0:12
SETTING:
Outside at sunset: sky in bands of purple, magenta and orange, a big sun, little houses with dark windows, the bakery with a striped awning at the bottom left.
ACTION:
The box crosses the sky under the balloon, dipping over each house.
Each house lights its windows and a pink heart floats up.
Rosa waves from the bakery door.
MOMENT:
The windows lighting up one by one.
TEXT: "HAZLO HOY."
SOUND: a chime for each house, sparkle at the end.

ENDING:
Text: "HAZLO HOY."
Small line under it: "UNA IDEA → UN PAN → UN PUEBLO"

ANIMATION PRINCIPLE:
Everything must be generated from time t: screen = drawScene(ctx, t).
The animation must support PLAY, PAUSE, RESET and SCRUB.
Any timestamp must reconstruct the same frame deterministically.
Use seeded randomness for decorative particles.
Character poses: idle, lookup, catch, carry, jump, celebrate, wave.

SOUND:
Synthesized with Web Audio (no files): chiptune music whose mood follows each scene (calm / build / triumph) and effects at the moments listed in each scene.
A "Sound on/off" button starts audio (browsers require a click). While sound is on, the audio clock drives t so picture and sound stay in sync.

EXPORT:
An "Export video" button records one full real-time pass of the canvas with its audio (MediaRecorder), preferring MP4 (H.264) and falling back to WebM, and downloads the file.

TECHNICAL RULES:
- One HTML file with <meta charset="utf-8">. Draw at 180x320 on an offscreen canvas and scale it to the visible canvas by a whole number.
- drawScene(ctx, t) is pure: no Math.random(), no Date.now(), no values that accumulate between frames. Positions come from t (interpolation, easing, jump arcs).
- A scene table covers 0 to 12 s with no gaps; each scene draws itself from its local time.
- Characters are built from rectangles with a dark 1-pixel outline, feet as the anchor point, at least 44 px (vertical) tall.
- Pixel text uses a hand-built bitmap font drawn with fillRect, uppercase, including exactly these characters: A B D E H I L N O P R S U V Y Z ! . ? ¡ ¿ → and space.
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
