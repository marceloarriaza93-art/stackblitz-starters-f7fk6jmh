# Refugio — Tu espacio para volver a ti

A wellness web app built like YouTube, dressed as a notebook.

**Refugio** is a somatic-regulator prototype: sixteen sanctuaries (auroras, a
crystal cave, a volcanic island, an arctic tundra…) each composed of a
stock-photos slide, ambient sound layers you can mix yourself, and an
optional "psycho-physiological" filter wheel that retints the whole
interface. The aesthetic is a *bitácora* — handwritten titles, paper
noise, brushes, notebook tabs — and the language is calm by default,
with no streak counters, no notifications, no dopamine loops.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. The app is bilingual (Spanish & English),
with a dyslexic-friendly variant under the language toggle.

## What's inside

- **Sidebar (left):** Explorar · Colores · Sonidos · Saber
- **Header (top right):** Dyslexia mode · Language toggle
- **Explorar:** Home grid with 16 refugios. Click one to enter an
  immersive view with:
  - "Aleatorio" button
  - Left and right arrows to walk between refuges
  - Auto-hide zoom slider (mouse wheel or touch zoom on the photo)
  - Bottom thumbnail strip (horizontal scroll + snap)
  - Sound mixer popover (gear icon)
  - Color filter popover (drop icon)
- **Colores:** Custom SVG color wheel (drag to pick hue + saturation,
  like Adobe Premiere/Photoshop). Master sliders for hue, saturation,
  brightness, contrast and intensity. Six named color recipes, each
  with a neurophysiological note. Filter applies to the entire app.
- **Sonidos:** Procedural sound mixer using Web Audio API — kalimba,
  pandero, calabazas, castañuelas, Tibetan bells, glockenspiel, theta
  /alpha binaurals, 528/432 Hz, cathedral / amber drones, and nature
  sounds (rain, ocean, wind, river, fire). Each channel has its own
  volume slider, play-all, presets per category, and a color tab.
- **Saber:** Long-form intro plus nine authors (Jung, Porges, Dana,
  Panksepp, Winnicott, Schwartz, Benjamin, Schleip, Gottman) and a
  closing prompt inviting reflection.
- **Polivagal Regulator (floating widget):** A small footer widget
  lets you mark your current autonomic state — sympatic/hyper-vigilant,
  dorsal/shutdown, or ventral/safe — and runs a breath co-pilot with
  different inhale/exhale ratios per state. No notifications, no
  streaks.

## Stack

- React 18 · Vite 5 · Tailwind 3 (utility classes for spacing only)
- Hand-written CSS for the notebook vibe, paper noise, and color filter
- Lucide icons
- Web Audio API for procedural sound synthesis (no audio assets needed)
- Pexels (free-license) photos as the refugio cover art, with
  procedurally-generated SVG covers as fallback
