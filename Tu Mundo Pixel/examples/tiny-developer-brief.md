# The Tiny Developer · El guion original

This is the brief that started the project. Paste it into any AI together with `SKILL.md` and it builds the film directly (the interview is skipped).
*Este es el guion que dio origen al proyecto. Pégalo en cualquier IA junto con `SKILL.md` y construye la película directamente, sin entrevista.*

## Why it works · Por qué funciona

| Part · Parte | What it does · Qué hace |
|---|---|
| **STYLE / FORMAT** | Fixes the look and the canvas before any story: 320×180, crisp scaling, no image files. · Fija el estilo y el lienzo antes de la historia. |
| **CONCEPT** | One sentence that turns an idea into a *place*: a developer living inside a desktop. The world **is** the metaphor. · Una frase que convierte la idea en un lugar: el mundo **es** la metáfora. |
| **Timed scenes** | Every scene has a start and an end, so the pacing is decided, not improvised. · Cada escena tiene inicio y fin: el ritmo está decidido. |
| **Setting + Action** | Plain verbs in order ("jumps", "grabs", "stacks", "catches"). Easy to animate, easy to read. · Verbos simples y en orden. |
| **Literal jokes** | A bug is a literal insect; deploying is a rocket. Concrete images beat abstract ideas. · Un bug es un insecto de verdad: imágenes concretas en vez de ideas abstractas. |
| **Short text** | "BUG!", "BUILDING...", "SHIP SOMETHING." Few words, big letters. · Pocas palabras, letras grandes. |
| **ANIMATION PRINCIPLE** | Everything from time `t`: the rule that makes play, pause, scrub and export possible. · Todo desde el tiempo `t`. |
| **Poses list** | Seven poses are enough for a whole story. · Siete poses alcanzan para una historia completa. |
| **Prioritize** | The quality bar in five lines: storytelling, silhouettes, micro-animation, rhythm, contrast. · La vara de calidad en cinco líneas. |

## The brief · El guion

```
PROJECT: THE TINY DEVELOPER

STYLE:
2D flat pixel art animation, 8-bit/16-bit retro aesthetic, clean vector-like pixel edges, bright and vibrant color palette.

FORMAT:
16:9 horizontal.
Approximate duration: 18 seconds.
Procedural animation rendered in HTML5 Canvas.
Virtual resolution: 320x180.
Scale cleanly to 640x360 or larger.
imageSmoothingEnabled = false.
No external image assets required.

CONCEPT:
A tiny developer lives literally inside a giant computer desktop.
He receives an idea, runs across applications, builds something, and finally launches it into the internet.
The entire animation should feel like a tiny video game world living inside a desktop computer.

SCENE 1 — THE IDEA
0:00 - 0:03
SETTING:
Inside a giant computer desktop environment.
Background: Warm cream desktop wallpaper.
Large oversized UI windows float around the environment: browser window, terminal, notes app, folder, code editor.
The tiny pixel developer stands beside a huge blinking text cursor.
CHARACTER:
Small pixel developer. Brown hair. Cream shirt. Dark trousers. Tiny glasses. Small messenger bag.
ACTION:
A bright yellow lightbulb appears above the developer.
The developer looks upward.
The lightbulb flashes twice.
A small speech bubble appears: "what if..."
The developer suddenly begins running toward the code editor.

SCENE 2 — BUILD MODE
0:03 - 0:08
SETTING:
Huge code editor occupying most of the frame.
Lines of colorful code look like giant horizontal platforms.
ACTION:
The developer jumps between code lines.
He grabs blocks labeled: HTML, CSS, JS and stacks them together like construction bricks.
Each block snaps into place.
Tiny sparks appear when blocks connect.
A progress bar begins filling across the bottom.
Text: BUILDING...
The developer wipes sweat from his forehead.

SCENE 3 — THE BUG
0:08 - 0:11
Suddenly the screen flashes red.
A literal tiny green insect crawls out of the code.
Large text: BUG!
The developer freezes.
The bug runs away.
The developer chases it across the screen.
He catches it using a small pixel butterfly net.
The red warning disappears.
Everything returns to normal.

SCENE 4 — SHIP IT
0:11 - 0:15
SETTING:
Terminal window.
Developer stands beside a giant button: DEPLOY
He jumps onto the button.
The button compresses.
Terminal text rapidly appears: BUILD COMPLETE / DEPLOYING / LIVE
A tiny rocket containing the app launches from the computer.
The developer watches from below.

SCENE 5 — INTERNET
0:15 - 0:18
SETTING:
Deep dark-blue digital space.
The tiny app rocket flies through stars made from: @ symbols, dots, tiny browser icons.
The rocket reaches a small glowing globe.
Text fades in: IDEA → CODE → INTERNET
Below: SHIP SOMETHING.
Loop smoothly back to Scene 1.

ANIMATION PRINCIPLE:
Everything must be generated from time t.
screen = drawScene(ctx, t)
The animation must support: PLAY, PAUSE, RESET, SCRUB
Any timestamp should reconstruct the same frame deterministically.
Use seeded procedural placement for decorative particles.
Keep character animation simple and readable: idle, run_1, run_2, jump, carry, catch, celebrate

Prioritize:
clear storytelling
big readable silhouettes
fun micro-animation
visual rhythm
bright color contrast
```

## Make your own · Haz el tuyo

Keep the shape, change the content. A bakery, a school, a startup, your pet: turn your idea into a place and its objects, then write 3-5 timed scenes with plain verbs.
*Mantén la forma, cambia el contenido: convierte tu idea en un lugar y sus objetos, y escribe 3-5 escenas con tiempos y verbos simples.*
