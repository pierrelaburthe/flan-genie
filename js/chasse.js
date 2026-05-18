// ============================================================
// LA CHASSE AU FLAN — mini-jeu marketing pour Avignon
// Trouve le 🍮 caché dans la foule en 3 manches qui durcissent.
// ============================================================

const W = window.WORDINGS;
const FLAN = W.symbols.flan;

// Pools d'emojis Festival d'Avignon, par proximité visuelle avec le flan
// (du plus différent au plus ressemblant)

// Foule du festival : artistes, théâtre, musique, Provence
const POOL_FAR = [
  "🎭", "🎪", "🤹", "💃", "🕺", "🎷", "🎸", "🎻", "🥁", "🎤",
  "🎨", "📜", "🎟", "🦋", "🌻", "🌿", "🫒", "🦗", "🍷", "🌞",
  "🏰", "⛪", "👒", "🎩", "🦢", "🌅"
];
// Comestibles de Provence, couleurs jaune/beige
const POOL_MEDIUM = ["🥖", "🥚", "🍞", "🧀", "🌰", "🐝"];
// Pâtisseries proches du flan (sans piéger)
const POOL_CLOSE = ["🥧", "🥐", "🍪", "🥞", "🟡"];

// Imitateurs qui font perdre si cliqués (très proches visuellement)
const TRAPS_SOFT = ["🍯", "🥮"];
const TRAPS_HARD = ["🍯", "🥮", "🍩", "🎂", "🧁", "🍰"];

// Multiplicateurs partagés hardcore / infinity (même difficulté de base)
const HARDCORE_MULTS = {
  timeMult: 0.78,
  chickenMult: 0.65,
  featherMult: 0.65,
  eggMult: 0.65,
  bubblesMult: 0.65,
  mutationMult: 0.78,
  swapMult: 0.78,
  trapsMult: 1.4,
  chickenSizeMult: 1.15,
  roosterMult: 1.5,
};

// 4 modes de difficulté
const MODES = {
  beginner: {
    label: W.modes.beginner.label,
    sub: W.modes.beginner.sub,
    timeMult: 1.7,
    chickenMult: 1.8,
    featherMult: 1.8,
    eggMult: 1.8,
    bubblesMult: 2.0,
    mutationMult: 1.8,
    swapMult: 1.8,
    trapsMult: 0.4,
    chickenSizeMult: 0.75,
    roosterMult: 0.3,
  },
  hardcore: {
    label: W.modes.hardcore.label,
    sub: W.modes.hardcore.sub,
    ...HARDCORE_MULTS,
  },
  infinity: {
    label: W.modes.infinity.label,
    sub: W.modes.infinity.sub,
    ...HARDCORE_MULTS,
  },
};

// 12 niveaux de base : 2 par génie. Gradation douce.
const ROUNDS_BASE = [
  // ===== GÉNIE 1 =====
  // L1 — Tutoriel : pas de poule, grille petite, large temps
  { cols: 7, rows: 4, time: 8,
    distractors: POOL_FAR,
    traps: [], trapsN: 0,
    mutation: 0, swap: 0, tint: 0,
    feathersInterval: 0, chickenInterval: 0, eggInterval: 0 },
  // L2 — Première poule, petite, lente
  { cols: 7, rows: 4, time: 7,
    distractors: POOL_FAR,
    traps: [], trapsN: 0,
    mutation: 0, swap: 0, tint: 0,
    feathersInterval: 0, chickenInterval: 4500, eggInterval: 0,
    chickenSize: 80 },

  // ===== GÉNIE 2 =====
  // L3 — Grille un peu plus grande, poule moyenne
  { cols: 8, rows: 5, time: 7,
    distractors: [...POOL_FAR, ...POOL_MEDIUM],
    traps: [], trapsN: 0,
    mutation: 0, swap: 0, tint: 0,
    feathersInterval: 0, chickenInterval: 3500, eggInterval: 0,
    chickenSize: 100 },
  // L4 — Premiers imitateurs, premières bulles
  { cols: 8, rows: 5, time: 6.5,
    distractors: [...POOL_FAR, ...POOL_MEDIUM, ...POOL_MEDIUM],
    traps: TRAPS_SOFT, trapsN: 2,
    mutation: 0, swap: 0, tint: 0,
    feathersInterval: 0, chickenInterval: 3000, eggInterval: 0,
    bubblesInterval: 2500, chickenSize: 120 },

  // ===== GÉNIE 3 =====
  // L5 — Têtes de poule qui tombent + tint
  { cols: 9, rows: 5, time: 6.5,
    distractors: [...POOL_MEDIUM, ...POOL_FAR.slice(0, 10)],
    traps: TRAPS_SOFT, trapsN: 3,
    mutation: 0, swap: 0, tint: 1,
    feathersInterval: 1600, chickenInterval: 2700, eggInterval: 0,
    bubblesInterval: 2000, chickenSize: 140 },
  // L6 — Première mutation des cases
  { cols: 9, rows: 6, time: 6,
    distractors: [...POOL_MEDIUM, ...POOL_MEDIUM, ...POOL_FAR.slice(0, 8)],
    traps: TRAPS_SOFT, trapsN: 4,
    mutation: 800, swap: 0, tint: 1,
    feathersInterval: 1200, chickenInterval: 2300, eggInterval: 0,
    bubblesInterval: 1700, chickenSize: 160 },

  // ===== GÉNIE 4 =====
  // L7 — Pool plus proche du flan
  { cols: 10, rows: 6, time: 6,
    distractors: [...POOL_MEDIUM, ...POOL_CLOSE, ...POOL_MEDIUM],
    traps: TRAPS_HARD.slice(0, 3), trapsN: 5,
    mutation: 650, swap: 0, tint: 2,
    feathersInterval: 950, chickenInterval: 2000, eggInterval: 0,
    bubblesInterval: 1400, chickenSize: 180 },
  // L8 — Premier œuf qui splash
  { cols: 10, rows: 6, time: 5.5,
    distractors: [...POOL_CLOSE, ...POOL_MEDIUM, ...POOL_CLOSE],
    traps: TRAPS_HARD.slice(0, 4), trapsN: 6,
    mutation: 550, swap: 0, tint: 2,
    feathersInterval: 750, chickenInterval: 1700, eggInterval: 5500,
    bubblesInterval: 1100, chickenSize: 200 },

  // ===== GÉNIE 5 =====
  // L9 — Swap des cases commence
  { cols: 10, rows: 7, time: 5.5,
    distractors: [...POOL_CLOSE, ...POOL_CLOSE, ...POOL_MEDIUM],
    traps: TRAPS_HARD.slice(0, 5), trapsN: 8,
    mutation: 450, swap: 650, tint: 2,
    feathersInterval: 600, chickenInterval: 1400, eggInterval: 4500,
    bubblesInterval: 900, chickenSize: 220, roosterChance: 0.05 },
  // L10 — Tout s'accélère, coq géant possible
  { cols: 10, rows: 7, time: 5,
    distractors: [...POOL_CLOSE, ...POOL_CLOSE, ...POOL_MEDIUM],
    traps: TRAPS_HARD.slice(0, 6), trapsN: 10,
    mutation: 380, swap: 500, tint: 2,
    feathersInterval: 450, chickenInterval: 1100, eggInterval: 3800,
    bubblesInterval: 750, chickenSize: 240, roosterChance: 0.08 },

  // ===== GÉNIE 6 =====
  // L11 — Boss s'éveille
  { cols: 11, rows: 7, time: 5,
    distractors: [...POOL_CLOSE, ...POOL_CLOSE, ...POOL_CLOSE],
    traps: TRAPS_HARD, trapsN: 11,
    mutation: 320, swap: 420, tint: 3,
    feathersInterval: 320, chickenInterval: 900, eggInterval: 2800,
    bubblesInterval: 550, chickenSize: 260, roosterChance: 0.12 },
  // L12 — Chaos final
  { cols: 11, rows: 7, time: 4.5,
    distractors: [...POOL_CLOSE, ...POOL_CLOSE, ...POOL_CLOSE],
    traps: TRAPS_HARD, trapsN: 14,
    mutation: 250, swap: 340, tint: 3,
    feathersInterval: 220, chickenInterval: 650, eggInterval: 2200,
    bubblesInterval: 420, chickenSize: 290, roosterChance: 0.18 },
];

