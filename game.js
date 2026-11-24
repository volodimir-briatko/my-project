/* HOUSE of Campaigns: Holiday Game 2026
 * Built to the Developer Brief v1:
 *  - Start: pick Saida or Kenji, play or skip.
 *  - Three phases with 8, 12 and 9 unique cards. Nothing is collected twice.
 *  - Missed cards come back later in another lane. No penalty for missing.
 *  - Feedback returns one caught card of the current phase. Cake clears the screen.
 *  - 100%: short finale, end scene for the chosen character, share / replay / discover.
 *
 * All content and tuning is in CONFIG. Art marked `placeholder: true` is drawn in code
 * until HOUSE delivers the final asset.
 */
(() => {
'use strict';

/* ======================================================================
 * CONFIG
 * ==================================================================== */

const CONFIG = {
  bg: {
    src: 'assets/scenes/office.jpg', w: 1797, h: 1011,
    portraitSrc: '',                                  // HOUSE can deliver a portrait crop; empty = crop the desktop image
    laneLines: [526, 664, 810, 955, 1106, 1244],      // dashed lines painted in the background
    arch: { x: 885, y: 582, r: 362 },                 // the lighter play arch: half circle on top, straight sides down
    lamps: [[143, 46], [728, 49], [1089, 48], [1670, 43], [24, 205], [1773, 206], [23, 476], [1773, 474], [24, 694], [1773, 693], [23, 918], [1773, 920],
            [592, 130], [1405, 127], [356, 197], [1035, 120], [743, 118]],
    candles: [[1688, 163], [347, 237], [386, 233], [1703, 333], [1467, 777], [1696, 620], [1697, 784], [1698, 892], [195, 768], [1425, 276]]
  },

  // Seven views per character, 0 = profile facing right, 3 = back, 6 = profile facing left
  characters: {
    saida: {
      name: 'Saida', role: 'Senior Brand Manager', tagline: 'De deadlinetijger',
      frames: [0, 1, 2, 3, 4, 5, 6].map(i => `assets/character/saida-${i}.webp`),
      card: 'assets/character/card-saida.webp',        // start screen card (345 x 460, background included)
      endImage: 'assets/scenes/end-saida.jpg'
    },
    kenji: {
      name: 'Kenji', role: 'Digital Marketing Manager', tagline: 'De conversiekoning',
      frames: [0, 1, 2, 3, 4, 5, 6].map(i => `assets/character/kenji-${i}.webp`),
      card: 'assets/character/card-kenji.webp',
      endImage: ''                                     // Kenji at home: not delivered yet
    }
  },
  defaultCharacter: 'saida',
  endMusic: '',                                        // optional audio file for the "Jazz cafe" end scene; empty = soft synth loop

  // Progress share per phase follows the brief: 0–25%, 25–75%, 75–100%
  phases: [
    {
      title: 'FASE 1. VAN BRIEFING NAAR IDEE EN STRATEGIE', short: 'FASE 1', range: [0, 25], color: '#c6a6f5',
      done: 'Het idee staat. Tijd om te maken!',
      pace: { fall: .19, every: 1.2, maxOnScreen: 3, feedback: .10, cake: .05, maxFeedbackHits: 2 },
      cards: [
        { id: 'strategie', label: 'Creatieve Strategie', src: 'assets/cards/p1-strategie.png', color: '#b98cf2' },
        { id: 'bigidea', label: 'Big Idea', src: 'assets/cards/p1-bigidea.png', color: '#f5c08f' },
        { id: 'doelgroep', label: 'Doelgroep', src: 'assets/cards/p1-doelgroep.png', color: '#f39a45' },
        { id: 'funnel', label: 'Funnel', src: 'assets/cards/p1-funnel.png', color: '#f6c85e' },
        { id: 'fases', label: 'Campagne fases', src: 'assets/cards/p1-fases.png', color: '#8fe0b0' },
        { id: 'creators', label: 'Creators', src: 'assets/cards/p1-creators.png', color: '#5fd3d3' },
        { id: 'materiaal', label: 'Materiaalbon', src: 'assets/cards/p1-materiaal.png', color: '#ee8e8e' },
        { id: 'planning', label: 'Planning', src: 'assets/cards/p1-planning.png', color: '#f2c9a8' }
      ]
    },
    {
      title: 'FASE 2. VAN IDEE NAAR CREATIE', short: 'FASE 2', range: [25, 75], color: '#9fd0a4',
      done: 'De campagne komt samen. Bijna live!',
      pace: { fall: .25, every: .92, maxOnScreen: 4, feedback: .12, cake: .05, maxFeedbackHits: 2 },
      // Muted set as used in the play-screen design; the bright set is in assets/cards/p2-bright-*.png
      cards: [
        { id: 'banners', label: 'Banners', src: 'assets/cards/p2-banners.png', color: '#e9b98c' },
        { id: 'ugc', label: 'UGC', src: 'assets/cards/p2-ugc.png', color: '#ead9bd' },
        { id: 'dooh', label: 'DOOH', src: 'assets/cards/p2-dooh.png', color: '#d4682c' },
        { id: 'mobile', label: 'Mobile Specials', src: 'assets/cards/p2-mobile.png', color: '#8a8e4c' },
        { id: 'olv', label: 'Online video', src: 'assets/cards/p2-olv.png', color: '#b3bc95' },
        { id: 'statics', label: 'Statics', src: 'assets/cards/p2-statics.png', color: '#e2b088' },
        { id: 'radio', label: 'Online radio', src: 'assets/cards/p2-radio.png', color: '#7f7f45' },
        { id: 'social', label: 'Social ads', src: 'assets/cards/p2-social.png', color: '#c9603c' },
        { id: 'storyboards', label: 'Storyboards', src: 'assets/cards/p2-storyboards.png', color: '#e2a780' },
        { id: 'vertaling', label: 'Doorvertaling', src: 'assets/cards/p2-vertaling.png', color: '#a4ad83' },
        { id: 'takeovers', label: 'Takeovers', src: 'assets/cards/p2-takeovers.png', color: '#b9452c' },
        { id: 'landing', label: 'Landing page', src: 'assets/cards/p2-landing.png', color: '#e9bf96' }
      ]
    },
    {
      title: 'FASE 3. VAN CREATIE NAAR LIVE', short: 'FASE 3', range: [75, 100], color: '#ffb27a',
      done: null,
      pace: { fall: .31, every: .78, maxOnScreen: 4, feedback: .12, cake: .05, maxFeedbackHits: 2 },
      cards: [
        { id: 'varA', label: 'Variant A', src: 'assets/cards/p3-varA.png', color: '#f5d6b8' },
        { id: 'varB', label: 'Variant B', src: 'assets/cards/p3-varB.png', color: '#f5d6b8' },
        { id: 'varC', label: 'Variant C', src: 'assets/cards/p3-varC.png', color: '#f5d6b8' },
        { id: 'winning', label: 'Winning ad', src: 'assets/cards/p3-winning.png', color: '#f5d6b8' },
        { id: 'cta', label: 'CTA', src: 'assets/cards/p3-cta.png', color: '#f39a45' },
        { id: 'optimize', label: 'Optimize', src: 'assets/cards/p3-optimize.png', color: '#8fe0b0' },
        { id: 'opschalen', label: 'Opschalen', src: 'assets/cards/p3-opschalen.png', color: '#7fa0f5' },
        { id: 'resultaten', label: 'Resultaten', src: 'assets/cards/p3-resultaten.png', color: '#f6d36a' },
        { id: 'lancering', label: 'Lancering', src: 'assets/cards/p3-lancering.png', color: '#f09a9a' }
      ]
    }
  ],

  copy: {
    nice: 'Nice one!',
    almost: 'Bijna live!',
    feedback: 'Ah, chips. Feedback!',
    cake: 'Taartpauze!',
    live: 'LIVE!',
    message: name => `${name}. Kleine vraag nog. Kunnen we maandag ook een variantje krijgen?`,
    introMouse: 'Beweeg je muis van links naar rechts. Vang alle assets. Ontwijk extra feedback!',
    introTouch: 'Sleep met je vinger naar links en rechts. Vang alle assets. Ontwijk extra feedback!',
    music: 'Jazz cafe',
    shareTitle: 'HOUSE Holiday Game 2026',
    shareText: 'Ik heb de laatste campagne van 2026 live gezet. Lukt het jou ook?',
    copied: 'Link gekopieerd!'
  },

  // Where "skip" and "Ontdek HOUSE" scroll to. In an iframe the game also posts
  // {type:'HOUSE_GAME_SKIP'} to the parent page.
  skipTarget: '#main',
  shareUrl: '',                                       // empty = the page that embeds the game
  countdownTo: '2027-01-01T00:00:00+01:00',
  soundKey: 'house_game_sound'
};

/* ======================================================================
 * Helpers
 * ==================================================================== */

const $ = id => document.getElementById(id);
const frameEl = $('frame'), canvas = $('cv'), ctx = canvas.getContext('2d');
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const COARSE = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = a => a[Math.floor(Math.random() * a.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const easeInOut = t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeBack = t => { t = clamp(t, 0, 1); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(r || 0, w / 2, h / 2);
    this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath();
  };
}
function loadImg(src) { if (!src) return null; const i = new Image(); i.decoding = 'async'; i.src = src; return i; }
const ready = i => !!i && (i instanceof HTMLCanvasElement || (i.complete && i.naturalWidth > 0));
const iw = i => i instanceof HTMLCanvasElement ? i.width : i.naturalWidth;
const ih = i => i instanceof HTMLCanvasElement ? i.height : i.naturalHeight;

// 24x24 stroke icons for placeholder cards and UI buttons
const ICONS = {
  users: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 1 0 0-5M18 14c2 .5 3.5 2.4 3.5 5',
  funnel: 'M3 4h18l-7 8v6l-4 2v-8z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  html: 'M5 3h14l-1.5 15L12 21l-5.5-3zM9 8h6.5M9.5 12h5.5l-.5 3.5-2.5 1-2.5-1',
  ring: 'M12 3a5 5 0 1 0 0 10 5 5 0 1 0 0-10zM12 13v8M8.5 21h7M12 6.5v3',
  billboard: 'M3 5h18v9H3zM8 14v6M16 14v6M5 20h14',
  phone: 'M8.5 2h7A1.5 1.5 0 0 1 17 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5v-17A1.5 1.5 0 0 1 8.5 2zM10.5 18.5h3M12 7l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 9.3l2-.3z',
  play: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM10 9l5 3-5 3z',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9a1 1 0 1 0 0-.1',
  radio: 'M4 9h16v11H4zM7 9l10-5M8.5 14.5a1.5 1.5 0 1 0 0-.1M14 13h3M14 16h3',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  frames: 'M3 6h8v6H3zM13 6h8v6h-8zM3 14h8v5H3zM13 14h8v5h-8z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5M8 8l8 8M16 8l-8 8',
  page: 'M4 4h16v16H4zM4 8h16M7 11h6M7 14h10M7 17h7',
  soundOn: 'M4 9h3l5-4v14l-5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11',
  soundOff: 'M4 9h3l5-4v14l-5-4H4zM16 9.5l5 5M21 9.5l-5 5',
  pause: 'M8 5v14M16 5v14'
};
const svgIcon = n => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;
// Rocket from the design (Contour 91), filled with currentColor so the HUD can grey it out
const ROCKET = '<svg viewBox="0 0 25.934 25.944" aria-hidden="true"><path transform="translate(0.208 0.225)" d="M25.479.582h0A.631.631,0,0,0,24.937.04a13.336,13.336,0,0,0-4.8.51,19.335,19.335,0,0,0-4.816,2.056,24.365,24.365,0,0,0-5.16,4.161,5.9,5.9,0,0,0-3.213-.191,8.316,8.316,0,0,0-3.223,1.5,16.07,16.07,0,0,0-3.613,3.9.63.63,0,0,0,.443.982l5.039.619-.067,2.751a.627.627,0,0,0,.027.2,3.608,3.608,0,0,0-.814.353,6.073,6.073,0,0,0-2.052,2.188A17.548,17.548,0,0,0,.867,23.891a.634.634,0,0,0,.167.594.63.63,0,0,0,.594.167,17.546,17.546,0,0,0,4.825-1.819A6.073,6.073,0,0,0,8.64,20.78a3.609,3.609,0,0,0,.353-.813.627.627,0,0,0,.2.027l2.751-.067.619,5.039a.634.634,0,0,0,.366.5.63.63,0,0,0,.615-.055,16.068,16.068,0,0,0,3.9-3.613,8.316,8.316,0,0,0,1.5-3.223,5.9,5.9,0,0,0-.191-3.214,26.55,26.55,0,0,0,1.95-2.067,21.389,21.389,0,0,0,3.711-6.2A16.948,16.948,0,0,0,25.482,2.46a9.844,9.844,0,0,0,0-1.878M11.015,18.689l-1.583.039L6.791,16.087,6.829,14.5ZM7.552,20.145c-.494.845-1.8,2.041-5.19,3.011.97-3.392,2.166-4.7,3.011-5.19a2.055,2.055,0,0,1,1.034-.308,1.417,1.417,0,0,1,.183.011L7.85,18.927a1.913,1.913,0,0,1-.3,1.217M9.2,7.826l-.051.059-.075.088-.054.064-.106.126-.023.027-.128.154-.039.048L8.631,8.5l-.06.073L8.5,8.656l-.053.066-.075.093-.054.068-.074.093L8.2,9.044l-.075.1-.051.065-.081.105-.044.058-.116.153-.014.018L7.7,9.7l-.043.058-.08.108-.05.068-.074.1L7.4,10.1l-.072.1-.051.072-.071.1-.05.071-.074.106-.047.067-.083.12-.037.053-.119.175-.017.025-.1.151-.041.061-.078.117-.046.07-.072.11-.047.073-.071.109-.047.073-.071.111-.045.071-.074.118-.041.065-.087.14-.028.044-.023.037-4.145-.509C3.506,9.549,5.334,8.2,7.2,7.81a4.846,4.846,0,0,1,2.015,0L9.2,7.826M7.071,12.861l.02-.032.044-.071.056-.089.059-.093L7.3,12.49l.062-.1.048-.075.068-.1.065-.1.052-.08.1-.149.019-.028.118-.175.065-.1.054-.079.056-.081.064-.092.067-.1.053-.076.027-.039L14.394,17.3c-.385.272-.783.541-1.185.8l-.03.019-.118.076L13,18.232l-.1.063-.1.061-.069.043-.14.087L7.032,12.924l.04-.064M13.4,19.47l.049-.031.231-.146.037-.023.239-.154.067-.044.228-.15.068-.045.223-.15.048-.032.211-.144.056-.039.231-.161.05-.035.242-.172.013-.009c.817-.588,1.6-1.2,2.321-1.829a4.846,4.846,0,0,1,0,2.015c-.385,1.866-1.739,3.694-4.025,5.436l-.509-4.145.225-.14M8.987,10.081,9.052,10l.059-.077.065-.084.06-.077L9.3,9.676,9.363,9.6l.066-.082.061-.075.059-.073.068-.083L9.682,9.2l.009-.011.052-.063L9.8,9.067l.021-.025.053-.064.067-.08.011-.013L10,8.826l.06-.07.2-.229.054-.062.033-.037.042-.048.052-.058.078-.088.064-.071.067-.074.1-.107.033-.035a22.954,22.954,0,0,1,5.75-4.575l5.618,5.618a24.637,24.637,0,0,1-6.726,7.551L8.975,10.1l.012-.015M24.223,2.4h0a15.72,15.72,0,0,1-1,4.292c-.141.37-.3.744-.471,1.115L17.712,2.774a17.284,17.284,0,0,1,2.711-1,13.889,13.889,0,0,1,3.836-.518A11.129,11.129,0,0,1,24.223,2.4"/></svg>';

// Placeholder card in the style of the supplied cards: glossy gradient tile, icon, label
function makeCard(def) {
  const W = 232, H = 280, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), r = 30, ink = def.ink || '#ffffff';
  const grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, def.c1); grad.addColorStop(1, def.c2);
  g.fillStyle = grad; g.beginPath(); g.roundRect(4, 4, W - 8, H - 8, r); g.fill();
  const gloss = g.createLinearGradient(0, 0, 0, H * .5); gloss.addColorStop(0, 'rgba(255,255,255,.45)'); gloss.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gloss; g.beginPath(); g.roundRect(4, 4, W - 8, H * .5, r); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3.5; g.beginPath(); g.roundRect(6, 6, W - 12, H - 12, r - 2); g.stroke();
  if (def.icon) {
    g.save(); g.translate(W / 2 - 50, 46); g.scale(100 / 24, 100 / 24);
    g.strokeStyle = ink; g.lineWidth = 1.9; g.lineCap = 'round'; g.lineJoin = 'round';
    g.shadowColor = 'rgba(0,0,0,.18)'; g.shadowBlur = 3; g.shadowOffsetY = .6;
    g.stroke(new Path2D(ICONS[def.icon])); g.restore();
  }
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 30px Safiro,Stolzl,Arial,sans-serif';
  const words = def.label.split(' '), lines = [''];
  for (const w of words) { const cur = lines[lines.length - 1], t = cur ? cur + ' ' + w : w; if (g.measureText(t).width < W - 34 || !cur) lines[lines.length - 1] = t; else lines.push(w); }
  const by = def.icon ? 210 : 196;
  lines.slice(0, 2).forEach((ln, i, a) => g.fillText(ln, W / 2, by + (i - (a.length - 1) / 2) * 33));
  return c;
}

// Placeholder feedback icon: red round warning bubble with a lightning bolt
function makeFeedbackIcon() {
  const S = 200, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, S); grad.addColorStop(0, '#ff8a76'); grad.addColorStop(1, '#d93a33');
  g.fillStyle = grad; g.beginPath(); g.arc(100, 92, 78, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(52, 150); g.lineTo(36, 188); g.lineTo(86, 164); g.closePath(); g.fill();
  const gl = g.createLinearGradient(0, 14, 0, 100); gl.addColorStop(0, 'rgba(255,255,255,.45)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gl; g.beginPath(); g.ellipse(100, 58, 58, 38, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#ffe14d'; g.strokeStyle = '#b8261f'; g.lineWidth = 5; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(110, 38); g.lineTo(70, 100); g.lineTo(98, 100); g.lineTo(88, 148); g.lineTo(132, 80); g.lineTo(104, 80); g.closePath(); g.fill(); g.stroke();
  return c;
}

// Placeholder cake icon: cupcake with a cherry
function makeCakeIcon() {
  const S = 200, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
  g.fillStyle = '#e8873a'; g.beginPath(); g.moveTo(44, 104); g.lineTo(156, 104); g.lineTo(140, 184); g.lineTo(60, 184); g.closePath(); g.fill();
  g.strokeStyle = '#c96a24'; g.lineWidth = 5; for (let x = 66; x <= 134; x += 17) { g.beginPath(); g.moveTo(x, 108); g.lineTo(x + (x - 100) * .12, 180); g.stroke(); }
  g.fillStyle = '#fff3e6'; g.beginPath(); g.arc(100, 96, 58, Math.PI, 0); g.lineTo(158, 106); g.quadraticCurveTo(100, 122, 42, 106); g.closePath(); g.fill();
  g.beginPath(); g.arc(100, 66, 38, Math.PI, 0); g.fill();
  g.fillStyle = '#ff6fa3'; [[70, 86], [118, 72], [96, 98], [132, 96], [82, 60]].forEach(([x, y]) => { g.save(); g.translate(x, y); g.rotate(x); g.fillRect(-7, -2.5, 14, 5); g.restore(); });
  g.fillStyle = '#e2283a'; g.beginPath(); g.arc(100, 26, 15, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(95, 21, 4.5, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#3e6b2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(100, 12); g.quadraticCurveTo(108, 2, 118, 4); g.stroke();
  return c;
}

const glowCache = {};
function glow(color, x, y, r, a, mode = 'lighter') {
  if (a <= .004 || r <= 0) return;
  let s = glowCache[color];
  if (!s) {
    s = glowCache[color] = document.createElement('canvas'); s.width = s.height = 128;
    const g = s.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, color); gr.addColorStop(.3, color + 'aa'); gr.addColorStop(1, color + '00');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  }
  ctx.save(); ctx.globalCompositeOperation = mode; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(s, x - r, y - r, r * 2, r * 2); ctx.restore();
}
// Soft sprites: a blurred shadow blob and a gentle glow (no hard core), drawn stretched
let shadowSpr = null;
const softCache = {};
function softShadow(x, y, w, h, a) {
  if (!shadowSpr) {
    shadowSpr = document.createElement('canvas'); shadowSpr.width = shadowSpr.height = 128;
    const g = shadowSpr.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,.9)'); gr.addColorStop(.35, 'rgba(0,0,0,.55)'); gr.addColorStop(.7, 'rgba(0,0,0,.16)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  }
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(shadowSpr, x - w / 2, y - h / 2, w, h); ctx.restore();
}
function softGlow(color, x, y, r, a) {
  if (a <= .004 || r <= 0) return;
  let c = softCache[color];
  if (!c) {
    c = softCache[color] = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, color + '8c'); gr.addColorStop(.4, color + '4d'); gr.addColorStop(.75, color + '14'); gr.addColorStop(1, color + '00');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(c, x - r, y - r, r * 2, r * 2); ctx.restore();
}
function star(x, y, r, rot, fill) {
  ctx.fillStyle = fill; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill();
}

/* ======================================================================
 * Assets
 * ==================================================================== */

const bgImg = loadImg(CONFIG.bg.src), bgPortrait = loadImg(CONFIG.bg.portraitSrc);
const CHAR_FRAMES = {};
for (const [k, c] of Object.entries(CONFIG.characters)) CHAR_FRAMES[k] = c.frames.map(loadImg);
const PHASES = CONFIG.phases;
const CARD = {};
PHASES.forEach((p, pi) => p.cards.forEach(c => { CARD[c.id] = { def: c, phase: pi, img: c.src ? loadImg(c.src) : makeCard(c), color: c.color || c.c2 }; }));
const feedbackImg = makeFeedbackIcon(), cakeImg = makeCakeIcon();

/* ======================================================================
 * State
 * ==================================================================== */

let W = 1000, H = 640, dpr = 1, portrait = false;
const L = {};
let state = 'start';                 // start | intro | play | transition | live | end | paused
let resumeState = 'play';
let charKey = CONFIG.defaultCharacter;
let phase = 0, caught = new Set(), drops = [], parts = [], poofs = [], flyers = [], confetti = [];
let missed = [];                      // { id, notLane, readyAt }
let spawnT = 0, lastLane = -1, lastKind = '', clock = 0, transT = 0, transStep = 0, liveT = 0, shake = 0;
let fbHits = 0, niceShown = false, almostShown = false, bigText = null, introT = 0, introN = 0;
const lv = [0, 0, 0], ringShown = [0, 0, 0];
const P = { x: 500, tx: 500, vx: 0, u: .5, frame: 3, prev: 3, fade: 1, holdT: 0, hop: 0, hopV: 0, squash: 0, dizzy: 0, inv: 0, lean: 0 };
let keyDir = 0, btnDir = 0, drag = null, mouseX = null;

/* ======================================================================
 * Layout
 * ==================================================================== */

function resize() {
  const r = frameEl.getBoundingClientRect();
  W = Math.max(280, r.width); H = Math.max(300, r.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  portrait = H > W * 1.02 || W < 760;
  const B = CONFIG.bg, usePortraitArt = portrait && ready(bgPortrait);

  let s, ox, oy;
  if (usePortraitArt) { const pw = iw(bgPortrait), ph = ih(bgPortrait); s = Math.max(W / pw, H / ph); ox = (W - pw * s) / 2; oy = (H - ph * s) / 2; }
  else if (portrait) { s = Math.max(H / B.h, W / B.w); ox = clamp(W / 2 - B.arch.x * s, W - B.w * s, 0); oy = (H - B.h * s) / 2; }
  else { s = Math.max(W / B.w, H / B.h); ox = clamp(W / 2 - B.arch.x * s, W - B.w * s, 0); oy = (H - B.h * s) / 2; }
  Object.assign(L, { s, ox, oy, portraitArt: usePortraitArt });

  const fr = frameEl.getBoundingClientRect(), hr = $('hud').getBoundingClientRect();
  L.hudBottom = Math.max(0, hr.bottom - fr.top);

  L.charH = portrait ? clamp(H * .16, 90, 150) : clamp(H * .2, 70, 220);
  L.baseY = H - (portrait ? Math.max(62, H * .075) : Math.max(14, H * .03));
  L.catchY = L.baseY - L.charH * .58;

  // Lanes: painted lines when they are all visible, otherwise split the visible field.
  // Portrait art is expected to centre its lanes; until then the field is the screen width.
  const margin = 12, lines = B.laneLines.map(x => ox + x * s);
  if (!usePortraitArt && lines[0] >= margin && lines[lines.length - 1] <= W - margin) {
    L.fieldL = lines[0]; L.fieldR = lines[lines.length - 1]; L.lanes = lines.slice(0, -1).map((x, i) => (x + lines[i + 1]) / 2);
  } else {
    L.fieldL = usePortraitArt ? margin : Math.max(margin, lines[0]); L.fieldR = usePortraitArt ? W - margin : Math.min(W - margin, lines[lines.length - 1]);
    const n = 5, w = (L.fieldR - L.fieldL) / n; L.lanes = Array.from({ length: n }, (_, i) => L.fieldL + w * (i + .5));
  }
  L.laneW = (L.fieldR - L.fieldL) / L.lanes.length;
  L.cardH = portrait ? clamp(Math.min(L.laneW * 1.12, H * .11), 56, 100) : clamp(Math.min(L.laneW * .92, H * .12), 46, 120);
  L.cx = ox + B.arch.x * s; L.cy = oy + B.arch.y * s; L.cr = B.arch.r * s; L.archBottom = oy + B.h * s;
  // Centre text baseline: 30 design px under the arch centre (Web 1920 - 10)
  L.titleY = clamp(portrait ? H * .42 : L.cy + 30 * s, L.hudBottom + 50, L.baseY - L.charH * 1.3 - 20);
  const game = $('game');
  game.style.setProperty('--s', Math.min(W / 1797, H / 1011));   // artboard scale: HUD, start and end screens
  game.style.setProperty('--k', portrait ? Math.min(1, W / 520) : s);  // office art scale: intro block
  const intro = $('intro');
  intro.style.left = L.cx + 'px';
  intro.style.top = (portrait ? H * .34 : L.cy - 38 * s) + 'px';   // icons top sits 38 px above the arch centre
  fitHudTitle();
  P.x = P.tx = clamp(L.fieldL + P.u * (L.fieldR - L.fieldL), minX(), maxX());
  updateHud();
}
const charW = () => L.charH * .42;
const minX = () => L.fieldL + charW() * .45;
const maxX = () => L.fieldR - charW() * .45;
const toScreen = (x, y) => [L.ox + x * L.s, L.oy + y * L.s];

/* ======================================================================
 * HUD and messages
 * ==================================================================== */

function progress() {
  if (state === 'live' || state === 'end') return 100;
  const p = PHASES[phase], n = p.cards.filter(c => caught.has(c.id)).length;
  return Math.round(p.range[0] + (p.range[1] - p.range[0]) * n / p.cards.length);
}
// The phase name has a fixed slot in the plate (up to the percentage); long names shrink to fit
function fitHudTitle() {
  const el = $('phaseName'); el.style.fontSize = '';
  if (portrait) return;
  const max = 300, w = el.scrollWidth;
  if (w > max) el.style.fontSize = (18 * max / w).toFixed(2) + 'px';
}
function updateHud(pop) {
  const p = PHASES[phase], n = p.cards.filter(c => caught.has(c.id)).length, done = state === 'live' || state === 'end';
  const name = done ? PHASES[PHASES.length - 1].title : portrait ? p.short : p.title;   // narrow HUD: just "FASE 1"
  if ($('phaseName').textContent !== name) { $('phaseName').textContent = name; fitHudTitle(); }
  $('hud').classList.toggle('full', done);
  $('pct').textContent = progress() + '%';
  $('fill').style.width = progress() + '%';
  $('live').classList.toggle('on', done);
  if (pop) { const h = $('hud'); h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop'); setTimeout(() => h.classList.remove('pop'), 250); }
}
// Centre text: phase titles and short calls share one spot and one style (Web 1920 - 10).
// A new line replaces the current one straight away.
function centre(text, dur = 1.1, big = false) {
  bigText = { t: 0, dur, text, big };
  $('call').textContent = text;   // screen readers
}
function call(text) { centre(text, 1.1); }
function countdown() {
  const diff = Math.max(0, new Date(CONFIG.countdownTo).getTime() - Date.now());
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  $('countdown').textContent = diff ? [d, h, m, s].map(v => String(v).padStart(2, '0')).join(':') : 'HAPPY 2027!';
}

/* ======================================================================
 * Sound (Web Audio, no files; swap for HOUSE cues later)
 * ==================================================================== */

let soundOn = true, audio = null, noiseBuf = null;
try { soundOn = localStorage.getItem(CONFIG.soundKey) !== 'off'; } catch (e) {}
function ac() {
  if (!soundOn) return null;
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); return audio; } catch (e) { return null; }
}
function tone(f, at = 0, dur = .15, type = 'sine', vol = .05, to = 0, out = null) {
  const a = ac(); if (!a) return;
  try {
    const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + at;
    o.type = type; o.frequency.setValueAtTime(f, t0); if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + .01); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g).connect(out || a.destination); o.start(t0); o.stop(t0 + dur + .05);
  } catch (e) {}
}
function noise(at = 0, dur = .3, vol = .08, from = 2400, to = 300, out = null) {
  const a = ac(); if (!a) return;
  try {
    if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(), t0 = a.currentTime + at;
    src.buffer = noiseBuf; f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    src.connect(f).connect(g).connect(out || a.destination); src.start(t0); src.stop(t0 + dur + .05);
  } catch (e) {}
}
function bell(f, at = 0, dur = .5, vol = .05) { tone(f, at, dur, 'sine', vol); tone(f * 2.006, at, dur * .55, 'sine', vol * .3); tone(f * 3.02, at, dur * .25, 'triangle', vol * .08); }
// Each music start gets its own bus, so mute and stop cut everything queued on it at once
let bus = null;
function musicBus() {
  const a = ac(); if (!a) return null;
  fadeBus();   // notes still queued on an older bus fade out with it
  bus = a.createGain(); bus.gain.value = 1; bus.connect(a.destination);
  return bus;
}
function fadeBus() { if (bus && audio) { try { const t = audio.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(bus.gain.value, t); bus.gain.linearRampToValueAtTime(0, t + .25); } catch (e) {} } }

