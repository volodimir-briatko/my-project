# HOUSE Holiday Game 2026

Built to the Developer Brief v1. Open `index.html` (serve over http for the skip/scroll to reach the parent page).
No build step, no libraries.

## Files
- `index.html`: start screen, HUD, pause, end scene (CSS inline)
- `game.js`: the game. Content and tuning sit in `CONFIG` at the top.
- `assets/scenes/`: office background and Saida's end scene (JPG, re-encoded from the delivered PNG/JPG)
- `assets/cards/`: 29 cards cut from the delivered sheets (`p1-*`, `p2-*` muted set from the play design, `p3-*`);
  the bright phase 2 set is kept as `p2-bright-*`
- `assets/character/`: `saida-0..6`, `kenji-0..6` (WebP) cut from the sprite sheet (0 = profile right, 3 = back, 6 = profile left)
- `assets/fonts/`: Safiro (Regular, Medium, SemiBold, Bold) and Stolzl (Book, Medium) as WOFF2
- `assets/ui/`: arrows, rocket icon, end-scene waveform

## Embedding
The game fills its container. Recommended: an iframe on the same domain, sized by the site:

    <iframe src="/game/index.html" style="width:100%;height:calc(100dvh - 80px);border:0" title="HOUSE Holiday Game"></iframe>
    <section id="main">…first website section…</section>

"Liever meteen weten wat we doen?" and "Ontdek HOUSE" smooth-scroll to `CONFIG.skipTarget` (default `#main`)
in the parent page, or to the element right after the iframe. They also post `{type:'HOUSE_GAME_SKIP'}` to the parent,
for cross-domain setups:

    addEventListener('message', e => { if (e.data && e.data.type === 'HOUSE_GAME_SKIP') document.querySelector('#main').scrollIntoView({behavior:'smooth'}); });

Wide containers get the desktop layout; portrait containers or widths under 760px get the mobile layout.

## Rules implemented (brief p.15)
- 8 / 12 / 9 unique cards; a caught card never respawns unless feedback returns it
- Missed cards return later in a different lane, no penalty
- A phase advances only when all its cards are caught
- Feedback returns exactly one random caught card of the current phase (max 2 times per phase, never a finished phase)
- Cake clears everything falling with a poof; cleared cards come back, the collected set is untouched
- Speeds: calm, medium, fast. Progress 0–25%, 25–75%, 75–100%
- Before play: instructions + 3-2-1 countdown (mouse or touch text)
- Finale timeline: 0.4s LIVE, 1.0s end scene, 2.3s message, 3.5s reply, 4.2s share / replay / discover

## Swapping in final art (`CONFIG`)
- Cards: `src` per card in `CONFIG.phases`. Bright phase 2 set: point `src` to `p2-bright-*.png`
- End music: `CONFIG.endMusic` (audio file); empty = a soft synthesised lounge loop under the "Jazz cafe" waveform
- Characters: `CONFIG.characters.saida|kenji` → `frames` (7 views), `portrait` (start card), `endImage`
- Portrait background: `CONFIG.bg.portraitSrc`
- Feedback and cake icons: replace `makeFeedbackIcon()` / `makeCakeIcon()` with loaded images
- Sounds are synthesised (Web Audio) in `SFX`; replace with HOUSE cues when delivered

## Tuning per phase (`CONFIG.phases[i].pace`)
`fall` (share of stage height per second), `every` (seconds between items), `maxOnScreen`,
`feedback` and `cake` (chance per spawn), `maxFeedbackHits` (per phase)

## Maximum size
The game grows with its container up to `--maxw` × `--maxh` (1920 × 1140 px, set in `index.html`).
On larger screens it stays that size and centres, so layout, lanes and pace stay the same.