const TOTAL_ROUNDS = ROUNDS_BASE.length;
let ROUNDS = ROUNDS_BASE; // recalculé via applyMode()

// ============================================================
// Sauvegarde de progression + médailles
// ============================================================
const SAVE_KEY = W.storage.saveKey;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); } catch {}
}

// Seuils en secondes pour décrocher chaque médaille (12 manches complètes)
const MEDAL_THRESHOLDS = {
  beginner: { gold: 35, silver: 45 },
  hardcore: { gold: 35, silver: 40 },
};

function getMedalForMode(mode, progress) {
  const p = progress[mode];
  if (!p || !p.bestTime) return null;
  const t = MEDAL_THRESHOLDS[mode];
  if (!t) return "🥉";
  if (p.bestTime <= t.gold) return "🥇";
  if (p.bestTime <= t.silver) return "🥈";
  return "🥉";
}

function getMedalForInfinity(progress) {
  const p = progress["infinity"];
  if (!p || !p.bestLevel) return null;
  if (p.bestLevel > 50) return "🥇";
  if (p.bestLevel > 30) return "🥈";
  if (p.bestLevel > 15) return "🥉";
  return null;
}

function saveBestTime(mode, timeSec) {
  const p = loadProgress();
  if (!p[mode]) p[mode] = { count: 0 };
  p[mode].count = (p[mode].count || 0) + 1;
  const isNewRecord = !p[mode].bestTime || timeSec < p[mode].bestTime;
  if (isNewRecord) p[mode].bestTime = timeSec;
  p[mode].lastDate = Date.now();
  saveProgress(p);
  return { progress: p, isNewRecord };
}

function saveBestLevel(mode, level) {
  const p = loadProgress();
  if (!p[mode]) p[mode] = { count: 0 };
  p[mode].count = (p[mode].count || 0) + 1;
  const isNewRecord = !p[mode].bestLevel || level > p[mode].bestLevel;
  if (isNewRecord) p[mode].bestLevel = level;
  p[mode].lastDate = Date.now();
  saveProgress(p);
  return { progress: p, isNewRecord };
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + "'" + (sec < 10 ? "0" : "") + sec + "''";
}

function updateModeBadges() {
  const progress = loadProgress();
  document.querySelectorAll(".mode-card").forEach(card => {
    const mode = card.dataset.mode;
    if (!mode) return;
    card.querySelectorAll(".mc-medal, .mc-record").forEach(el => el.remove());
    if (mode === "infinity") {
      const bestLevel = progress[mode] && progress[mode].bestLevel;
      if (bestLevel) {
        const medal = getMedalForInfinity(progress);
        if (medal) {
          const m = document.createElement("div");
          m.className = "mc-medal";
          m.textContent = medal;
          card.appendChild(m);
        }
        const t = document.createElement("div");
        t.className = "mc-record";
        t.textContent = W.records.labelInfinity + bestLevel;
        card.appendChild(t);
      }
    } else {
      const medal = getMedalForMode(mode, progress);
      if (medal) {
        const m = document.createElement("div");
        m.className = "mc-medal";
        m.textContent = medal;
        card.appendChild(m);
      }
      const time = progress[mode] && progress[mode].bestTime;
      if (time) {
        const t = document.createElement("div");
        t.className = "mc-record";
        t.textContent = W.records.label + formatTime(time);
        card.appendChild(t);
      }
    }
  });
}

function applyMode(modeName) {
  state.mode = modeName;
  const m = MODES[modeName];
  if (!m) return;
  ROUNDS = ROUNDS_BASE.map(r => ({
    ...r,
    time: +(r.time * m.timeMult).toFixed(1),
    chickenInterval: r.chickenInterval ? Math.max(180, Math.round(r.chickenInterval * m.chickenMult)) : 0,
    feathersInterval: r.feathersInterval ? Math.max(100, Math.round(r.feathersInterval * m.featherMult)) : 0,
    eggInterval: r.eggInterval ? Math.round(r.eggInterval * m.eggMult) : 0,
    bubblesInterval: r.bubblesInterval ? Math.round(r.bubblesInterval * m.bubblesMult) : 0,
    mutation: r.mutation ? Math.round(r.mutation * m.mutationMult) : 0,
    swap: r.swap ? Math.round(r.swap * m.swapMult) : 0,
    trapsN: Math.max(0, Math.round(r.trapsN * m.trapsMult)),
    chickenSize: r.chickenSize ? Math.round(r.chickenSize * m.chickenSizeMult) : undefined,
    roosterChance: r.roosterChance ? r.roosterChance * m.roosterMult : 0,
  }));
  // Theme class sur le body
  document.body.classList.remove("mode-beginner", "mode-hardcore", "mode-infinity");
  document.body.classList.add("mode-" + modeName);
}

// Bulles de texte qui flashent aléatoirement
const BUBBLES = W.bubbles;

// Présentation de chaque manche avant le round (12 manches, 2 par génie)
const GENIE_INTROS = W.genieIntros;
const GENIE_INTROS_INFINITY = W.genieIntrosInfinity;

const state = {
  round: 0,
  timeLeft: 0,
  timerId: null,
  mutationId: null,
  swapId: null,
  feathersId: null,
  chickenId: null,
  eggId: null,
  bubblesId: null,
  viteShown: false,
  playing: false,
  inTransition: false,
  startedAt: 0,
  perfect: true,
  ambientMuted: false,
  sfxMuted: false,
  mode: "beginner",
};

// Historique pour éviter que le flan reste au même endroit
const recentFlan = []; // { row, col }

const gridEl = document.getElementById("ch-grid");
const roundEl = document.getElementById("ch-round");
const timeEl = document.getElementById("ch-time");
const timerBlock = document.getElementById("ch-timer-block");
const overlayEl = document.getElementById("ch-overlay");
const introEl = document.getElementById("ch-intro");
const winEl = document.getElementById("ch-win");
const loseEl = document.getElementById("ch-lose");
// Boutons start/replay/retry remplacés par les .mode-card
const codeEl = document.getElementById("ch-code");
const loseEmoji = document.getElementById("ch-lose-emoji");
const loseTitle = document.getElementById("ch-lose-title");
const loseMsg = document.getElementById("ch-lose-msg");

function pickN(arr, n) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function pickFlanIdx(cols, rows) {
  const cells = cols * rows;
  const lastPos = recentFlan.length > 0 ? recentFlan[recentFlan.length - 1].pos : -1;
  let pos;
  do {
    pos = Math.floor(Math.random() * cells);
  } while (pos === lastPos);
  recentFlan.length = 0;
  recentFlan.push({ pos, row: Math.floor(pos / cols), col: pos % cols });
  return pos;
}

// Ajuste les dimensions de la grille selon la largeur d'écran
// Mobile : max 6 colonnes pour que les emojis soient bien visibles
function getDimsForRound(r) {
  if (window.innerWidth < 720) {
    const totalCells = r.cols * r.rows;
    const cols = Math.min(r.cols, 6);
    const rows = Math.ceil(totalCells / cols);
    return { cols, rows };
  }
  return { cols: r.cols, rows: r.rows };
}