// Gameplay music: a soft lo-fi loop (100 bpm, Am7 - Fmaj7 - Cmaj7 - G6) that builds with the phases:
// phase 1 pads and bass, phase 2 adds a brushed beat, phase 3 adds a bell arpeggio.
let gmOn = false, gmTimer = 0, gmBar = 0;
const GM_CHORDS = [[220, 261.63, 329.63, 392], [174.61, 220, 261.63, 329.63], [130.81, 196, 246.94, 329.63], [196, 246.94, 293.66, 329.63]];
function gameMusicStart() {
  if (gmOn) return; gmOn = true; gmBar = 0;
  const out = musicBus(); if (!out) { gmOn = false; return; }
  const B = 2.4, e = B / 8;   // bar, eighth note
  const bar = () => {
    if (!gmOn || !soundOn) return;
    const c = GM_CHORDS[gmBar % 4], lvl = state === 'transition' ? 2 : phase;
    c.forEach((f, i) => { tone(f, i * .02, B * .98, 'sine', .011, 0, out); tone(f * 2, .03 + i * .02, B * .6, 'triangle', .0025, 0, out); });
    [0, 3, 4, 6].forEach(k => tone(c[0] / 2, k * e, e * 1.6, 'sine', k ? .022 : .03, 0, out));
    if (lvl >= 1) {
      [0, 4].forEach(k => tone(110, k * e, .16, 'sine', .035, 42, out));                     // soft kick
      [2, 6].forEach(k => noise(k * e, .12, .012, 2400, 1800, out));                          // brushed snare
      for (let k = 1; k < 8; k += 2) noise(k * e, .04, .006, 8000, 7000, out);                 // hat
    }
    if (lvl >= 2) [0, 1, 2, 3, 2, 1, 2, 3].forEach((n, k) => tone(c[n] * 4, k * e + .01, .22, 'sine', .006, 0, out));
    gmBar++;
    gmTimer = setTimeout(bar, B * 1000);
  };
  bar();
}
function gameMusicStop() { gmOn = false; clearTimeout(gmTimer); fadeBus(); }

