# Breathing Pacer

A fullscreen, hypnotic breathing visualization tool designed for coherent breathing at 5.5 breaths/minute (5 beats inhale, 6 beats exhale at 60 BPM).

![Aurora mode during inhale](screenshot-aurora.png)

## Why

Built as a personal tool for managing Generalized Anxiety Disorder (GAD). Designed to be visually engaging enough for an ADHD-adjacent attention profile while activating parasympathetic tone through rhythmic breathing.

## Features

- 17 visual modes (arrow keys to switch, hash URLs for direct access)
- 5 sound modes: 8-bit, sonar, warm pad, heartbeat, silent (S to cycle)
- Context-based timer presets (1-6 keys): morning, pre-work, content-urge, evening, minimum dose, custom
- Immersive mode (Shift+.) hides all UI
- Volume control (Up/Down arrows, M to mute)
- No dependencies — monolithic (`index.html`) and modular (`modular.html` + `src/`) versions

## Visual Modes

Solid fill, circle, breathing square (neobrutalist), diamond, concentric rings, diagonal sweep, ocean waves, frost hexagons, particles, aurora, tendrils, lava lamp, mycelium network, ink drops, coral reef, fireflies, ink ripples.

Warm modes use orange/amber palette. Cool modes (`cool: true`) switch to blue/cyan.

## Controls

| Key | Action |
|-----|--------|
| Space / Enter / Click | Start |
| Escape / Double-tap | Stop |
| Left / Right | Switch mode |
| Shift + . | Toggle immersive (hide all UI) |
| S | Cycle sound mode |
| M | Mute / unmute |
| Up / Down | Volume |
| 1-6 | Start with timer preset |

Direct mode access via URL hash: `modular.html#aurora`, `modular.html#ocean`, etc.

Timer presets also available via URL param: `?preset=morning`

## Architecture

```
breathing-pacer/
├── index.html              # Monolithic version (self-contained)
├── modular.html            # ES module version
├── src/
│   ├── main.js             # Event bindings, entry point
│   ├── core/
│   │   ├── config.js       # Timing constants, colors
│   │   ├── state.js        # Shared state object
│   │   └── engine.js       # Animation loop, phase logic, mode switching
│   ├── modes/
│   │   ├── index.js        # Auto-generated registry (build-modes.js)
│   │   └── *.js            # One file per visual mode
│   └── audio/
│       └── audio.js        # Web Audio API, 5 sound modes, reverb
├── scripts/
│   └── build-modes.js      # Scans modes/, generates index.js
└── package.json
```

### Adding a new mode

Create a file in `src/modes/` that exports:

```js
export const meta = { name: 'my mode', cool: false, order: 30 };

export function draw(p, phase, ctx, w, h) {
  // p: 0-1 eased progress (0=contracted, 1=expanded)
  // phase: 'inhale' | 'exhale'
  // ctx: CanvasRenderingContext2D
  // w, h: viewport dimensions
  ctx.clearRect(0, 0, w, h);
  // ... your visualization
}
```

Then run `node scripts/build-modes.js` to regenerate the registry. Modes are sorted by `order` field.

## Usage

```bash
npm run serve          # python3 -m http.server 8765
open http://localhost:8765/modular.html
```

Or open `index.html` directly for the monolithic version.

## Breathing Protocol

- **Inhale**: 5 seconds (5 beats at 60 BPM)
- **Exhale**: 6 seconds (6 beats at 60 BPM)
- **Rate**: ~5.5 breaths/minute (resonance frequency)
- **Minimum dose**: 3 breaths (33 seconds)

## Timer Presets

| # | Preset | Duration | Use case |
|---|--------|----------|----------|
| 1 | Morning | 3 min | Cortisol awakening response |
| 2 | Pre-work | 5 min | Executive function warm-up |
| 3 | Content urge | 1 min | Dopamine craving redirect |
| 4 | Evening | 5 min | Parasympathetic wind-down |
| 5 | Minimum dose | 33 sec | 3 breaths, any time |
| 6 | Custom | 2 min | Adjustable, saved to localStorage |
