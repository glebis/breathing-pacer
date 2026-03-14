# Breathing Pacer

A fullscreen, hypnotic breathing visualization tool designed for coherent breathing at 5.5 breaths/minute (5 beats inhale, 6 beats exhale at 60 BPM).

## Why

Built as a personal tool for managing Generalized Anxiety Disorder (GAD). Designed to be visually engaging enough for an ADHD-adjacent attention profile while activating parasympathetic tone through rhythmic breathing. See the Obsidian vault note `Coherent Breathing Protocol.md` for the clinical rationale and genomic context.

## Features

- Multiple visual modes switchable with arrow keys
- 8-bit audio with reverb (Web Audio API)
- Beat counting synchronized to 60 BPM
- Fullscreen, distraction-free
- No dependencies, single HTML file (current), modular architecture (planned)

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
├── index.html          # Current monolithic version (working)
├── src/
│   ├── core/           # Timing engine, state management, mode switching
│   ├── modes/          # Visual modes (one file per mode)
│   │   ├── ocean.js
│   │   ├── frost.js
│   │   ├── shapes.js
│   │   └── ...
│   └── audio/          # Sound engine, reverb, tone generators
└── README.md
```

Each mode in `src/modes/` exports a `draw(progress, phase, canvas, ctx)` function. Modes can be developed independently by different agents or in parallel.

## Usage

Open `index.html` in a browser. Tap/click/press Enter to start. Arrow keys to switch modes. Escape to stop.

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