const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5];
const SFX = {
  pickup(i) { tone(1500, 0, .04, 'triangle', .02); bell(SCALE[i % SCALE.length], .015, .32, .045); },
  feedback() { tone(420, 0, .3, 'sine', .07, 150); tone(310, .1, .28, 'triangle', .04, 120); },
  cake() { noise(0, .35, .09, 3000, 400); bell(1318.5, .12, .3, .03); bell(1760, .2, .35, .03); },
  transition() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(f, i * .08, .55, .045)); },
  live() { [523.25, 659.25, 783.99].forEach(f => bell(f, 0, 1.1, .035)); bell(1046.5, .18, 1.2, .05); noise(.05, .5, .04, 5000, 1500); },
  ping() { bell(1567.98, 0, .25, .045); bell(2093, .1, .35, .04); },
  send() { noise(0, .18, .035, 900, 3000); tone(880, .03, .12, 'triangle', .03, 1320); },
  ui() { tone(900, 0, .06, 'triangle', .03); }
};

/* ======================================================================
 * Game flow
 * ==================================================================== */

function show(id, on) { $(id).classList.toggle('hidden', !on); }

function start() {
  ac(); SFX.ui();
  phase = 0; caught.clear(); drops = []; parts = []; poofs = []; flyers = []; confetti = []; missed = [];
  spawnT = .6; lastLane = -1; lastKind = ''; clock = 0; shake = 0; fbHits = 0; niceShown = almostShown = false;
  lv.fill(0); ringShown.fill(0);
  P.u = .5; P.x = P.tx = (L.fieldL + L.fieldR) / 2; P.dizzy = P.inv = P.hop = P.hopV = 0;
  ['startScreen', 'startBg', 'endScreen', 'pauseScreen'].forEach(id => show(id, false));
  $('game').classList.remove('ending');
  $('endScreen').classList.remove('in'); $('acts').classList.remove('show'); $('msg').classList.remove('show'); $('reply').classList.remove('show');
  $('hud').classList.remove('hidden'); $('pauseBtn').classList.remove('hidden');
  stopMusic(); gameMusicStop(); $('wave').classList.remove('show');
  setTimeout(gameMusicStart, 300);
  bigText = null; introT = 0; introN = 0; showIntro();
  state = 'intro'; arrows(true); resize(); updateHud();
}

