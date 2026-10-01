# DevFest Quito 2026

Repositorio con dos proyectos web estáticos (HTML, CSS y JavaScript, sin paso de compilación).

| Carpeta | Qué es |
|---|---|
| [`DevFestQuito/`](DevFestQuito/) | Sitio web de **Google DevFest Quito 2026**, organizado por GDG Quito junto a Nestlab USFQ. Sábado 26 de septiembre de 2026, Campus USFQ Cumbayá. |
| [`Tu Mundo Pixel/`](Tu%20Mundo%20Pixel/) | **Pixel World**: una skill para cualquier IA que crea pequeñas películas en pixel art conversando, con su landing page y sus demos. |

---

## DevFestQuito/

El sitio del evento: speakers, agenda, equipo, auspiciantes y preguntas frecuentes.

```
DevFestQuito/
├── index.html            página principal
├── layouts.html          vista previa de layouts
├── css/                  estilos
├── js/                   agenda, speakers, equipo, FAQ, ciudad del hero, íconos 3D, animaciones
├── assets/               imágenes de agenda, speakers, auspiciantes, equipo y og-image
├── speakers/  team/      fotos
├── logos_auspiciantes/   logos de auspiciantes
├── iconos/               exploraciones de íconos 3D
├── sitemap.xml  robots.txt
└── vercel.json           configuración de Vercel (URLs limpias y caché)
```

**Publicarlo en Vercel:** importa el repositorio y, en *Root Directory*, elige `DevFestQuito`. No necesita comando de build.

---

## Tu Mundo Pixel/

Un archivo, `SKILL.md`, que le enseña a cualquier IA (Claude, ChatGPT, Gemini, agentes de código) a hacer animaciones cortas en pixel art: personaje, escenas, música, efectos y exportación a video. La guía completa, en español e inglés, está en su propio [README](Tu%20Mundo%20Pixel/README.md).

```
Tu Mundo Pixel/
├── index.html          landing page: cómo se usa, demos y qué se puede crear
├── SKILL.md            skill que construye la película
├── prompt/SKILL.md     skill que solo escribe el prompt
├── README.md           guía ES / EN
├── LICENSE             MIT
├── core/pixel-core.html
├── examples/           gato-que-programa.html, prompt-panaderia.md, tiny-developer-brief.md
└── lortbot.html        demo
```

**Publicarlo:** en Vercel, crea un segundo proyecto con *Root Directory* `Tu Mundo Pixel`. También funciona con GitHub Pages en `https://<tu-usuario>.github.io/<repo>/Tu%20Mundo%20Pixel/`.

---

## Verlo en local

Cualquier servidor estático sirve. Por ejemplo, desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abre `http://localhost:8000`.