function buildGrid(r) {
  const dims = getDimsForRound(r);
  const cols = dims.cols;
  const rows = dims.rows;
  const cells = cols * rows;
  const flanIdx = pickFlanIdx(cols, rows);
  const trapIndices = new Set();
  if (r.traps && r.traps.length > 0 && r.trapsN > 0) {
    while (trapIndices.size < r.trapsN && trapIndices.size < cells - 1) {
      const idx = Math.floor(Math.random() * cells);
      if (idx !== flanIdx) trapIndices.add(idx);
    }
  }
  gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridEl.setAttribute("data-tint", r.tint || 0);
  gridEl.innerHTML = "";

  // Calcule la taille de police idéale pour qu'aucun emoji ne déborde
  requestAnimationFrame(() => {
    const w = gridEl.clientWidth;
    const h = gridEl.clientHeight;
    if (w > 0 && h > 0) {
      const cellSize = Math.min(w / cols, h / rows);
      const fontSize = Math.max(14, Math.floor(cellSize * 0.78));
      gridEl.style.setProperty("--cell-font", fontSize + "px");
    }
  });

  for (let i = 0; i < cells; i++) {
    const b = document.createElement("button");
    b.className = "ch-cell";
    let emoji;
    let isFlan = false;
    let isTricky = false;
    if (i === flanIdx) {
      emoji = FLAN;
      isFlan = true;
      b.dataset.flan = "true";
    } else if (trapIndices.has(i)) {
      emoji = rand(r.traps);
      isTricky = true;
      b.dataset.tricky = "true";
    } else {
      emoji = rand(r.distractors);
    }
    b.textContent = emoji;
    b.style.animationDelay = (Math.random() * 2).toFixed(2) + "s";
    b.onclick = () => onCellClick(b, isFlan, isTricky);
    gridEl.appendChild(b);
  }
}

function startMutations(r) {
  stopMutations();
  if (r.mutation) {
    state.mutationId = setInterval(() => {
      if (!state.playing) return;
      const cells = gridEl.querySelectorAll('.ch-cell:not([data-flan])');
      if (!cells.length) return;
      const cell = cells[Math.floor(Math.random() * cells.length)];
      const isTricky = cell.dataset.tricky === "true";
      const pool = (isTricky && r.traps.length > 0) ? r.traps : r.distractors;
      cell.classList.add('mutating');
      setTimeout(() => {
        cell.textContent = rand(pool);
        cell.classList.remove('mutating');
      }, 160);
    }, r.mutation);
  }
  if (r.swap) {
    state.swapId = setInterval(() => {
      if (!state.playing) return;
      const cells = Array.from(gridEl.querySelectorAll('.ch-cell:not([data-flan])'));
      if (cells.length < 2) return;
      const a = cells[Math.floor(Math.random() * cells.length)];
      let b = cells[Math.floor(Math.random() * cells.length)];
      let tries = 0;
      while (b === a && tries < 5) {
        b = cells[Math.floor(Math.random() * cells.length)];
        tries++;
      }
      if (a === b) return;
      a.classList.add('swapping');
      b.classList.add('swapping');
      setTimeout(() => {
        const tmp = a.textContent;
        a.textContent = b.textContent;
        b.textContent = tmp;
        const tdata = a.dataset.tricky || "";
        a.dataset.tricky = b.dataset.tricky || "";
        b.dataset.tricky = tdata;
        setTimeout(() => {
          a.classList.remove('swapping');
          b.classList.remove('swapping');
        }, 200);
      }, 200);
    }, r.swap);
  }
}

function stopMutations() {
  if (state.mutationId) { clearInterval(state.mutationId); state.mutationId = null; }
  if (state.swapId) { clearInterval(state.swapId); state.swapId = null; }
}

// ============================================================
// Faune : plumes qui tombent + poule qui traverse
// ============================================================

function startWildlife(r) {
  stopWildlifeTimers();
  if (r.feathersInterval) {
    state.feathersId = setInterval(() => {
      if (!state.playing) return;
      const burst = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < burst; i++) setTimeout(spawnFeather, i * 50);
      if (Math.random() < 0.3 && r.feathersInterval < 900) spawnFeatherExplosion();
    }, r.feathersInterval);
  }
  if (r.chickenInterval) {
    // Première poule très rapide (350ms après le début du round)
    setTimeout(() => { if (state.playing) spawnChicken(); }, 350);
    // Deuxième poule un peu après pour bien lancer le rythme
    setTimeout(() => { if (state.playing) spawnChicken(); }, 350 + Math.min(r.chickenInterval, 900));
    state.chickenId = setInterval(() => {
      if (!state.playing) return;
      // Coq géant ?
      if (r.roosterChance && Math.random() < r.roosterChance) {
        spawnGiantRooster();
        return;
      }
      const roll = Math.random();
      if (state.round >= 5) {
        if (roll < 0.30) spawnChickenStop();
        else if (roll < 0.50) spawnFallingChicken();
        else if (roll < 0.75) spawnMultiChickens(3);
        else spawnMultiChickens(2);
      } else if (state.round >= 4) {
        if (roll < 0.35) spawnChickenStop();
        else if (roll < 0.55) spawnFallingChicken();
        else if (roll < 0.80) spawnMultiChickens(2);
        else spawnChicken();
      } else if (state.round >= 3) {
        if (roll < 0.40) spawnChickenStop();
        else spawnChicken();
      } else {
        spawnChicken();
      }
    }, r.chickenInterval);
  }
  if (r.eggInterval) {
    state.eggId = setInterval(() => {
      if (!state.playing) return;
      spawnEggSplat();
    }, r.eggInterval);
  }
  if (r.bubblesInterval) {
    state.bubblesId = setInterval(() => {
      if (!state.playing) return;
      spawnBubble();
      // Parfois 2 bulles d'affilée
      if (Math.random() < 0.3) setTimeout(spawnBubble, 150);
    }, r.bubblesInterval);
  }
}

// Musique basse-cour : tempo qui accélère + plus fort + drone grave inquiétant
// Continue de tourner pendant les transitions pour garder la tension.
function startBarnyardMusic() {
  if (state.beatTimeout) return; // déjà active : on garde la continuité
  if (!state.ambientMuted) AudioFX.startMusic();
  state.beatCount = 0;
  const tick = () => {
    if (!state.playing && !state.inTransition) return;
    state.beatCount += 1;
    const n = state.beatCount;
    const intensity = computeIntensity();

    // Si ambient muté, on continue à ticker mais on ne joue rien
    if (state.ambientMuted) {
      const interval = 480 - intensity * 350;
      state.beatTimeout = setTimeout(tick, interval);
      return;
    }

    // Kick rythmique plus marqué (volume doublé)
    if (n % 2 === 0) AudioFX.thud(0.05 + intensity * 0.05);
    // Cot doux plus marqué
    if (n % 3 === 1) AudioFX.cot(0.07 + intensity * 0.06, 0.7 + Math.random() * 0.5);
    // Cot aigu
    if (n % 7 === 4) AudioFX.cot(0.06 + intensity * 0.05, 1.1 + Math.random() * 0.3);
    // Flap léger
    if (n % 11 === 0 && intensity > 0.25) AudioFX.flap(0.04);
    // Drone grave inquiétant à partir du génie 3
    if (n % 16 === 0 && intensity > 0.2) {
      AudioFX.drone(0.025 + intensity * 0.05, 1.8, 50 - intensity * 12);
    }
    // Drone aigu dissonant à partir du génie 5
    if (n % 24 === 8 && intensity > 0.55) {
      AudioFX.drone(0.02 + intensity * 0.03, 1.2, 78 - intensity * 5);
    }

    // Tempo : 480ms → 130ms selon intensité
    const interval = 480 - intensity * 350;
    state.beatTimeout = setTimeout(tick, interval);
  };
  state.beatTimeout = setTimeout(tick, 200);
}

function stopBarnyardMusic() {
  if (state.beatTimeout) { clearTimeout(state.beatTimeout); state.beatTimeout = null; }
  AudioFX.stopMusic();
}