// Countdown screen before play (design: instructions + 3, 2, 1)
function showIntro() {
  // Icons as drawn in Web 1920 - 7: concave arrows 25 x 24, mouse 30 x 45
  const mouse = '<svg class="big" viewBox="0 0 30 45"><rect x="1.5" y="1.5" width="27" height="42" rx="13.5"/><path d="M1.5 20.5h27M15 1.5v5.5M15 17.5v3"/><rect x="12" y="7" width="6" height="10.5" rx="3"/></svg>';
  const finger = '<svg class="big" viewBox="0 0 30 45"><path d="M11 22V8a2.6 2.6 0 0 1 5.2 0v12M16.2 17a2.6 2.6 0 0 1 5.2 0v5M21.4 20a2.6 2.6 0 0 1 5.2 0v8c0 8-4.5 14-11.5 14-4.5 0-7-2-9-5.6L3 30a2.6 2.6 0 0 1 4.2-3L11 31"/></svg>';
  const tri = d => `<svg viewBox="0 0 25 24"><path d="${d ? 'M23.5 12L2.5 2.2Q7.5 12 2.5 21.8z' : 'M1.5 12L22.5 2.2Q17.5 12 22.5 21.8z'}"/></svg>`;
  $('introIcons').innerHTML = tri(0) + (COARSE ? finger : mouse) + tri(1);
  // Two lines as in the design: the first sentence, then the rest
  const txt = COARSE ? CONFIG.copy.introTouch : CONFIG.copy.introMouse, cut = txt.indexOf('. ') + 1;
  $('introText').textContent = '';
  [txt.slice(0, cut || txt.length), cut ? txt.slice(cut + 1) : ''].forEach((ln, i) => { if (!ln) return; if (i) $('introText').append(document.createElement('br')); $('introText').append(ln); });
  $('introNum').textContent = '3'; $('intro').classList.remove('hidden');
}
function pauseGame() {
  if (state !== 'play' && state !== 'transition') return;
  resumeState = state; state = 'paused'; show('pauseScreen', true); arrows(false); keyDir = btnDir = 0; gameMusicStop();
}
function resumeGame() { if (state !== 'paused') return; state = resumeState; show('pauseScreen', false); arrows(true); last = 0; gameMusicStart(); }

