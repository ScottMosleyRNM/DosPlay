# DOS/PLAY — Mobile PWA DOS Emulator

## Setup
1. `npm install` (already done if you have the folder)
2. `npx serve public` — serves on http://localhost:3000
   OR deploy the `public/` folder to Netlify/Vercel

## Deploy to Netlify (easiest)
Drag the entire `public/` folder to netlify.com/drop

## What's included
- `public/index.html` — the app shell + custom mobile controls
- `public/js-dos.js` / `js-dos.css` — js-dos v8 (from npm)
- `public/emulators/` — DOSBox WASM engine (wdosbox.wasm etc.)
- `public/sw.js` — service worker for PWA/offline
- `public/manifest.json` — PWA manifest (Add to Home Screen)

## Game file formats
- **.zip** — Put your game folder in a zip. Best option.
- **.exe / .com / .bat** — Bare DOS executable, auto-wrapped
- **.img / .ima** — Floppy disk image, auto-mounted as A:

## Controls
- **D-PAD** tab: 4-directional arrows + Enter/Esc/Space/Tab
- **F-KEYS** tab: F1–F10 + ESC/Space/Enter
- **KBD** tab: Full QWERTY with arrow keys
- Tabs collapse when tapped again
- Physical Bluetooth keyboard works too
