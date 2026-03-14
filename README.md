# Breathing Pacer

A fullscreen, hypnotic breathing visualization tool designed for coherent breathing at 5.5 breaths/minute (5 beats inhale, 6 beats exhale at 60 BPM).

## Why

Built as a personal tool for managing Generalized Anxiety Disorder (GAD). Designed to be visually engaging enough for an ADHD-adjacent attention profile while activating parasympathetic tone through rhythmic breathing. See the Obsidian vault note `Coherent Breathing Protocol.md` for the clinical rationale and genomic context.

## Features

- Multiple visual modes switchable with arrow keys
- 8-bit audio with reverb (Web Audio API)
- Beat counting synchronized to 60 BPM
- Fullscreen, distraction-free
- No dependencies — monolithic (`index.html`) and modular (`modular.html` + `src/`) versions

## Visual Modes

### Current
- Solid fill (warm)
- Expanding circle
- Breathing square (neobrutalist)
- Diamond
- Concentric rings
- Cool diagonal (blue)
- Ocean sweep (organic waves - the favorite)
- Frost field (hexagonal)
- Cool solid fill (blue)

### Planned
- Asymmetric organic shapes (torpedo/leaf forms)
- Particle systems
- Generative art modes with less geometric symmetry
- More hypnotic, less structured visualizations

## Architecture

```
breathing-pacer/
├── index.html          # Monolithic version (self-contained, always works)
├── modular.html        # ES module version (loads from src/)
├── src/
│   ├── main.js         # Event bindings, entry point
│   ├── core/
│   │   ├── config.js   # Timing constants, colors
│   │   ├── state.js    # Shared state object
│   │   └── engine.js   # Animation loop, phase logic, mode switching
│   ├── modes/
│   │   ├── index.js    # Mode registry (import all, export MODES array)
│   │   ├── ocean.js    # Ocean sweep (organic waves)
│   │   ├── frost.js    # Frost field (hexagonal)
│   │   ├── diagonal.js # Cool diagonal (blue 45°)
│   │   ├── circle.js   # Expanding circle
│   │   ├── square.js   # Breathing square (neobrutalist)
│   │   ├── diamond.js  # Diamond
│   │   ├── rings.js    # Concentric rings
│   │   ├── solid-fill.js
│   │   └── cool-solid-fill.js
│   └── audio/
│       └── audio.js    # Web Audio API, reverb, tone generators
└── README.md
```

### Adding a new mode

Create a file in `src/modes/` that exports:

```js
export const meta = { name: 'my mode', cool: false };  // cool: true = blue palette

export function draw(p, phase, ctx, w, h) {
  // p: 0-1 eased progress (0=contracted, 1=expanded)
  // phase: 'inhale' | 'exhale'
  // ctx: CanvasRenderingContext2D
  // w, h: viewport dimensions
  ctx.clearRect(0, 0, w, h);
  // ... your visualization
}
```

Then register it in `src/modes/index.js`. Modes can be developed independently by different agents or in parallel.

## Usage

Open `index.html` (monolithic) or `modular.html` (ES modules, needs local server) in a browser. Tap/click/press Enter to start. Arrow keys to switch modes. Escape to stop.

For the modular version, serve locally (ES modules require HTTP):
```bash
npx serve .   # or python3 -m http.server
```

## Design

- Agency brand: `#e85d04` (orange), `#ffd60a` (yellow), `#3a86ff` (blue)
- Cool palette: navy background, blue/cyan tones
- Neobrutalism elements (hard shadows, bold type) from Geist font family
- Audio: Web Audio API with synthetic reverb (convolver)

## Breathing Protocol

- **Inhale**: 5 seconds (5 beats at 60 BPM)
- **Exhale**: 6 seconds (6 beats at 60 BPM)
- **Rate**: ~5.5 breaths/minute (resonance frequency)
- **Minimum dose**: 3 breaths (33 seconds)