function phaseCards() { return PHASES[phase].cards; }
const isFalling = id => drops.some(d => !d.gone && d.kind === 'card' && d.id === id);

function spawn(dt) {
  const pace = PHASES[phase].pace;
  spawnT -= dt; if (spawnT > 0) return;
  const live = drops.filter(d => !d.gone);
  if (live.length >= pace.maxOnScreen) { spawnT = .12; return; }

  // Eligible cards: not caught, not on screen; missed cards wait a moment before they return
  const now = clock;
  const pool = phaseCards().filter(c => !caught.has(c.id) && !isFalling(c.id) && !missed.some(m => m.id === c.id && m.readyAt > now));
  const caughtHere = phaseCards().some(c => caught.has(c.id));
  let kind = 'card';
  const r = Math.random();
  if (r < pace.feedback && lastKind === 'card' && caughtHere && fbHits < pace.maxFeedbackHits && !live.some(d => d.kind === 'feedback')) kind = 'feedback';
  else if (r > 1 - pace.cake && live.length >= 2 && !live.some(d => d.kind === 'cake')) kind = 'cake';
  if (kind === 'card' && !pool.length) { spawnT = .25; return; }

  let card = null, notLane = -1;
  if (kind === 'card') {
    // Missed cards that are ready get priority
    const m = missed.find(x => x.readyAt <= now && pool.some(c => c.id === x.id));
    card = m ? pool.find(c => c.id === m.id) : pick(pool);
    if (m) { notLane = m.notLane; missed = missed.filter(x => x !== m); }
  }

  const lanes = L.lanes.map((x, i) => i).filter(i => {
    if (i === notLane || (i === lastLane && L.lanes.length > 2)) return false;
    // Keep the top of the lane free, and never drop feedback right behind a card in the same lane
    return !live.some(d => d.lane === i && (d.y < L.hudBottom + L.cardH * 2.2 || (kind === 'feedback' && d.kind === 'card' && d.y < L.catchY)));
  });
  if (!lanes.length) { spawnT = .15; return; }
  const lane = pick(lanes);

  const d = { kind, lane, id: card ? card.id : null, age: 0, gone: false, ph: rand(0, 6.28), rot: 0 };
  if (kind === 'card') { d.img = CARD[card.id].img; d.color = CARD[card.id].color; }
  else if (kind === 'feedback') { d.img = feedbackImg; d.color = '#ff5a4a'; }
  else { d.img = cakeImg; d.color = '#ffd3a1'; }
  sizeDrop(d);
  d.x = L.lanes[lane]; d.y = L.hudBottom - d.h * .2; d.vy = H * pace.fall * (portrait ? .92 : 1);
  drops.push(d); lastLane = lane; lastKind = kind;
  spawnT = pace.every * rand(.85, 1.15);
}

function sizeDrop(d) {
  const h = d.kind === 'card' ? L.cardH : L.cardH * .72;
  d.h = h; d.w = ready(d.img) ? h * iw(d.img) / ih(d.img) : h * .8;
}

function hits(d) {
  const dx = Math.abs(d.x - P.x), dy = d.y - L.catchY, k = d.kind === 'feedback' ? .34 : .4;
  return dx < charW() * .5 + d.w * k && dy > -(d.h * .5 + L.charH * .22) && dy < L.charH * .3;
}

function onCatch(d) {
  P.squash = 1; P.hopV = -L.charH * 1.6;
  if (d.kind === 'card') {
    if (caught.has(d.id)) return;
    caught.add(d.id); missed = missed.filter(m => m.id !== d.id);
    const n = phaseCards().filter(c => caught.has(c.id)).length, total = phaseCards().length;
    sparkle(d.x, d.y, d.color, 10); flyToHud(d);
    SFX.pickup(caught.size);
    updateHud(true);
    if (n === total) return phaseComplete();
    if (!niceShown && n >= Math.ceil(total / 2)) { niceShown = true; call(CONFIG.copy.nice); }
    if (phase === PHASES.length - 1 && !almostShown && total - n <= 2) { almostShown = true; call(CONFIG.copy.almost); }
  } else if (d.kind === 'feedback') {
    // Return exactly one caught card of the current phase to the pool
    const mine = phaseCards().filter(c => caught.has(c.id));
    fbHits++; P.dizzy = 1.1; P.inv = 1.1; shake = RM ? 0 : .45;
    sparkle(d.x, d.y, '#ff5a4a', 16); SFX.feedback(); call(CONFIG.copy.feedback);
    if (mine.length) {
      const back = pick(mine); caught.delete(back.id);
      // The returned card pops out of the character and floats off: it will fall again later
      flyers.push({ img: CARD[back.id].img, x: P.x, y: L.catchY, tx: P.x + (P.x < (L.fieldL + L.fieldR) / 2 ? 1 : -1) * L.laneW * 1.4, ty: L.hudBottom + 20, t: 0, dur: .8, h: L.cardH * .8, out: true });
      missed.push({ id: back.id, notLane: -1, readyAt: clock + 1.2 });
    }
    updateHud(true);
  } else {
    // Cake: clear everything that is falling, collected set untouched
    call(CONFIG.copy.cake); SFX.cake();
    drops.forEach(o => { if (!o.gone) { o.gone = true; sparkle(o.x, o.y, o.color, 8); if (o.kind === 'card') missed.push({ id: o.id, notLane: o.lane, readyAt: clock + .8 }); } });
    sparkle(d.x, d.y, d.color, 12); spawnT = Math.max(spawnT, .7);
  }
}

function phaseComplete() {
  drops.forEach(o => { if (!o.gone) { o.gone = true; sparkle(o.x, o.y, o.color, 8); } });
  missed = [];
  if (phase === PHASES.length - 1) return goLive();
  state = 'transition'; transT = 0; transStep = 0;
  SFX.transition(); centre(PHASES[phase].done, 1.2);
}

function goLive() {
  state = 'live'; liveT = 0; arrows(false); $('pauseBtn').classList.add('hidden'); gameMusicStop();
  updateHud(true);
}

// End scene music: a supplied file, or a soft synthesised lounge loop (Rhodes-like 7th chords)
let musicOn = false, musicTimer = 0, musicEl = null;
function startMusic() {
  musicOn = true; $('waveLabel').textContent = CONFIG.copy.music; $('wave').classList.add('show');
  if (!soundOn) return;
  if (CONFIG.endMusic) { try { musicEl = musicEl || new Audio(CONFIG.endMusic); musicEl.loop = true; musicEl.volume = .5; musicEl.currentTime = 0; musicEl.play().catch(() => {}); } catch (e) {} return; }
  const chords = [[220, 261.63, 329.63, 392], [146.83, 174.61, 220, 261.63], [196, 246.94, 293.66, 349.23], [130.81, 164.81, 196, 246.94]];
  let i = 0; const out = musicBus();
  const bar = () => {
    if (!musicOn || !soundOn) return;
    const c = chords[i++ % chords.length];
    c.forEach((f, k) => { tone(f, k * .03, 2.2, 'sine', .018, 0, out); tone(f * 2, k * .03 + .01, 1.2, 'triangle', .005, 0, out); });
    tone(c[0] / 2, 0, .5, 'sine', .03, 0, out); tone(c[0] / 2 * 1.5, 1.05, .45, 'sine', .02, 0, out);
    noise(.5, .08, .006, 7000, 6000, out); noise(1.5, .08, .006, 7000, 6000, out);
    musicTimer = setTimeout(bar, 2100);
  };
  bar();
}
function stopMusic() { musicOn = false; clearTimeout(musicTimer); fadeBus(); if (musicEl) { try { musicEl.pause(); } catch (e) {} } }