// Battement de cœur qui s'accélère et s'amplifie avec l'intensité
// Continue de tourner pendant les transitions pour garder la tension.
function startHeartbeat() {
  if (state.heartTimeout) return; // déjà actif : continuité
  const tick = () => {
    if (!state.playing && !state.inTransition) return;
    const intensity = computeIntensity();
    // Si ambient muté, on continue à ticker mais on ne joue pas
    if (!state.ambientMuted && intensity > 0.12) {
      AudioFX.heartbeat(0.04 + intensity * 0.18);
    }
    // Tempo : 750ms → 220ms (battement très rapide à la fin)
    const interval = Math.max(220, 750 - intensity * 530);
    state.heartTimeout = setTimeout(tick, interval);
  };
  state.heartTimeout = setTimeout(tick, 600);
}

function stopHeartbeat() {
  if (state.heartTimeout) { clearTimeout(state.heartTimeout); state.heartTimeout = null; }
}

// Cases qui grandissent/rapetissent aléatoirement (via Web Animations API)
// Plus l'intensité monte, plus de cases sont affectées, plus vite et plus fort.
function startCellPulse() {
  stopCellPulse();
  const tick = () => {
    if (!state.playing) return;
    const intensity = computeIntensity();
    if (intensity > 0.02 || state.round >= 1) {
      // TOUTES les cases peuvent pulser, y compris le flan (mieux le cacher dans le mouvement)
      const cells = gridEl.querySelectorAll('.ch-cell');
      if (cells.length > 0) {
        const i = Math.max(0.1, intensity);
        const count = Math.max(1, Math.round(1 + i * 5));
        for (let k = 0; k < count; k++) {
          const cell = cells[Math.floor(Math.random() * cells.length)];
          pulseCell(cell, i);
        }
      }
    }
    // Fréquence : 850ms (très lent au début) → 200ms (rapide mais lisible à la fin)
    const interval = Math.max(200, 850 - intensity * 650);
    state.pulseTimeout = setTimeout(tick, interval);
  };
  state.pulseTimeout = setTimeout(tick, 600);
}

function stopCellPulse() {
  if (state.pulseTimeout) { clearTimeout(state.pulseTimeout); state.pulseTimeout = null; }
}

// Tremblement individuel des cases (chacune sa phase de sinusoïde)
function startCellsTremor() {
  stopCellsTremor();
  let t = 0;
  const tick = () => {
    if (!state.playing && !state.inTransition) return;
    const intensity = computeIntensity();
    const cells = gridEl.querySelectorAll('.ch-cell:not([data-flan])');
    if (intensity > 0.15 && cells.length) {
      // Démarre plus tard, amplitude plus douce : 0.3 → 2.5 px
      const amp = 0.3 + intensity * 2.2;
      cells.forEach((cell, i) => {
        const phase = i * 0.73;
        const dx = Math.sin(t * 5.5 + phase) * amp;
        const dy = Math.cos(t * 4.8 + phase * 1.4) * amp * 0.7;
        cell.style.translate = dx.toFixed(2) + "px " + dy.toFixed(2) + "px";
      });
    } else if (cells.length) {
      cells.forEach(c => { c.style.translate = "0 0"; });
    }
    t += 0.05;
    // Rafraîchissement plus lent : 100ms → 55ms
    const interval = Math.max(55, 100 - intensity * 45);
    state.tremorTimeout = setTimeout(tick, interval);
  };
  state.tremorTimeout = setTimeout(tick, 200);
}

function stopCellsTremor() {
  if (state.tremorTimeout) { clearTimeout(state.tremorTimeout); state.tremorTimeout = null; }
  document.querySelectorAll('.ch-cell').forEach(c => { c.style.translate = ""; });
}

function pulseCell(cell, intensity) {
  // Amplitude bien marquée : 0.20 (tout petit) ou 2.4 (énorme)
  const lo = 0.20 + (1 - intensity) * 0.25;
  const hi = 1.6 + intensity * 0.8;
  const scale = Math.random() < 0.5
    ? lo + Math.random() * 0.18
    : hi - Math.random() * 0.20;
  // Durée : 950ms (lent et visible au début) → 480ms à intensité max
  const dur = Math.round(950 - intensity * 470);
  const prevZ = cell.style.zIndex;
  cell.style.zIndex = "8";
  const anim = cell.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(" + scale.toFixed(2) + ")", offset: 0.42 },
      { transform: "scale(1)" },
    ],
    { duration: dur, easing: "cubic-bezier(0.34, 1.6, 0.4, 1)", fill: "none" }
  );
  anim.onfinish = () => { cell.style.zIndex = prevZ || ""; };
}

function stopWildlifeTimers() {
  if (state.feathersId) { clearInterval(state.feathersId); state.feathersId = null; }
  if (state.chickenId) { clearInterval(state.chickenId); state.chickenId = null; }
  if (state.eggId) { clearInterval(state.eggId); state.eggId = null; }
  if (state.bubblesId) { clearInterval(state.bubblesId); state.bubblesId = null; }
}

function stopWildlife() {
  stopWildlifeTimers();
  document.querySelectorAll(".wildlife, .reaction-banner").forEach(el => el.remove());
}

function spawnBubble() {
  const b = document.createElement("div");
  b.className = "wildlife bubble-text";
  b.textContent = BUBBLES[Math.floor(Math.random() * BUBBLES.length)];
  b.style.left = (8 + Math.random() * 78) + "vw";
  b.style.top = (12 + Math.random() * 65) + "vh";
  b.style.fontSize = (15 + Math.random() * 14) + "px";
  b.style.setProperty("--tilt", (Math.random() * 30 - 15) + "deg");
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 700);
}

function spawnGiantRooster() {
  const r = document.createElement("div");
  r.className = "wildlife giant-rooster";
  r.innerHTML = `<div class="gr-cock">🐓</div><div class="gr-text">${W.effects.giantRoosterText}</div>`;
  document.body.appendChild(r);
  AudioFX.flap(0.12);
  setTimeout(() => AudioFX.cocorico(0.20), 80);
  shakeScreen();
  setTimeout(() => r.remove(), 850);
}

function shakeScreen() {
  document.body.classList.remove("screen-shake");
  void document.body.offsetWidth;
  document.body.classList.add("screen-shake");
  setTimeout(() => document.body.classList.remove("screen-shake"), 450);
}

function showReaction(text, color) {
  const r = document.createElement("div");
  r.className = "reaction-banner reaction-" + color;
  r.textContent = text;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 650);
}

// Mix d'emojis qui tombent : têtes de poule majoritaires, œufs, poussins, coqs
const FALLING_EMOJIS = ["🐔", "🐔", "🐔", "🐔", "🐔", "🐔", "🐓", "🐓", "🥚", "🥚", "🐣"];

function spawnFeather(opts) {
  opts = opts || {};
  const f = document.createElement("div");
  const emoji = opts.emoji || FALLING_EMOJIS[Math.floor(Math.random() * FALLING_EMOJIS.length)];
  f.textContent = emoji;
  // Variantes d'animation pour rendre ça drôle
  const v = Math.random();
  if (v < 0.20) f.className = "wildlife head zigzag";
  else if (v < 0.35) f.className = "wildlife head loop";
  else if (v < 0.50) f.className = "wildlife head spin-fast";
  else f.className = "wildlife head straight";
  f.style.left = (opts.x != null ? opts.x : Math.random() * 95) + "vw";
  if (opts.startY != null) f.style.top = opts.startY + "vh";
  f.style.fontSize = (opts.size || (50 + Math.random() * 50)) + "px";
  f.style.setProperty("--rot-start", (Math.random() * 80 - 40) + "deg");
  f.style.setProperty("--rot-end", (Math.random() * 1440 + 360) + "deg");
  f.style.setProperty("--drift", ((Math.random() - 0.5) * 280) + "px");
  f.style.animationDuration = (1.3 + Math.random() * 1) + "s";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 3000);
}

