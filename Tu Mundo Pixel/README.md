# Pixel World · Mundos pixel

**Crea tu propio personaje, tu mundo y una pequeña película en pixel art, conversando con una IA.**
**Create your own character, world and a short pixel-art film by talking to an AI.**

[Español](#español) · [English](#english)

---

## Español

### Qué es
Un solo archivo, `SKILL.md`, que le enseña a cualquier IA a hacer animaciones cortas en pixel art retro (8/16 bits): un personaje, varias escenas, música, efectos de sonido y un botón para exportar el video. No necesitas saber programar: la IA te hace preguntas y tú diriges.

El resultado es un archivo HTML que se abre en cualquier navegador, con reproductor (reproducir, pausa, reiniciar, línea de tiempo), sonido y exportación a MP4.

### Dos maneras de usarlo
| | **Construir** · `SKILL.md` | **Solo el prompt** · `prompt/SKILL.md` |
|---|---|---|
| Qué te da | La película terminada, en un HTML | Un prompt completo para pegar donde quieras |
| Calidad | Más consistente: trae un núcleo ya probado | Depende de la IA que reciba el prompt |
| Ideal para | Tener el resultado ya | Usar tu herramienta favorita, aprender a escribir guiones, compartir la idea |
| Si algo falla | La IA revisa con su lista de comprobación | El generador te da frases de arreglo para pegar |

Mira [`examples/prompt-panaderia.md`](examples/prompt-panaderia.md) para ver un prompt generado.

### Cómo usarlo
1. **Descarga `SKILL.md`** de este repositorio (o `prompt/SKILL.md` si solo quieres el prompt).
2. Según la IA que uses:
   - **Claude (claude.ai):** súbelo como skill en la configuración, o simplemente adjúntalo en una conversación.
   - **ChatGPT, Gemini u otra:** adjunta el archivo (o pega su contenido) en una conversación nueva.
   - **Agentes de código (Claude Code, Cursor...):** ponlo en la carpeta de skills o de reglas del agente.
3. Escribe: **"Quiero crear una animación pixel"** (o, con el generador, **"Quiero el prompt de mi animación pixel"**).
4. Contesta las preguntas: formato, idea, personaje, escenas y sensación. Siempre puedes decir "tú decides".
5. Aprueba la hoja de historia que te propone.
6. Abre el HTML que te entrega. Si la IA no puede mostrarlo, guárdalo como `mi-pelicula.html` y ábrelo en Chrome, Edge o Safari.

Si ya tienes tu guion completo (como el ejemplo del Tiny Developer), pégalo directamente: la IA se salta la entrevista.

### Qué puedes pedir
- **Formatos:** horizontal (YouTube, presentaciones), vertical (historias, reels) o cuadrado (feed).
- **Personajes:** personas con peinados, colores, lentes, bolso, bufanda o audífonos; o animales, robots y objetos con cara.
- **Acciones:** caminar, correr, saltar, cargar, atrapar, celebrar, señalar, pensar, saludar, sentarse, hablar.
- **Escenas:** de 10 a 30 segundos, con transiciones, textos, globos de diálogo y chispas.
- **Sonido:** música que cambia con el ánimo de cada escena (tranquila, construyendo, tensión, triunfo) y efectos: pasos, saltos, monedas, alarmas, cohetes y más.
- **Video:** un botón que graba la película con sonido y la descarga.

### Cómo funciona por dentro
- Todo se dibuja con código en una pantalla virtual de 320×180 píxeles que se amplía sin perder nitidez. No hay imágenes ni archivos de audio.
- Cada cuadro es una función del tiempo: `pantalla = dibujarEscena(tiempo)`. Por eso puedes adelantar, retroceder y exportar, y siempre obtienes el mismo resultado.
- El archivo incluye un **núcleo ya probado** (fuente de píxeles, personaje, reproductor, sonido y exportación). La IA solo escribe tus escenas. Así el resultado es consistente en cualquier IA.

### Ejemplos
- [`examples/tiny-developer-brief.md`](examples/tiny-developer-brief.md): el guion original que inspiró este proyecto, con notas de por qué funciona.
- [`examples/gato-que-programa.html`](examples/gato-que-programa.html): vertical, 10 segundos, un gato como protagonista.
- [`examples/prompt-panaderia.md`](examples/prompt-panaderia.md): un prompt hecho con el generador.
- [`core/pixel-core.html`](core/pixel-core.html): la plantilla con una demo de 12 segundos.

### Límites
- Solo pixel art plano: no hace realismo ni 3D.
- Películas cortas, de hasta unos 30 segundos.
- No dibuja personajes con derechos de autor ni logos de marcas.
- La IA no puede escuchar el sonido: escúchalo tú una vez.
- El video sale en MP4 en Chrome, Edge y Safari, y en WebM en Firefox. Si una app no lo acepta, conviértelo con cualquier conversor.
- Algunas vistas previas de chat bloquean las descargas: abre el archivo guardado en una pestaña normal del navegador.

### Para quien programa
El núcleo es un solo HTML con cuatro secciones: `1. CONFIG` y `3. MUNDO` se editan; `2. CORE` y `4. PLAYER` no. Las reglas completas para escribir escenas están en `SKILL.md`, en el paso 3.

---

## English

### What it is
One file, `SKILL.md`, that teaches any AI to make short retro pixel-art animations (8/16-bit): a character, a few scenes, music, sound effects and a video export button. No coding needed: the AI asks you questions and you direct.

You get one HTML file that opens in any browser, with a player (play, pause, reset, timeline), sound and MP4 export.

### Two ways to use it
| | **Build** · `SKILL.md` | **Prompt only** · `prompt/SKILL.md` |
|---|---|---|
| You get | The finished film, as one HTML file | A complete prompt to paste anywhere |
| Quality | More consistent: ships a tested core | Depends on the AI that receives the prompt |
| Best for | Getting the result now | Using your favourite tool, learning to write briefs, sharing the idea |
| If something fails | The AI checks itself with a list | The generator gives you fix phrases to paste |

See [`examples/prompt-panaderia.md`](examples/prompt-panaderia.md) for a generated prompt.

### How to use it
1. **Download `SKILL.md`** from this repository (or `prompt/SKILL.md` if you only want the prompt).
2. Depending on your AI:
   - **Claude (claude.ai):** upload it as a skill in settings, or just attach it to a conversation.
   - **ChatGPT, Gemini or others:** attach the file (or paste its content) in a new conversation.
   - **Coding agents (Claude Code, Cursor...):** put it in the agent's skills or rules folder.
3. Say: **"I want to make a pixel animation"** (or, with the generator, **"I want the prompt for my pixel animation"**).
4. Answer the questions: format, idea, character, scenes and feel. You can always say "you decide".
5. Approve the story sheet it proposes.
6. Open the HTML it gives you. If the AI can't display it, save it as `my-film.html` and open it in Chrome, Edge or Safari.

If you already have a full script (like the Tiny Developer example), paste it directly: the AI skips the interview.

### What you can ask for
- **Formats:** horizontal (YouTube, slides), vertical (stories, reels) or square (feed).
- **Characters:** people with hair styles, colours, glasses, bag, scarf or headphones; or animals, robots and objects with faces.
- **Actions:** walk, run, jump, carry, catch, celebrate, point, think, wave, sit, talk.
- **Scenes:** 10 to 30 seconds, with transitions, text, speech bubbles and sparks.
- **Sound:** music that follows each scene's mood (calm, build, tension, triumph) and effects: steps, jumps, coins, alarms, rockets and more.
- **Video:** a button that records the film with sound and downloads it.

### How it works inside
- Everything is drawn in code on a 320×180 virtual screen scaled up crisply. No images, no audio files.
- Every frame is a function of time: `screen = drawScene(t)`. That's why you can scrub, rewind and export and always get the same result.
- The file ships a **tested core** (pixel font, character, player, sound, export). The AI only writes your scenes, so results stay consistent across AIs.

### Examples
- [`examples/tiny-developer-brief.md`](examples/tiny-developer-brief.md): the original script that inspired this project, annotated.
- [`examples/gato-que-programa.html`](examples/gato-que-programa.html): vertical, 10 seconds, a cat as the hero.
- [`examples/prompt-panaderia.md`](examples/prompt-panaderia.md): a prompt made with the generator.
- [`core/pixel-core.html`](core/pixel-core.html): the template with a 12-second demo.

### Limits
- Flat pixel art only: no realism, no 3D.
- Short films, up to about 30 seconds.
- No copyrighted characters or brand logos.
- The AI can't hear the sound: listen to it once yourself.
- Video is MP4 in Chrome, Edge and Safari, WebM in Firefox. If an app rejects it, convert it with any converter.
- Some chat previews block downloads: open the saved file in a normal browser tab.

### For developers
The core is one HTML file in four sections: edit `1. CONFIG` and `3. WORLD`; leave `2. CORE` and `4. PLAYER` alone. The full scene-writing rules are in `SKILL.md`, step 3.

---

License: MIT (see `LICENSE`).