function showEnd() {
  state = 'end';
  const c = CONFIG.characters[charKey], art = $('endArt');
  art.className = 'art' + (c.endImage ? '' : ' placeholder');
  art.style.backgroundImage = c.endImage ? `url("${c.endImage}")` : '';
  art.innerHTML = c.endImage ? '' : `<div class="phLabel">Eindbeeld ${c.name} thuis<br>(beeld volgt van HOUSE)</div>`;
  $('wave').classList.remove('show');
  $('msgText').textContent = CONFIG.copy.message(c.name);
  show('endScreen', true); requestAnimationFrame(() => $('endScreen').classList.add('in'));
  $('game').classList.add('ending');
  $('hud').classList.add('hidden');
}

/* ======================================================================
 * Effects
 * ==================================================================== */

function sparkle(x, y, color, n) {
  if (RM) n = Math.ceil(n / 3);
  for (let i = 0; i < n; i++) { const a = rand(0, 6.283), v = rand(60, 200); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, g: 320, life: rand(.3, .6), max: .6, color, s: rand(2.5, 5), star: Math.random() < .4 }); }
}
function flyToHud(d) {
  const fr = frameEl.getBoundingClientRect(), br = $('fill').parentElement.getBoundingClientRect();
  const tx = br.left - fr.left + br.width * progress() / 100, ty = br.top - fr.top + 4;
  flyers.push({ img: d.img, x: d.x, y: d.y, tx, ty, t: 0, dur: .42, h: d.h });
}
// Finale: soft bursts of light over the arch plus slow glitter, in the phase colours (replaces paper confetti)
function throwConfetti() {
  const cols = ['#ffd27a', '#bfeecc', '#fff3dc', '#c6a6f5', '#ffb27a'], k = Math.max(.5, L.s);
  const spots = [[-.55, -.15, 0], [.5, -.3, .14], [0, -.6, .3], [-.25, .1, .5], [.3, .15, .66]];
  spots.slice(0, RM ? 2 : 5).forEach(([dx, dy, at], j) => {
    const x = L.cx + dx * L.cr, y = L.cy + dy * L.cr, c = cols[j % cols.length], n = RM ? 14 : 34;
    for (let i = 0; i < n; i++) {
      const a = i / n * 6.283 + rand(-.08, .08), v = rand(150, 300) * k;
      confetti.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, delay: at, life: rand(1.1, 1.6), max: 1.6, c: Math.random() < .25 ? '#ffffff' : c, s: rand(1.6, 2.8) * k, burst: true });
    }
    confetti.push({ x, y, vx: 0, vy: 0, delay: at, life: .5, max: .5, c, flash: true, s: 90 * k });
  });
  if (!RM) for (let i = 0; i < 70; i++) confetti.push({ x: rand(L.fieldL, L.fieldR), y: rand(-H * .1, H * .35), vx: rand(-10, 10), vy: rand(30, 70) * k, delay: rand(.2, 1), life: rand(1.4, 2.2), max: 2.2, c: pick(cols), s: rand(1.2, 2.4) * k, ph: rand(0, 6), glitter: true });
}
function arrows(on) { ['left', 'right'].forEach(id => $(id).classList.toggle('hidden', !on)); }

/* ======================================================================
 * Update
 * ==================================================================== */

function update(dt, t) {
  const done = state === 'live' || state === 'end';
  const tgt = [phase >= 1 || done ? 1 : 0, phase >= 2 || done ? 1 : 0, done ? 1 : 0];
  for (let i = 0; i < 3; i++) lv[i] += (tgt[i] - lv[i]) * (1 - Math.exp(-dt * 1.6));
  PHASES.forEach((p, i) => {
    const goal = i < phase || done ? 1 : i === phase ? p.cards.filter(c => caught.has(c.id)).length / p.cards.length : 0;
    ringShown[i] += (goal - ringShown[i]) * (1 - Math.exp(-dt * 6));
  });
  if (state === 'paused' || state === 'start' || state === 'end') return;

  if (state === 'intro') {
    introT += dt;
    const n = 3 - Math.floor(introT);
    if (n !== introN && n > 0) { introN = n; const el = $('introNum'); el.textContent = n; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); tone(n === 1 ? 880 : 660, 0, .12, 'triangle', .035); }
    if (introT >= 3) { $('intro').classList.add('hidden'); state = 'play'; spawnT = .6; SFX.transition(); centre(PHASES[phase].title, 1.6); }
  }

  // Player
  if (state === 'play' || state === 'transition' || state === 'intro') {
    const dir = keyDir || btnDir;
    if (dir) { P.tx += dir * (L.fieldR - L.fieldL) * 1.15 * dt; mouseX = null; }
    else if (mouseX !== null) P.tx = mouseX;
  }
  P.tx = clamp(P.tx, minX(), maxX());
  const px = P.x; P.x += (P.tx - P.x) * (1 - Math.exp(-dt * 16)); P.x = clamp(P.x, minX(), maxX());
  P.vx = (P.x - px) / Math.max(dt, 1e-3); P.u = (P.x - L.fieldL) / Math.max(1, L.fieldR - L.fieldL);
  P.lean += ((RM ? 0 : clamp(P.vx / (W * 1.2), -1, 1) * .14) - P.lean) * (1 - Math.exp(-dt * 12));
  // 3 = back view when standing; sliding right shows the right profile (0), left the left profile (6).
  // The turn steps through the in-between views one at a time, quickly.
  const sp = P.vx / Math.max(1, L.fieldR - L.fieldL);
  const goal = sp > .22 ? 0 : sp < -.22 ? 6 : Math.abs(sp) < .08 ? 3 : P.frame < 3 ? 0 : P.frame > 3 ? 6 : 3;
  if (goal !== P.frame) {
    P.holdT += dt;
    const wait = goal === 3 && (P.frame === 0 || P.frame === 6) ? .12 : .04;
    if (P.holdT > wait) { P.prev = P.frame; P.frame += Math.sign(goal - P.frame); P.fade = 0; P.holdT = 0; }
  } else P.holdT = 0;
  P.fade = Math.min(1, P.fade + dt / .07);
  P.hopV += L.charH * 14 * dt; P.hop += P.hopV * dt; if (P.hop > 0) { P.hop = 0; P.hopV = 0; }
  P.squash *= Math.exp(-dt * 9); P.dizzy = Math.max(0, P.dizzy - dt); P.inv = Math.max(0, P.inv - dt);
  shake = Math.max(0, shake - dt * 1.6);

  if (state === 'play') { clock += dt; spawn(dt); }

  if (state === 'transition') {
    transT += dt;
    if (transT > 1.3 && transStep === 0) { transStep = 1; phase++; niceShown = almostShown = false; fbHits = 0; updateHud(); centre(PHASES[phase].title, 1.6); }
    if (transT > 2.2) { state = 'play'; spawnT = .3; }
  }

  // Finale timeline: 0.4s LIVE + light bursts, 1.7s scene, 3.0s phone, 4.2s reply, 4.9s actions
  if (state === 'live') {
    const before = liveT; liveT += dt;
    const at = x => before < x && liveT >= x;
    if (at(.4)) { SFX.live(); throwConfetti(); centre(CONFIG.copy.live, .9, true); P.hopV = -L.charH * 2.6; }
    if (at(1.7)) showEnd();
  }

  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]; d.age += dt;
    if (d.gone) { drops.splice(i, 1); continue; }
    d.y += d.vy * dt; d.rot = Math.sin(d.age * (d.kind === 'feedback' ? 7 : 2.2) + d.ph) * (d.kind === 'feedback' ? .08 : .045);
    if (state === 'play' && hits(d)) {
      if (d.kind === 'feedback' && P.inv > 0) continue;
      drops.splice(i, 1); onCatch(d); continue;
    }
    if (d.y - d.h > H) {
      // Missed: the same card comes back later in another lane. No penalty.
      if (d.kind === 'card' && !caught.has(d.id)) missed.push({ id: d.id, notLane: d.lane, readyAt: clock + rand(1, 2.2) });
      drops.splice(i, 1);
    }
  }
  for (let i = flyers.length - 1; i >= 0; i--) { flyers[i].t += dt; if (flyers[i].t >= flyers[i].dur) flyers.splice(i, 1); }
  for (let i = parts.length - 1; i >= 0; i--) { const q = parts[i]; q.life -= dt; q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= Math.exp(-dt * 2); if (q.life <= 0) parts.splice(i, 1); }
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    if (c.delay > 0) { c.delay -= dt; continue; }
    c.life -= dt;
    if (c.burst) { c.vx *= Math.exp(-dt * 2.6); c.vy = c.vy * Math.exp(-dt * 2.6) + 90 * dt; }
    if (c.glitter) c.x += Math.sin(t * 2 + c.ph) * 12 * dt;
    c.x += c.vx * dt; c.y += c.vy * dt;
    if (c.life <= 0 || c.y > H + 20) confetti.splice(i, 1);
  }
  if (bigText) { bigText.t += dt; if (bigText.t > bigText.dur + .3) bigText = null; }

  if (state === 'play' || state === 'transition' || state === 'intro') {
    const ay = L.baseY - L.charH * .08, off = charW() * .5 + 42;
    $('left').style.transform = `translate(${P.x - off}px,${ay}px)`;
    $('right').style.transform = `translate(${P.x + off}px,${ay}px)`;
  }
}