function spawnFeatherExplosion() {
  // Explosion radiale de plumes depuis un point au centre
  const cx = 20 + Math.random() * 60;
  const cy = 20 + Math.random() * 50;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const x = cx + Math.cos(angle) * 8;
    setTimeout(() => spawnFeather({ x, startY: cy, size: 70 + Math.random() * 40 }), i * 30);
  }
  AudioFX.thud(0.06);
}

function getChickenSize() {
  const r = ROUNDS[state.round];
  return (r && r.chickenSize) ? r.chickenSize : 110;
}

// SVG d'une poule en pied avec pattes animées (basse-cour)
function chickenSVG() {
  const body = "#fffdf5";
  const stroke = "#1f1812";
  const legs = "#f5c945";
  return `<svg viewBox="0 0 110 90" preserveAspectRatio="xMidYMax meet" class="chicken-svg">
    <!-- Queue -->
    <path d="M18 42 Q4 28 22 50 Q18 55 16 50 Z" fill="${body}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Corps -->
    <ellipse cx="52" cy="50" rx="33" ry="22" fill="${body}" stroke="${stroke}" stroke-width="2.5"/>
    <!-- Aile -->
    <path d="M36 44 Q46 36 60 44 Q52 56 38 54 Z" fill="${body}" stroke="${stroke}" stroke-width="2"/>
    <!-- Tête -->
    <circle cx="82" cy="30" r="16" fill="${body}" stroke="${stroke}" stroke-width="2.5"/>
    <!-- Crête -->
    <path d="M72 17 Q76 9 80 15 Q84 7 89 14 Q93 9 96 18 L94 19 Q88 22 80 22 Q73 21 72 18 Z" fill="#e8624a" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Œil -->
    <circle cx="86" cy="28" r="2.6" fill="${stroke}"/>
    <circle cx="86.6" cy="27.4" r="0.9" fill="white"/>
    <!-- Bec -->
    <polygon points="97,32 105,35 97,38" fill="#f5c945" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Caroncule -->
    <ellipse cx="80" cy="40" rx="3" ry="2.5" fill="#e8624a" stroke="${stroke}" stroke-width="1"/>
    <!-- Pattes animées -->
    <g class="chick-legs">
      <rect class="leg leg-a" x="42" y="68" width="5" height="16" fill="${legs}" stroke="${stroke}" stroke-width="1.5" rx="1.5"/>
      <rect class="foot foot-a" x="38" y="82" width="13" height="3" fill="${legs}" stroke="${stroke}" stroke-width="1.2" rx="1"/>
      <rect class="leg leg-b" x="60" y="68" width="5" height="16" fill="${legs}" stroke="${stroke}" stroke-width="1.5" rx="1.5"/>
      <rect class="foot foot-b" x="56" y="82" width="13" height="3" fill="${legs}" stroke="${stroke}" stroke-width="1.2" rx="1"/>
    </g>
  </svg>`;
}

function spawnChicken() {
  const c = document.createElement("div");
  c.className = "wildlife chicken";
  const size = getChickenSize();
  c.style.width = size + "px";
  c.style.height = Math.round(size * 0.85) + "px";
  c.innerHTML = chickenSVG();

  if (Math.random() < 0.5) c.classList.add("left-to-right");
  else c.classList.add("right-to-left");

  // Style de course : run / hop / leap (plus on avance, plus de sauts)
  const roundProg = Math.min(1, state.round / Math.max(1, TOTAL_ROUNDS - 1));
  const jumpRoll = Math.random();
  let jumpStyle = "run";
  if (roundProg > 0.2 && jumpRoll < 0.25) jumpStyle = "hop";
  else if (roundProg > 0.4 && jumpRoll < 0.45) jumpStyle = "leap";
  c.classList.add(jumpStyle);

  if (jumpStyle !== "run") {
    const gridRect = gridEl.getBoundingClientRect();
    const chickenBottom = 25 + Math.round(size * 0.85);
    const maxJumpPx = Math.max(80, window.innerHeight - chickenBottom - gridRect.top - 10);
    c.style.setProperty("--max-jump", maxJumpPx + "px");
    c.style.setProperty("--mid-jump", Math.round(maxJumpPx * 0.5) + "px");
  }

  document.body.appendChild(c);
  AudioFX.chickenAppear(0.15);
  if (jumpStyle === "leap") {
    setTimeout(() => AudioFX.flap(0.08), 400);
    setTimeout(() => AudioFX.flap(0.06), 1100);
  }
  setTimeout(() => c.remove(), 3200);
}

function spawnChickenStop() {
  // GROSSE poule qui entre, s'arrête au milieu, pond un œuf, repart
  const c = document.createElement("div");
  c.className = "wildlife chicken-stop";
  c.textContent = "🐔";
  const y = 25 + Math.random() * 25;
  c.style.setProperty("--y", y + "vh");
  // taille = 1.4x la taille standard du round (encore plus grosse)
  c.style.fontSize = Math.round(getChickenSize() * 1.4) + "px";
  document.body.appendChild(c);
  AudioFX.chickenAppear(0.18);
  // À l'arrêt : ponte dramatique (jacassement + squawk)
  setTimeout(() => {
    AudioFX.clucksExcited(0.15);
    setTimeout(() => AudioFX.squawk(0.14), 150);
    // Œuf pondu sous elle
    const e = document.createElement("div");
    e.className = "wildlife laid-egg";
    e.textContent = "🥚";
    e.style.top = (y + 12) + "vh";
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 700);
  }, 500);
  setTimeout(() => c.remove(), 2100);
}

// Plusieurs poules qui traversent en groupe (avec décalages)
function spawnMultiChickens(n) {
  for (let i = 0; i < n; i++) {
    setTimeout(spawnChicken, i * 180);
  }
}

// Poule qui tombe verticalement et s'écrase au sol
function spawnFallingChicken() {
  const c = document.createElement("div");
  c.className = "wildlife falling-chicken";
  c.textContent = "🐔";
  c.style.left = (10 + Math.random() * 80) + "vw";
  c.style.fontSize = Math.round(getChickenSize() * 0.9) + "px";
  document.body.appendChild(c);
  AudioFX.flap(0.1);
  setTimeout(() => AudioFX.squawk(0.16), 80); // cri de panique pendant la chute
  setTimeout(() => {
    AudioFX.thud(0.18);
    shakeScreen();
  }, 950);
  setTimeout(() => AudioFX.clucksExcited(0.12), 1150); // jacassement après l'impact
  setTimeout(() => c.remove(), 2400);
}

function spawnEggSplat() {
  // Un œuf tombe du ciel et explose en splash au milieu de l'écran
  const e = document.createElement("div");
  e.className = "wildlife egg-falling";
  e.textContent = "🥚";
  const x = 20 + Math.random() * 60;
  e.style.left = x + "vw";
  document.body.appendChild(e);
  setTimeout(() => {
    e.textContent = "💥";
    e.classList.remove("egg-falling");
    e.classList.add("egg-splashed");
    AudioFX.thud(0.18);
    shakeScreen();
    // Cot-cot d'indignation derrière
    setTimeout(() => AudioFX.cluck(0.1), 200);
  }, 850);
  setTimeout(() => e.remove(), 2100);
}