/* ======================================================================
 * Render
 * ==================================================================== */

function drawOffice(t) {
  ctx.fillStyle = '#2b2724'; ctx.fillRect(0, 0, W, H);
  if (L.portraitArt) { ctx.drawImage(bgPortrait, L.ox, L.oy, iw(bgPortrait) * L.s, ih(bgPortrait) * L.s); return vignette(); }
  if (ready(bgImg)) ctx.drawImage(bgImg, L.ox, L.oy, CONFIG.bg.w * L.s, CONFIG.bg.h * L.s);
  const s = L.s, B = CONFIG.bg;
  // The office warms up with every phase
  const lampA = (.14 + .18 * lv[0] + .14 * lv[1]) * (1 - .4 * lv[2]);
  B.lamps.forEach(([x, y], i) => { const [sx, sy] = toScreen(x, y); glow('#ffb35c', sx, sy, 70 * s * (1 + .25 * lv[1]), lampA * (.85 + .15 * Math.sin(t * 2 + i))); });
  B.candles.forEach(([x, y], i) => { const [sx, sy] = toScreen(x, y); glow('#ffc070', sx, sy, 34 * s, (.15 + .25 * lv[0]) * (.7 + .3 * Math.sin(t * 7 + i * 1.7) * Math.sin(t * 3.1 + i))); });
  if (lv[1] > .01) glow('#ffd9a8', L.cx + Math.sin(t * .9) * L.cr * .7, L.cy + Math.cos(t * .6) * L.cr * .3, L.cr * .7, .09 * lv[1] * (1 - lv[2]));
  vignette();
}
function vignette() {
  const vg = ctx.createRadialGradient(W / 2, H * .55, Math.min(W, H) * .35, W / 2, H * .55, Math.max(W, H) * .85);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.4)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// Progress traced along the painted arch: up the left side, over the top, down the right side.