function onCellClick(btn, isFlan, isTricky) {
  if (!state.playing) return;
  if (isFlan) {
    // Cot-cot triomphant à la place du ding
    AudioFX.clucksExcited(0.22);
    setTimeout(() => AudioFX.flap(0.08), 380);
    btn.classList.add("found");
    showReaction(W.reactions.bravo, "green");
    state.playing = false;
    state.inTransition = true; // garde la musique et le cœur actifs
    clearInterval(state.timerId);
    stopMutations();
    stopWildlifeTimers(); // stoppe les intervalles mais laisse les overlays finir leur animation
    stopCellPulse();
    // musique + cœur restent actifs pendant la transition
    setTimeout(() => nextRound(), 700);
  } else {
    AudioFX.thud();
    btn.classList.add("wrong");
    showReaction(W.reactions.miss, "red");
    shakeScreen();
    // En manche 3, cliquer sur un imitateur = défaite directe
    if (isTricky) {
      state.playing = false;
      clearInterval(state.timerId);
      stopMutations();
      stopWildlife();
      setTimeout(() => loseGame("tricky", btn.textContent), 500);
    } else {
      // Sinon, juste une pénalité de 1 seconde
      state.timeLeft = Math.max(0, state.timeLeft - 1);
      state.perfect = false;
      updateTimer();
    }
    setTimeout(() => btn.classList.remove("wrong"), 350);
  }
}

function startRound(n) {
  state.round = n;
  state.viteShown = false;
  state.inTransition = false;
  const r = ROUNDS[n];
  roundEl.textContent = n + 1;
  state.timeLeft = r.time;
  buildGrid(r);
  startMutations(r);
  startWildlife(r);
  startCellPulse();
  startCellsTremor();
  startBarnyardMusic();
  startHeartbeat();
  state.playing = true;
  state.startedAt = Date.now();
  updateIntensity();
  updateTimer();
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.timeLeft -= 0.1;
    updateTimer();
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      clearInterval(state.timerId);
      state.playing = false;
      stopMutations();
      stopWildlife();
      stopCellPulse();
      stopBarnyardMusic();
      stopHeartbeat();
      loseGame("timeout", null);
    }
  }, 100);
}

function updateTimer() {
  timeEl.textContent = Math.max(0, state.timeLeft).toFixed(1);
  if (state.timeLeft <= 3) timerBlock.classList.add("urgent");
  else timerBlock.classList.remove("urgent");
  // "VITE !" qui flashe une fois sous 2 secondes
  if (state.timeLeft <= 2 && state.timeLeft > 0 && !state.viteShown && state.playing) {
    state.viteShown = true;
    showReaction(W.reactions.hurry, "orange");
  }
  // Met à jour l'intensité visuelle (fond + tremblements)
  updateIntensity();
}

function computeIntensity() {
  const r = ROUNDS[state.round];
  if (!r) return 0;
  const roundProg = Math.min(1, state.round / Math.max(1, TOTAL_ROUNDS - 1));
  const timeProg = 1 - Math.max(0, state.timeLeft) / r.time;
  let intensity = Math.min(1, roundProg * 0.6 + roundProg * timeProg * 0.4 + (state.round >= 1 ? 0.05 : 0));
  // Mode Débuflan : intensité visuelle fortement atténuée (-60%) pour moins de stress
  if (state.mode === "beginner") intensity *= 0.35;
  // Mode Hardcôt / Infini-flan : un peu plus intense
  else if (state.mode === "hardcore" || state.mode === "infinity") intensity = Math.min(1, intensity * 1.1);
  return intensity;
}

function updateIntensity() {
  const i = computeIntensity();
  document.body.style.setProperty("--intensity", i.toFixed(3));
}

// Génère un niveau infini jittéré à partir du niveau 12 (base hardcore déjà appliquée)
function generateInfinityRound(roundIdx) {
  const base = ROUNDS[ROUNDS_BASE.length - 1];
  const jitter  = (v, spread) => Math.round(v * (1 + (Math.random() * 2 - 1) * spread));
  const jitterF = (v, spread) => Math.max(2.5, parseFloat((v * (1 + (Math.random() * 2 - 1) * spread)).toFixed(1)));
  // Légère escalade plafonnée à +18 % après 25 runs
  const extra = Math.min(0.18, (roundIdx - ROUNDS_BASE.length) * 0.007);
  return {
    ...base,
    time:             jitterF(base.time * (1 - extra * 0.5), 0.08),
    trapsN:           Math.max(base.trapsN, jitter(Math.round(base.trapsN * (1 + extra * 0.3)), 0.15)),
    mutation:         base.mutation         ? Math.max(150,  jitter(Math.round(base.mutation  * (1 - extra * 0.3)), 0.15)) : 0,
    swap:             base.swap             ? Math.max(200,  jitter(Math.round(base.swap      * (1 - extra * 0.3)), 0.15)) : 0,
    feathersInterval: base.feathersInterval ? Math.max(120,  jitter(base.feathersInterval, 0.12)) : 0,
    chickenInterval:  base.chickenInterval  ? Math.max(180,  jitter(base.chickenInterval,  0.12)) : 0,
    eggInterval:      base.eggInterval      ? Math.max(1200, jitter(base.eggInterval,      0.15)) : 0,
    bubblesInterval:  base.bubblesInterval  ? Math.max(250,  jitter(base.bubblesInterval,  0.12)) : 0,
    roosterChance:    Math.min(0.40, (base.roosterChance || 0) * (1 + extra)),
  };
}

function nextRound() {
  const nextIdx = state.round + 1;
  if (state.mode === "infinity" && nextIdx >= ROUNDS_BASE.length) {
    ROUNDS.push(generateInfinityRound(nextIdx));
  } else if (state.mode !== "infinity" && nextIdx >= ROUNDS.length) {
    return winGame();
  }
  showRoundTransition(nextIdx, () => startRound(nextIdx));
}

// Écran d'instruction initiale, plein écran (réutilise le même look que les transitions de manche)
function showFirstRoundInstruction() {
  const transEl = document.getElementById("ch-transition");
  if (!transEl) return;
  const meta = state.mode === "infinity"
    ? W.transition.roundLabel + " 1"
    : W.transition.roundLabel + " 1 / " + TOTAL_ROUNDS;
  transEl.innerHTML = `
    <div class="trans-genies">${W.symbols.flan}</div>
    <div class="trans-title">${W.transition.findFlanTitle}</div>
    <div class="trans-subtitle">${W.transition.findFlanSubtitle}</div>
    <div class="trans-meta">${meta}</div>
  `;
  transEl.className = `ch-transition mode-${state.mode}`;
  transEl.classList.add("show");
  AudioFX.pop(0.13, 660);
  setTimeout(() => AudioFX.pop(0.10, 880), 90);
  setTimeout(() => transEl.classList.remove("show"), 1400);
}

function showRoundTransition(nextIdx, cb) {
  const transEl = document.getElementById("ch-transition");
  if (!transEl) return cb();

  const isInfinityRound = state.mode === "infinity" && nextIdx >= TOTAL_ROUNDS;
  const intro = isInfinityRound
    ? GENIE_INTROS_INFINITY[(nextIdx - TOTAL_ROUNDS) % GENIE_INTROS_INFINITY.length]
    : GENIE_INTROS[nextIdx];
  const meta = isInfinityRound
    ? W.transition.roundLabel + " " + (nextIdx + 1)
    : W.transition.roundLabel + " " + (nextIdx + 1) + " / " + TOTAL_ROUNDS;

  // Phase 1 : fondu sortie de la grille
  document.body.classList.add("ch-fading");

  setTimeout(() => {
    // Phase 2 : affichage de la transition
    transEl.innerHTML = `
      <div class="trans-genies">${intro.emoji}</div>
      <div class="trans-title">${intro.title}</div>
      <div class="trans-subtitle">${intro.subtitle || ""}</div>
      <div class="trans-meta">${meta}</div>
    `;
    transEl.className = `ch-transition mode-${state.mode}`;
    transEl.classList.add("show");
    AudioFX.pop(0.13, 740);
    setTimeout(() => AudioFX.pop(0.10, 920), 90);
  }, 180);

  setTimeout(() => {
    // Phase 3 : sortie transition + fondu entrée
    transEl.classList.remove("show");
    document.body.classList.remove("ch-fading");
    setTimeout(cb, 200);
  }, 900);
}

function generateCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  let s = W.code.prefix;
  for (let i = 0; i < 4; i++) s += letters[Math.floor(Math.random() * letters.length)];
  s += "-";
  for (let i = 0; i < 2; i++) s += digits[Math.floor(Math.random() * digits.length)];
  return s;
}

function winGame() {
  state.playing = false;
  state.inTransition = false;
  stopMutations();
  stopWildlife();
  stopCellPulse();
  stopCellsTremor();
  stopBarnyardMusic();
  stopHeartbeat();
  // Enregistre le temps de jeu + médailles
  const totalTime = (Date.now() - (state.gameStartedAt || Date.now())) / 1000;
  const result = saveBestTime(state.mode, totalTime);
  state.lastGameTime = totalTime;
  state.isNewRecord = result.isNewRecord;
  // Confettis + feux d'artifice + musique complète
  rainConfetti();
  AudioFX.winMusic();
  setTimeout(() => fireworksShow(), 250);
  // L'écran de victoire arrive après le spectacle complet (~5s)
  setTimeout(() => {
    updateModeBadges(); // refresh médailles avant d'afficher l'écran
    injectVictoryStats();
    showScreen("win");
  }, 5000);
}

function injectVictoryStats() {
  const winScreen = document.getElementById("ch-win");
  if (!winScreen) return;
  let stats = winScreen.querySelector(".victory-stats");
  if (stats) stats.remove();
  stats = document.createElement("div");
  stats.className = "victory-stats";
  const medal = getMedalForMode(state.mode, loadProgress());
  const time = state.lastGameTime ? formatTime(state.lastGameTime) : "?";
  stats.innerHTML = `
    ${state.isNewRecord ? '<div class="vs-record">' + W.win.newRecord + '</div>' : ''}
    <div class="vs-row"><span>${W.win.yourTime}</span><strong>${time}</strong></div>
    ${medal ? '<div class="vs-medal">' + medal + '</div>' : ''}
  `;
  const lead = winScreen.querySelector(".ch-big");
  if (lead) lead.insertAdjacentElement("afterend", stats);
}

function loseGame(reason, clickedEmoji) {
  state.playing = false;
  state.inTransition = false;
  stopMutations();
  stopWildlife();
  stopCellPulse();
  stopCellsTremor();
  stopBarnyardMusic();
  stopHeartbeat();
  // Flan qui explose et dégouline + musique de défaite complète
  flanExplosion();
  AudioFX.loseMusic();

  if (state.mode === "infinity") {
    const level = state.round + 1;
    const result = saveBestLevel(state.mode, level);
    state.lastInfinityLevel = level;
    state.isNewRecord = result.isNewRecord;
    const wi = W.infinity;
    if (reason === "tricky") {
      loseEmoji.textContent = clickedEmoji || "🍯";
      loseTitle.textContent = wi.trickyTitle;
      loseMsg.textContent   = wi.trickyMessage;
    } else if (reason === "timeout") {
      loseEmoji.textContent = "⏰";
      loseTitle.textContent = wi.timeoutTitle;
      loseMsg.textContent   = wi.timeoutMessage;
    } else {
      loseEmoji.textContent = "😶";
      loseTitle.textContent = wi.defaultTitle;
      loseMsg.textContent   = wi.defaultMessage;
    }
    setTimeout(() => {
      updateModeBadges();
      injectInfinityLoseStats(loseEl, state.isNewRecord, state.lastInfinityLevel);
      showScreen("lose");
    }, 4500);
  } else {
    if (reason === "tricky") {
      loseEmoji.textContent = clickedEmoji || "🍯";
      loseTitle.textContent = W.lose.trickyTitle;
      loseMsg.textContent   = W.lose.trickyMessage;
    } else if (reason === "timeout") {
      loseEmoji.textContent = "⏰";
      loseTitle.textContent = W.lose.timeoutTitle;
      loseMsg.textContent   = W.lose.timeoutMessage;
    } else {
      loseEmoji.textContent = "😶";
      loseTitle.textContent = W.lose.defaultTitle;
      loseMsg.textContent   = W.lose.defaultMessage;
    }
    // L'écran de défaite arrive après la musique complète (~4.5s)
    setTimeout(() => {
      showScreen("lose");
    }, 4500);
  }
}

function injectInfinityLoseStats(screenEl, isNewRecord, level) {
  let stats = screenEl.querySelector(".victory-stats");
  if (stats) stats.remove();
  stats = document.createElement("div");
  stats.className = "victory-stats";
  stats.innerHTML = `
    ${isNewRecord ? '<div class="vs-record">' + W.infinity.newLevelRecord + '</div>' : ''}
    <div class="vs-row"><span>${W.infinity.levelReached}</span><strong>${level}</strong></div>
  `;
  const msg = screenEl.querySelector(".ch-big");
  if (msg) msg.insertAdjacentElement("afterend", stats);
}

// ============================================================
// Animations fun win / lose
// ============================================================

function rainConfetti() {
  const emojis = ["🍮", "🍮", "🍮", "🍮", "✨", "🎉", "🌟", "🥳", "🍮"];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDelay = (Math.random() * 2).toFixed(2) + "s";
    c.style.animationDuration = (3 + Math.random() * 2.5).toFixed(2) + "s";
    c.style.fontSize = (22 + Math.random() * 22) + "px";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6500);
  }
}

// Œufs qui montent en chandelle avec traînée de feu puis explosent
function launchFireworkEgg() {
  const x = 12 + Math.random() * 76;
  const peakY = 12 + Math.random() * 28; // hauteur (% du haut)
  const riseDuration = 700 + Math.random() * 250;

  // L'œuf qui monte
  const egg = document.createElement("div");
  egg.className = "wildlife fw-egg";
  egg.textContent = "🥚";
  egg.style.left = x + "vw";
  egg.style.bottom = "0";
  egg.style.fontSize = (44 + Math.random() * 16) + "px";
  document.body.appendChild(egg);

  egg.animate(
    [
      { bottom: "0vh", transform: "rotate(0deg) scale(1)" },
      { bottom: (100 - peakY) + "vh", transform: "rotate(720deg) scale(0.85)" }
    ],
    { duration: riseDuration, easing: "cubic-bezier(0.3, 0, 0.4, 0.85)", fill: "forwards" }
  );

  // Traînée de feu : petits éléments qui restent derrière l'œuf
  const trailInterval = setInterval(() => {
    const r = egg.getBoundingClientRect();
    const flame = document.createElement("div");
    flame.className = "wildlife fw-trail";
    flame.textContent = Math.random() < 0.5 ? "🔥" : "✨";
    flame.style.left = (r.left + r.width / 2) + "px";
    flame.style.top = (r.top + r.height * 0.7) + "px";
    flame.style.fontSize = (16 + Math.random() * 14) + "px";
    document.body.appendChild(flame);
    flame.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.3) translateY(15px)" }
      ],
      { duration: 600, fill: "forwards" }
    );
    setTimeout(() => flame.remove(), 650);
  }, 50);

  AudioFX.pop(0.1, 380); // whoosh départ
  setTimeout(() => AudioFX.pop(0.08, 480), 200);
  setTimeout(() => AudioFX.pop(0.06, 580), 400);

  // Explosion à l'apogée
  setTimeout(() => {
    clearInterval(trailInterval);
    egg.remove();
    explodeFirework(x, peakY);
  }, riseDuration);
}