// Each phase owns a stretch proportional to its share (25 / 50 / 25).
function archPoint(u) {
  const side = Math.max(0, L.archBottom - L.cy), r = L.cr, arc = Math.PI * r, total = side * 2 + arc;
  let d = u * total;
  if (d <= side) return [L.cx - r, L.archBottom - d];
  d -= side;
  if (d <= arc) { const a = Math.PI + d / r; return [L.cx + Math.cos(a) * r, L.cy + Math.sin(a) * r]; }
  d -= arc; return [L.cx + r, L.cy + d];
}
function strokeArch(u0, u1) {
  ctx.beginPath(); const n = Math.max(2, Math.ceil((u1 - u0) * 160));
  for (let i = 0; i <= n; i++) { const [x, y] = archPoint(u0 + (u1 - u0) * i / n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
}
function drawRing(t) {
  if (L.portraitArt) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  PHASES.forEach((p, i) => {
    const u0 = p.range[0] / 100 + .004, u1 = p.range[1] / 100 - .004, f = ringShown[i];
    if (f < .003) return;
    ctx.strokeStyle = p.color; ctx.lineWidth = 3; ctx.shadowColor = p.color; ctx.shadowBlur = 12 + (i === phase ? 5 * Math.sin(t * 4) : 0);
    ctx.globalAlpha = i === phase ? .95 : .7; strokeArch(u0, u0 + (u1 - u0) * f);
  });
  ctx.restore();
}

// Set a canvas font, shrinking it until the text fits maxW
function fitFont(text, weight, size, maxW) {
  ctx.font = `${weight} ${size}px Safiro,Stolzl,Arial,sans-serif`;
  const w = ctx.measureText(text).width;
  if (w > maxW) { size *= maxW / w; ctx.font = `${weight} ${size}px Safiro,Stolzl,Arial,sans-serif`; }
  return size;
}
// Centre text in the play-screen style: Safiro SemiBold 38 px (design), white, no shadow.
// Fades in with a small rise, holds, then fades out.
function drawTitle() {
  if (!bigText || state === 'start' || state === 'end') return;
  const b = bigText, k = L.portraitArt || portrait ? clamp(W / 520, .55, 1) : L.s;
  const a = clamp(b.t / .18, 0, 1) * (1 - clamp((b.t - b.dur) / .3, 0, 1));
  if (a <= 0) return;
  const sc = b.big ? .75 + .25 * easeBack(b.t / .4) : 1, rise = b.big ? 0 : (1 - easeOut(b.t / .3)) * 8 * k;
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = a;
  ctx.fillStyle = b.big ? '#bfeecc' : '#ffffff';
  const fsz = 38 * k * (b.big ? 2.4 : 1) * sc;
  if ('letterSpacing' in ctx) ctx.letterSpacing = (-.03 * fsz).toFixed(2) + 'px';   // XD tracking -30
  fitFont(b.text, 600, fsz, W - 32);
  ctx.fillText(b.text, L.cx, L.titleY + rise);
  ctx.restore();
}

function drawDrop(d, t) {
  if (!ready(d.img)) return;
  const fadeIn = clamp(d.age / .18, 0, 1);
  softShadow(d.x + 4, d.y + d.h * .6, d.w * 1.15, d.h * .3, .42 * fadeIn);
  softGlow(d.color, d.x, d.y, d.h * 1.2, (d.kind === 'feedback' ? .55 : .48) * fadeIn);
  ctx.save(); ctx.globalAlpha = fadeIn; ctx.translate(d.x, d.y); ctx.rotate(d.rot);
  const s = (d.kind === 'feedback' ? 1 + .05 * Math.sin(t * 12 + d.ph) : 1) * (.85 + .15 * fadeIn); ctx.scale(s, s);
  ctx.drawImage(d.img, -d.w / 2, -d.h / 2, d.w, d.h); ctx.restore();
}

function drawPlayer(t) {
  const fr = CHAR_FRAMES[charKey], x = P.x, y = L.baseY + P.hop, h = L.charH;
  // Warm floor glow and the dotted ring from the design
  glow('#ffd9a0', x, L.baseY - h * .02, h * .55, .32);
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.setLineDash([2, 6]); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(x, L.baseY - h * .02, h * .5, h * .17, 0, 0, 6.283); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(x, y);
  let rot = P.lean * .6; if (P.dizzy > 0) rot += Math.sin(P.dizzy * 22) * .12 * (P.dizzy / 1.1);
  ctx.rotate(rot); ctx.scale(1 + P.squash * .06, 1 - P.squash * .08);
  const blink = P.inv > 0 && Math.floor(t * 16) % 2;
  const drawF = (img, a) => { if (!ready(img) || a <= 0) return; const w = h * iw(img) / ih(img); ctx.globalAlpha = a * (blink ? .55 : 1); ctx.drawImage(img, -w / 2, -h, w, h); };
  if (P.fade < 1) drawF(fr[P.prev], 1 - P.fade);
  drawF(fr[P.frame], P.fade < 1 ? P.fade : 1); ctx.globalAlpha = 1;
  ctx.restore();
  if (P.dizzy > 0) for (let i = 0; i < 3; i++) {
    const a = t * 7 + i * 2.094; ctx.globalAlpha = Math.min(1, P.dizzy * 2);
    star(x + Math.cos(a) * h * .2, y - h * .98 + Math.sin(a) * h * .05, h * .045, t * 4, i % 2 ? '#ffd27a' : '#ff8a73'); ctx.globalAlpha = 1;
  }
}

function drawFX(t) {
  for (const q of parts) {
    ctx.globalAlpha = clamp(q.life / q.max, 0, 1) * (q.puff ? .55 : 1);
    if (q.star) star(q.x, q.y, q.s * 1.3, q.life * 6, q.color); else { ctx.fillStyle = q.color; ctx.beginPath(); ctx.arc(q.x, q.y, q.s / 2, 0, 6.283); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
  for (const f of flyers) {
    if (!ready(f.img)) continue;
    const k = easeInOut(f.t / f.dur), x = lerp(f.x, f.tx, k), y = lerp(f.y, f.ty, k) - (f.out ? Math.sin(k * Math.PI) * L.charH * .6 : 0);
    const h = f.out ? f.h : lerp(f.h, 16, k), w = h * iw(f.img) / ih(f.img);
    ctx.save(); ctx.globalAlpha = f.out ? 1 - k : 1 - k * .3; ctx.translate(x, y); ctx.rotate(f.out ? k * 2.4 : 0); ctx.drawImage(f.img, -w / 2, -h / 2, w, h); ctx.restore();
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const c of confetti) {
    if (c.delay > 0) continue;
    const f = clamp(c.life / c.max, 0, 1);
    if (c.flash) { softGlow(c.c, c.x, c.y, c.s * (1.4 - f * .4), f * .9); continue; }
    if (c.burst) {
      // a short light trail along the direction of travel
      ctx.globalAlpha = Math.min(1, f * 1.6); ctx.strokeStyle = c.c; ctx.lineWidth = c.s;
      ctx.beginPath(); ctx.moveTo(c.x - c.vx * .045, c.y - c.vy * .045); ctx.lineTo(c.x, c.y); ctx.stroke();
      softGlow(c.c, c.x, c.y, c.s * 5, f * .35);
    } else {
      const tw = .5 + .5 * Math.sin(t * 9 + c.ph);
      ctx.globalAlpha = Math.min(1, f * 1.5) * (.35 + .65 * tw); ctx.fillStyle = c.c;
      ctx.beginPath(); ctx.arc(c.x, c.y, c.s * (.6 + .5 * tw), 0, 6.283); ctx.fill();
    }
  }
  ctx.restore(); ctx.globalAlpha = 1;
}

function render(t) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.save();
  if (shake > 0) ctx.translate(Math.sin(t * 90) * shake * 7, Math.cos(t * 70) * shake * 4);
  drawOffice(t);
  if (state !== 'start') { drawRing(t); drawTitle(); for (const d of drops) drawDrop(d, t); drawPlayer(t); drawFX(t); }
  ctx.restore();
}

let last = 0, endBeats = 0;
function frame(now) {
  const dt = Math.min(.04, (now - (last || now)) / 1000); last = now; const t = now / 1000;
  update(dt, t);
  if (state !== 'end' || $('endScreen').classList.contains('hidden')) render(t);
  // End scene beats continue the finale timeline (3.0s phone, 4.2s reply, 4.9s actions)
  if (state === 'end') {
    liveT += dt;
    if (endBeats === 0 && liveT >= 3.0) { endBeats = 1; $('msg').classList.add('show'); SFX.ping(); }
    if (endBeats === 1 && liveT >= 4.2) { endBeats = 2; $('reply').classList.add('show'); SFX.send(); }
    if (endBeats === 2 && liveT >= 4.9) { endBeats = 3; $('acts').classList.add('show'); }
    if (!musicOn && liveT >= 2.3) startMusic();
  } else endBeats = 0;
  requestAnimationFrame(frame);
}

/* ======================================================================
 * Start screen, buttons and input
 * ==================================================================== */

function buildChars() {
  const box = $('chars');
  box.innerHTML = Object.entries(CONFIG.characters).map(([k, c]) => `
    <button class="char" type="button" role="radio" data-key="${k}" aria-checked="${k === charKey}">
      <img src="${c.card}" alt="">
      <div class="txt"><div class="nm">${c.name}</div><div class="rl">${c.role}</div><div class="tg">${c.tagline}</div></div>
    </button>`).join('');
  box.querySelectorAll('.char').forEach(b => b.addEventListener('click', () => {
    charKey = b.dataset.key; box.querySelectorAll('.char').forEach(x => x.setAttribute('aria-checked', String(x === b))); SFX.ui();
  }));
  box.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault(); const keys = Object.keys(CONFIG.characters), i = (keys.indexOf(charKey) + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + keys.length) % keys.length;
    box.querySelector(`[data-key="${keys[i]}"]`).click(); box.querySelector(`[data-key="${keys[i]}"]`).focus();
  });
}

// Skip / discover: smooth-scroll to the first website section (works inline and in an iframe)
function skipToSite() {
  try { if (window.parent !== window) window.parent.postMessage({ type: 'HOUSE_GAME_SKIP' }, '*'); } catch (e) {}
  try {
    const fe = window.frameElement;
    if (fe) {
      const doc = fe.ownerDocument, target = doc.querySelector(CONFIG.skipTarget) || fe.nextElementSibling;
      if (target) return target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return doc.defaultView.scrollBy({ top: fe.getBoundingClientRect().bottom, behavior: 'smooth' });
    }
  } catch (e) {}
  const t = document.querySelector(CONFIG.skipTarget) || $('game').nextElementSibling;
  if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function share() {
  let url = CONFIG.shareUrl;
  if (!url) { try { url = window.top.location.href; } catch (e) { url = document.referrer || location.href; } }
  const btn = $('share'), data = { title: CONFIG.copy.shareTitle, text: CONFIG.copy.shareText, url };
  if (navigator.share) { try { await navigator.share(data); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  let ok = false;
  try { await navigator.clipboard.writeText(data.text + ' ' + url); ok = true; } catch (e) {
    try { const ta = document.createElement('textarea'); ta.value = data.text + ' ' + url; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove(); } catch (e2) {}
  }
  const old = 'Deel met een collega'; btn.textContent = ok ? CONFIG.copy.copied : url; setTimeout(() => { btn.textContent = old; }, 2200);
}

function setSound(on) {
  soundOn = on; try { localStorage.setItem(CONFIG.soundKey, on ? 'on' : 'off'); } catch (e) {}
  $('soundBtn').innerHTML = svgIcon(on ? 'soundOn' : 'soundOff'); $('soundBtn').setAttribute('aria-pressed', String(on));
}

$('playBtn').addEventListener('click', start);
$('skip').addEventListener('click', skipToSite);
$('skip2').addEventListener('click', skipToSite);   // game stays paused while the page scrolls
$('again').addEventListener('click', start);
$('restart').addEventListener('click', start);
$('resume').addEventListener('click', resumeGame);
$('share').addEventListener('click', share);
$('pauseBtn').innerHTML = svgIcon('pause');
$('pauseBtn').addEventListener('click', () => state === 'paused' ? resumeGame() : pauseGame());
$('soundBtn').addEventListener('click', () => {
  setSound(!soundOn);
  if (soundOn) {
    SFX.ui();
    if (state === 'end' && musicOn) { stopMusic(); startMusic(); }
    if (['intro', 'play', 'transition'].includes(state)) { gmOn = false; gameMusicStart(); }
  } else { gameMusicStop(); fadeBus(); if (musicEl) { try { musicEl.pause(); } catch (e) {} } }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseGame(); if (state === 'end') stopMusic(); } });

const frameX = e => e.clientX - frameEl.getBoundingClientRect().left;
canvas.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse') { if (!keyDir && !btnDir) mouseX = frameX(e); return; }
  if (drag && drag.id === e.pointerId) P.tx = drag.px + (frameX(e) - drag.x) * 1.1;
});
canvas.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') { mouseX = frameX(e); return; }
  // Touch: relative drag, so the finger never covers the character
  try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  drag = { id: e.pointerId, x: frameX(e), px: P.x }; mouseX = null;
});
['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, e => { if (drag && drag.id === e.pointerId) drag = null; }));
canvas.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') mouseX = null; });
[['left', -1], ['right', 1]].forEach(([id, dir]) => {
  const b = $(id);
  b.addEventListener('pointerdown', e => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (err) {} btnDir = dir; mouseX = null; b.classList.add('held'); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, () => { if (btnDir === dir) btnDir = 0; b.classList.remove('held'); }));
});
addEventListener('keydown', e => {
  const k = e.key.toLowerCase(), onUi = e.target && /^(BUTTON|A)$/.test(e.target.tagName);
  const playing = state === 'play' || state === 'transition';
  if (playing && ['arrowleft', 'arrowright', 'a', 'd'].includes(k)) e.preventDefault();
  if (k === 'arrowleft' || k === 'a') keyDir = -1;
  if (k === 'arrowright' || k === 'd') keyDir = 1;
  if (k === 'escape' || (k === 'p' && !onUi)) state === 'paused' ? resumeGame() : pauseGame();
});
addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if ((k === 'arrowleft' || k === 'a') && keyDir === -1) keyDir = 0;
  if ((k === 'arrowright' || k === 'd') && keyDir === 1) keyDir = 0;
});
addEventListener('blur', () => { keyDir = btnDir = 0; drag = null; });

/* ======================================================================
 * Boot
 * ==================================================================== */

if (window.top === window) document.documentElement.classList.add('standalone');
document.querySelectorAll('.rk').forEach(e => { e.innerHTML = ROCKET; });
setSound(soundOn); buildChars(); updateHud(); countdown(); setInterval(countdown, 1000);
new ResizeObserver(resize).observe(frameEl); resize();
if (bgPortrait) bgPortrait.addEventListener('load', resize);
Object.values(CARD).forEach(c => { if (c.img instanceof HTMLImageElement) c.img.addEventListener('load', () => drops.forEach(d => d.img === c.img && sizeDrop(d))); });
requestAnimationFrame(frame);

// Read-only hook for automated checks
// Test-only shortcuts, active with ?test in the URL
const TEST = /[?&]test\b/.test(location.search) ? {
  jump(ph, n) { phase = ph; caught.clear(); for (let i = 0; i < ph; i++) PHASES[i].cards.forEach(c => caught.add(c.id)); PHASES[ph].cards.slice(0, n).forEach(c => caught.add(c.id)); updateHud(); },
  finish() { goLive(); },
  say(text) { centre(text, 99); }
} : null;
window.__game = { test: TEST, get state() { return state; }, get phase() { return phase; }, get caught() { return [...caught]; }, get drops() { return drops; }, get missed() { return missed; }, get progress() { return progress(); }, get fbHits() { return fbHits; }, P, L };
})();