function explodeFirework(x, y) {
  const colors = ["#f5c945", "#e8624a", "#5b8e58", "#4ec3c7", "#d68a6a", "#fff"];
  const emojis = ["✨", "🌟", "💥", "⭐"];
  const count = 18 + Math.floor(Math.random() * 8);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "wildlife fw-particle";
    // Mix : 70% dot coloré, 30% emoji
    if (Math.random() < 0.3) {
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.fontSize = (18 + Math.random() * 18) + "px";
    } else {
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = (8 + Math.random() * 8) + "px";
      p.style.height = p.style.width;
      p.style.borderRadius = "50%";
      p.style.boxShadow = "0 0 12px " + colors[Math.floor(Math.random() * colors.length)];
    }
    p.style.left = x + "vw";
    p.style.top = y + "vh";
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    const distance = 140 + Math.random() * 130;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    p.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy * 0.5}px)) scale(1)`, offset: 0.4, opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 80}px)) scale(0.3)`, opacity: 0 }
      ],
      { duration: 1100 + Math.random() * 300, easing: "cubic-bezier(0.2, 0.6, 0.6, 1)", fill: "forwards" }
    );
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
  AudioFX.thud(0.15);
  setTimeout(() => AudioFX.pop(0.12, 1100), 30);
  setTimeout(() => AudioFX.pop(0.08, 1400), 80);
}

function fireworksShow() {
  // 5 lancements échelonnés
  for (let i = 0; i < 5; i++) {
    setTimeout(launchFireworkEgg, i * 380);
  }
  // Une grosse vague finale
  setTimeout(() => {
    for (let i = 0; i < 3; i++) setTimeout(launchFireworkEgg, i * 150);
  }, 2200);
}

// Un seul gros flan centré tombe, s'écrase au tiers bas de l'écran, puis tombe lentement hors champ
function flanExplosion() {
  AudioFX.splat(0.18);

  const drip = document.createElement("div");
  drip.className = "wildlife flan-drip";
  drip.textContent = "🍮";
  drip.style.position = "fixed";
  drip.style.left = "50%";
  drip.style.top = "0";
  drip.style.fontSize = "220px";
  drip.style.zIndex = "10002";
  drip.style.filter = "drop-shadow(2px 8px 0 rgba(0,0,0,0.4))";
  drip.style.transformOrigin = "center bottom";
  document.body.appendChild(drip);

  // Durée totale : 4200 ms
  // Phase 1 (0 → 13 %) : chute rapide depuis -15vh jusqu'à 45vh (milieu écran)
  // Phase 2 (13 % → 26%) : écrasement brusque puis rebond
  // Phase 3 (26 % → 100%) : glissement lent hors de l'écran par le bas
  const D = 4200;
  drip.animate([
    { offset: 0,     transform: "translateX(-50%) translateY(-20vh) scaleX(1)    scaleY(1)",    opacity: 1, easing: "cubic-bezier(0.5, 0, 0.9, 0.8)" },
    { offset: 0.130, transform: "translateX(-50%) translateY(35vh)  scaleX(1)    scaleY(1)",    opacity: 1, easing: "ease-out" },
    { offset: 0.160, transform: "translateX(-50%) translateY(38vh)  scaleX(3.0)  scaleY(0.12)", opacity: 1, easing: "ease-out" },
    { offset: 0.210, transform: "translateX(-50%) translateY(33vh)  scaleX(1.3)  scaleY(0.70)", opacity: 1, easing: "ease-in-out" },
    { offset: 0.260, transform: "translateX(-50%) translateY(35vh)  scaleX(1)    scaleY(1)",    opacity: 1, easing: "cubic-bezier(0.1, 0, 0.25, 1)" },
    { offset: 0.580, transform: "translateX(-50%) translateY(65vh)  scaleX(0.88) scaleY(1.9)",  opacity: 1 },
    { offset: 1,     transform: "translateX(-50%) translateY(130vh) scaleX(0.75) scaleY(3.0)",  opacity: 0 },
  ], { duration: D, fill: "forwards" });

  // Sons calés sur les phases
  setTimeout(() => { AudioFX.thud(0.32); shakeScreen(); AudioFX.glassSlide(0.10); }, Math.round(D * 0.130));
  setTimeout(() => AudioFX.glassSlide(0.08), Math.round(D * 0.380));
  setTimeout(() => AudioFX.glassSlide(0.06), Math.round(D * 0.650));
  setTimeout(() => drip.remove(), D + 100);
}

function splatFlan() {
  const s = document.createElement("div");
  s.className = "splat-flan";
  s.textContent = "🍮";
  document.body.appendChild(s);
  // Petite onde de choc autour
  setTimeout(() => {
    const wave = document.createElement("div");
    wave.className = "splat-wave";
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 800);
  }, 800);
  // Shake d'écran au moment de l'impact
  setTimeout(() => document.body.classList.add("screen-shake"), 800);
  setTimeout(() => document.body.classList.remove("screen-shake"), 1300);
  setTimeout(() => s.remove(), 2200);
}

function showScreen(which) {
  introEl.hidden = which !== "intro";
  winEl.hidden = which !== "win";
  loseEl.hidden = which !== "lose";
  overlayEl.hidden = false;
}

function hideOverlay() {
  overlayEl.hidden = true;
}

function launchFirstRound(mode) {
  if (mode) applyMode(mode);
  state.perfect = true;
  state.gameStartedAt = Date.now();
  // En mode infini : le compteur N/12 n'a pas de sens, on cache le total
  const sepEl = document.getElementById("ch-round-sep");
  if (sepEl) sepEl.hidden = (state.mode === "infinity");
  hideOverlay();
  showFirstRoundInstruction(); // plein écran ~1.4s
  // Démarre après que l'écran d'instruction soit terminé
  setTimeout(() => startRound(0), 1500);
}
// Délégation : tous les boutons .mode-card lancent une partie avec leur mode
document.querySelectorAll(".mode-card").forEach(btn => {
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    const mode = btn.getAttribute("data-mode") || "beginner";
    launchFirstRound(mode);
  });
});

function stopEverything() {
  state.playing = false;
  state.inTransition = false;
  if (state.timerId) clearInterval(state.timerId);
  stopMutations(); stopWildlife(); stopCellPulse(); stopCellsTremor();
  stopBarnyardMusic(); stopHeartbeat();
  document.querySelectorAll(".wildlife, .reaction-banner, .splat-flan, .splat-wave").forEach(el => el.remove());
  document.body.classList.remove("ch-fading", "screen-shake");
}

// Bouton Recommencer : relance la partie dans le mode actuel
const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
  restartBtn.onclick = () => {
    stopEverything();
    launchFirstRound(state.mode || "beginner");
  };
}

// Bouton Difficulté : retourne à l'écran de sélection de mode
const modeBtn = document.getElementById("mode-btn");
if (modeBtn) {
  modeBtn.onclick = () => {
    stopEverything();
    showScreen("intro");
  };
}

// Boutons audio : ambiance + bruitages
const ambienceBtn = document.getElementById("ambience-toggle");
const sfxBtn = document.getElementById("sfx-toggle");
if (ambienceBtn) {
  ambienceBtn.onclick = () => {
    state.ambientMuted = !state.ambientMuted;
    ambienceBtn.classList.toggle("muted", state.ambientMuted);
    ambienceBtn.querySelector(".audio-icon").textContent = state.ambientMuted ? "🔇" : "🎵";
    if (state.ambientMuted) AudioFX.stopMusic();
    else if (state.playing || state.inTransition) AudioFX.startMusic();
  };
}
if (sfxBtn) {
  sfxBtn.onclick = () => {
    state.sfxMuted = !state.sfxMuted;
    AudioFX.setSfxMuted(state.sfxMuted);
    sfxBtn.classList.toggle("muted", state.sfxMuted);
    sfxBtn.querySelector(".audio-icon").textContent = state.sfxMuted ? "🔇" : "🐔";
  };
}

// Audio prime
let audioPrimed = false;
document.body.addEventListener("click", () => {
  if (audioPrimed) return;
  audioPrimed = true;
  AudioFX.init();
});

// Init
updateModeBadges();
showScreen("intro");
