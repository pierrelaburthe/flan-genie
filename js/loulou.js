// ============================================================
// LA MACHINE DE LOULOU — arcade Reigns-like
// ============================================================

const SAVE_KEY_HIGH = "flan-genie:loulou-high";
const SAVE_KEY_DAILY = "flan-genie:loulou-daily";

const GAUGES = [
  { id: "asp", label: "Aspiration", icon: "🎯", color: "var(--corail)" },
  { id: "pro", label: "Production", icon: "🔨", color: "var(--turquoise)" },
  { id: "est", label: "Estime",     icon: "❤",  color: "var(--fougere)" },
  { id: "joie", label: "Joie",      icon: "🌼", color: "var(--jaune)" },
];

const DEFEATS = {
  "asp-low":  { emoji: "😶‍🌫️", label: "L'aspiration s'est dissoute",       sfx: "thud" },
  "asp-high": { emoji: "🚀",     label: "L'aspiration a décollé sans elle",  sfx: "grind" },
  "pro-low":  { emoji: "🦥",     label: "La production s'est figée",         sfx: "thud" },
  "pro-high": { emoji: "🤯",     label: "Le burnout l'a consumée",           sfx: "grind" },
  "est-low":  { emoji: "🫥",     label: "L'estime s'est effacée",            sfx: "thud" },
  "est-high": { emoji: "🤴",     label: "Le narcissisme l'a emportée",       sfx: "grind" },
  "joie-low": { emoji: "😐",     label: "La joie a déserté",                 sfx: "thud" },
  "joie-high":{ emoji: "🥹",     label: "La joie a tout emporté",            sfx: "grind" },
};

const ENC_LINES = [
  "Tu peux le faire.",
  "Crois en toi, c'est statistique.",
  "Tu es exactement ce que le monde attendait.",
  "On dit du bien de toi à Pantin.",
  "Continue. Continue. Continue.",
  "Tu es ma meilleure invention.",
  "Ne doute pas, l'univers vibre.",
  "La providence te suit du regard.",
  "Tu es mathématiquement spécial.",
  "Le ciel applaudit en silence.",
  "Reste exactement comme tu es.",
  "Tu es bien.",
  "Ta mère pense souvent à toi.",
  "C'est ton heure.",
  "Tu es plus que ce que tu crois être.",
  "Ne change rien, surtout.",
  "Sois la version de toi qu'on attend.",
  "La cigogne te ressemble.",
  "Tu es un projet aimé.",
  "Ton CV est honnête, c'est rare.",
  "Tu vas y arriver, peu importe ce que ça veut dire.",
  "Le marbre frémit quand tu passes.",
  "Tu es une bonne nouvelle.",
];

const DEC_LINES = [
  "Ce n'est pas pour toi.",
  "Quelqu'un d'autre le ferait mieux.",
  "Statistiquement, non.",
  "Tu confonds avec quelqu'un.",
  "Mauvaise grotte.",
  "Demande à ta mère.",
  "C'est gentil d'essayer.",
  "Soyons réalistes.",
  "Pas aujourd'hui.",
  "Tu n'es pas seule à ne pas y arriver.",
  "Personne ne te juge, sauf nous.",
  "Ne prends pas ça pour toi.",
  "Tu es un peu en retard.",
  "On en parle demain.",
  "C'est compliqué à expliquer.",
  "Reste calme.",
  "Ce n'est pas grave.",
  "Tu n'es pas obligée.",
  "Il y a plein d'autres choses.",
  "Ça ne marchera pas, mais bravo d'essayer.",
  "Tu fais comme tu peux.",
  "On a tous nos limites.",
  "C'est plus toi le problème, c'est le contexte.",
  "Le marbre soupire quand tu passes.",
  "Sois indulgente avec toi-même.",
];

const PALIERS = [
  { at: 5,   text: "Cinq personnes plus tard" },
  { at: 10,  text: "Tu as battu le neveu de Loulou" },
  { at: 20,  text: "Tu as battu Loulou · ⚡ Deltas amplifiés" },
  { at: 35,  text: "Tu as battu sa Machine" },
  { at: 40,  text: "⚠ Les jauges commencent à dériver" },
  { at: 50,  text: "Tu es Loulou réincarné · ⚡⚡ Deltas ×1.5" },
  { at: 75,  text: "Tu es au-delà de Loulou" },
  { at: 100, text: "Plus personne ne sait qui tu es" },
];

// Deltas dans l'ordre : [Aspiration, Production, Estime, Joie]
// Chaque choix doit AU MOINS faire monter une jauge ET en baisser une autre.
// Deltas dans l'ordre : [Aspiration, Production, Estime, Joie]
// Chaque carte porte aussi avatar (emoji) + tone (palette CSS).
// Tons : warm | cool | aged | playful | tragic | meta
const POOL = [
  { who: "Une enfant de 8 ans", text: "Maîtresse a dit que mon dessin était plat.",
    avatar: "🎨", tone: "playful",
    enc: [-12, -8, +18, +15], dec: [+15, +12, -20, -15] },
  { who: "Jean-Nathan, sculpteur", text: "Je commence demain. Promis. Demain.",
    avatar: "🗿", tone: "warm",
    enc: [+15, -18, -8, +10], dec: [-10, +18, -10, -12] },
  { who: "Œugénie, 27 ans", text: "Je crois que je suis triste pour rien.",
    avatar: "🧑", tone: "warm",
    enc: [-10, -8, +15, +18], dec: [+15, +18, -18, -15] },
  { who: "Un cadre de chez Auchan", text: "J'ai dépassé mes objectifs trimestriels.",
    avatar: "💼", tone: "cool",
    enc: [+18, -15, +20, +12], dec: [-10, +18, -15, -12] },
  { who: "Une retraitée", text: "Mon mari est mort en mars. Je tricote des chaussons.",
    avatar: "🧶", tone: "aged",
    enc: [-8, -10, +12, +15], dec: [+12, +10, -18, -22] },
  { who: "Un étudiant en philo", text: "J'ai lu Heidegger. Je ne suis plus le même.",
    avatar: "🧠", tone: "warm",
    enc: [+22, -18, +12, -8], dec: [-15, +12, -10, +10] },
  { who: "Un patron de PME", text: "Mon équipe ne respecte plus mes deadlines.",
    avatar: "👔", tone: "cool",
    enc: [+12, -18, +15, +8], dec: [-15, +20, -15, -12] },
  { who: "Laure-Yann", text: "J'ai jamais aimé personne avec passion.",
    avatar: "💅", tone: "warm",
    enc: [+18, -10, -8, +15], dec: [-12, +15, +12, -18] },
  { who: "Un poète raté", text: "J'ai publié à compte d'auteur. Trois exemplaires vendus.",
    avatar: "📖", tone: "tragic",
    enc: [+15, -15, +18, +12], dec: [-18, +15, -20, -15] },
  { who: "Un coach sportif", text: "Mes clients ne reviennent pas.",
    avatar: "🏋️", tone: "cool",
    enc: [-5, -18, +15, +12], dec: [+15, +18, -12, -10] },
  { who: "Une mariée à J-2", text: "Je ne suis plus sûre. Du tout.",
    avatar: "👰", tone: "warm",
    enc: [-15, +5, +12, +18], dec: [+20, -15, +8, -22] },
  { who: "Un gars qui sort de prison", text: "C'est ma première semaine dehors.",
    avatar: "🔓", tone: "tragic",
    enc: [+18, -15, +15, +12], dec: [-15, +18, -20, -15] },
  { who: "Un trader de 24 ans", text: "Je gagne plus que mes parents en un mois.",
    avatar: "💰", tone: "cool",
    enc: [+20, -22, +22, +15], dec: [-10, +18, -12, -10] },
  { who: "Une mère au foyer", text: "Mes enfants partent à la fac cet été.",
    avatar: "🏠", tone: "aged",
    enc: [+18, -10, -8, +15], dec: [+10, +15, -12, -18] },
  { who: "Un boulanger", text: "J'ai pas dormi depuis 12 ans. Le pain m'attend à 3h.",
    avatar: "🥖", tone: "tragic",
    enc: [-8, -15, +15, +18], dec: [+12, +15, -12, -15] },
  { who: "Un musicien de rue", text: "Personne ne s'arrête. Mais y'a une dame qui a pleuré.",
    avatar: "🎸", tone: "tragic",
    enc: [+15, -12, +18, +20], dec: [-12, +18, -15, -18] },
  { who: "Un patron d'EHPAD", text: "On manque d'effectifs. On compense par la patience.",
    avatar: "🏥", tone: "aged",
    enc: [-10, -12, +15, +12], dec: [+15, +15, -15, -12] },
  { who: "Un ado qui redouble", text: "J'ai eu 4 en maths. Encore.",
    avatar: "📚", tone: "playful",
    enc: [-12, -15, +18, +12], dec: [+18, +18, -18, -15] },
  { who: "Un sculpteur célèbre", text: "On me commande des bustes. Je m'ennuie en les faisant.",
    avatar: "🗽", tone: "meta",
    enc: [+15, -22, +12, +10], dec: [-12, +20, -10, -12] },
  { who: "Une danseuse de chenille", text: "Le festival m'a refusée. Encore.",
    avatar: "🐛", tone: "playful",
    enc: [+15, -15, +18, +15], dec: [-15, +18, -20, -18] },
  { who: "Loulou (à lui-même)", text: "Ma théorie tient. Mathématiquement, elle tient.",
    avatar: "🧮", tone: "meta",
    enc: [+18, -18, +15, -8], dec: [-12, +18, -10, +12] },
  { who: "Le facteur de Sains-Richaumont", text: "J'ai distribué 12 lettres ce matin. C'est beaucoup.",
    avatar: "📮", tone: "aged",
    enc: [-10, -12, +18, +15], dec: [+12, +15, -15, -15] },
  { who: "Une lycéenne", text: "J'ai fait un test. Y'a 80% que j'aille en prépa.",
    avatar: "🎓", tone: "playful",
    enc: [+18, -20, +15, +12], dec: [-10, +20, -15, -12] },
  { who: "Un retraité de la SNCF", text: "Je collectionne les horaires des trains supprimés.",
    avatar: "🚂", tone: "aged",
    enc: [+12, -10, +15, +18], dec: [-12, +15, -8, -15] },
  { who: "Une chanteuse de bar", text: "Le patron m'a dit que je chantais juste. Juste juste.",
    avatar: "🎤", tone: "tragic",
    enc: [+15, -12, +18, +20], dec: [-15, +18, -18, -18] },
  { who: "Le génie Gérard (lointain)", text: "Je tricote pour des inconnus. C'est plus pur.",
    avatar: "🐔", tone: "meta",
    enc: [-8, -12, +15, +12], dec: [+12, +15, -12, -15] },
];

// Cartes événement — apparaissent toutes les 15 cartes
const SPECIAL_CARDS = [
  { who: "La Machine surchauffe", text: "Tes choix sont inversés. Encourager devient décourager.",
    avatar: "⚙️", tone: "meta",
    enc: [-15, +18, -12, -10], dec: [+15, -18, +12, +10], special: "invert" },
  { who: "Loulou en personne", text: "Ton score est doublé sur cette carte. Choisis bien.",
    avatar: "🧮", tone: "meta",
    enc: [+15, -12, +12, +10], dec: [-12, +15, -10, -10], special: "double" },
  { who: "Pause café", text: "La jauge la plus extrême remonte vers 50%, peu importe le choix.",
    avatar: "☕", tone: "meta",
    enc: [+3, -5, +5, +5], dec: [-5, +5, -3, -5], special: "reset" },
  { who: "Vertige", text: "Une jauge au hasard se réinitialise à 50%.",
    avatar: "🌀", tone: "meta",
    enc: [+5, -3, +3, +3], dec: [-3, +5, -3, -3], special: "shuffle" },
];

// ============================================================
// State
// ============================================================
const state = {
  asp: 50, pro: 50, est: 50, joie: 50,
  score: 0,
  combo: 0,
  comboMax: 0,
  multiplier: 1,
  current: null,
  used: new Set(),
  paliersReached: new Set(),
  cardsPlayed: 0,
  lastSpecialAt: 0,
  gameOver: false,
  started: false,
  isDaily: false,
};

let high = parseInt(localStorage.getItem(SAVE_KEY_HIGH) || "0", 10);
let rng = Math.random;

// ============================================================
// DOM refs
// ============================================================
const gaugesContainer = document.getElementById("loulou-gauges");
const cardEl = document.getElementById("loulou-card");
const speakerEl = document.getElementById("lc-speaker");
const textEl = document.getElementById("lc-text");
const tagsEl = document.getElementById("lc-tags");
const avatarEl = document.getElementById("lc-avatar");
const numEl = document.getElementById("lc-num");
const scoreEl = document.getElementById("ls-score");
const highEl = document.getElementById("ls-high");
const comboEl = document.getElementById("ls-combo");
const comboBlock = document.getElementById("ls-combo-block");
const overlay = document.getElementById("overlay");
const loTitle = document.getElementById("lo-title");
const loSub = document.getElementById("lo-sub");
const loStart = document.getElementById("lo-start");
const defeatScene = document.getElementById("defeat-scene");
const defeatEmoji = document.getElementById("defeat-emoji");
const defeatLabel = document.getElementById("defeat-label");
const palierBanner = document.getElementById("palier-banner");
const dangerFrame = document.getElementById("danger-frame");

// ============================================================
// RNG / Daily
// ============================================================
function dailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function makeRng(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function todayDateStr() {
  return new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function toRoman(n) {
  if (n <= 0) return "·";
  const map = [["M",1000],["CM",900],["D",500],["CD",400],["C",100],["XC",90],
               ["L",50],["XL",40],["X",10],["IX",9],["V",5],["IV",4],["I",1]];
  let r = "";
  for (const [s, v] of map) { while (n >= v) { r += s; n -= v; } }
  return r;
}

// ============================================================
// Jauges
// ============================================================
function buildGauges() {
  gaugesContainer.innerHTML = "";
  GAUGES.forEach(g => {
    const w = document.createElement("div");
    w.className = "lg-gauge";
    w.id = "lg-" + g.id;
    w.innerHTML = `
      <div class="lg-head">
        <span class="lg-icon">${g.icon}</span>
        <span class="lg-label">${g.label}</span>
        <span class="lg-val" data-val></span>
      </div>
      <div class="lg-bar">
        <div class="lg-zone"></div>
        <div class="lg-fill" data-fill style="background:${g.color}"></div>
      </div>`;
    gaugesContainer.appendChild(w);
  });
}

function updateGauges(pulses) {
  let anyDanger = false;
  GAUGES.forEach(g => {
    const v = state[g.id];
    const root = document.getElementById("lg-" + g.id);
    root.querySelector("[data-fill]").style.width = Math.max(0, Math.min(100, v)) + "%";
    root.querySelector("[data-val]").textContent = Math.round(v) + "%";
    const isDanger = v <= 20 || v >= 80;
    const isCritical = v <= 12 || v >= 88;
    root.classList.toggle("warning", isDanger);
    root.classList.toggle("ideal", v >= 35 && v <= 65);
    if (isCritical) anyDanger = true;
    if (pulses && pulses[g.id]) {
      root.classList.remove("flash-up", "flash-down");
      void root.offsetWidth;
      root.classList.add(pulses[g.id] > 0 ? "flash-up" : "flash-down");
      setTimeout(() => root.classList.remove("flash-up", "flash-down"), 500);
    }
  });
  dangerFrame.classList.toggle("danger", anyDanger && !state.gameOver);
  scoreEl.textContent = state.score;
  highEl.textContent = high;
  const mult = computeMult();
  if (mult !== state.multiplier) {
    state.multiplier = mult;
    comboBlock.classList.remove("mult-2", "mult-3", "mult-5", "bump");
    void comboBlock.offsetWidth;
    if (mult >= 5) comboBlock.classList.add("mult-5");
    else if (mult >= 3) comboBlock.classList.add("mult-3");
    else if (mult >= 2) comboBlock.classList.add("mult-2");
    comboBlock.classList.add("bump");
    setTimeout(() => comboBlock.classList.remove("bump"), 450);
  }
  comboEl.textContent = "×" + mult;
}

function computeMult() {
  if (state.combo >= 20) return 5;
  if (state.combo >= 10) return 3;
  if (state.combo >= 5) return 2;
  return 1;
}

function spawnDamage(gaugeId, delta) {
  if (!delta || delta === 0) return;
  const root = document.getElementById("lg-" + gaugeId);
  if (!root) return;
  const el = document.createElement("div");
  el.className = "lg-damage " + (delta > 0 ? "pos" : "neg");
  el.textContent = (delta > 0 ? "+" : "") + Math.round(delta);
  root.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// ============================================================
// Difficulté progressive
// ============================================================
function difficultyFactor() {
  if (state.score < 20) return 1.0;
  if (state.score < 50) return 1.0 + (state.score - 20) / 60; // 1.0 → 1.5
  return 1.5;
}

function applyDrift() {
  // Au-delà de 40 points, la jauge la plus extrême s'éloigne encore
  if (state.score < 40) return;
  let target = null, maxDist = 0;
  GAUGES.forEach(g => {
    const dist = Math.abs(state[g.id] - 50);
    if (dist > maxDist) { maxDist = dist; target = g; }
  });
  if (target && maxDist > 5) {
    const direction = state[target.id] > 50 ? +1 : -1;
    const driftAmount = state.score >= 60 ? 2.2 : 1.5;
    state[target.id] = Math.max(-1, Math.min(101, state[target.id] + direction * driftAmount));
  }
}

// ============================================================
// Sous-titres random
// ============================================================
function refreshBtnSubs() {
  const enc = document.querySelector("#btn-encourage .loulou-btn-sub");
  const dec = document.querySelector("#btn-discourage .loulou-btn-sub");
  enc.textContent = '"' + ENC_LINES[Math.floor(rng() * ENC_LINES.length)] + '"';
  dec.textContent = '"' + DEC_LINES[Math.floor(rng() * DEC_LINES.length)] + '"';
}

// ============================================================
// Pioche cartes
// ============================================================
function pickCard() {
  state.cardsPlayed += 1;
  // Carte spéciale tous les 15 ?
  if (state.cardsPlayed - state.lastSpecialAt >= 15) {
    state.lastSpecialAt = state.cardsPlayed;
    return SPECIAL_CARDS[Math.floor(rng() * SPECIAL_CARDS.length)];
  }
  if (state.used.size >= POOL.length) state.used.clear();
  let pick;
  let tries = 0;
  do {
    pick = POOL[Math.floor(rng() * POOL.length)];
    tries++;
  } while (state.used.has(pick) && tries < 20);
  state.used.add(pick);
  return pick;
}

function showCard(card) {
  state.current = card;
  speakerEl.textContent = card.who;
  textEl.textContent = "« " + card.text + " »";
  avatarEl.textContent = card.avatar || "❓";
  numEl.textContent = toRoman(state.cardsPlayed);
  cardEl.setAttribute("data-tone", card.tone || "warm");
  tagsEl.innerHTML = "";
  cardEl.classList.remove("swipe-left", "swipe-right", "special");
  if (card.special) cardEl.classList.add("special");
  void cardEl.offsetWidth;
  cardEl.classList.add("appearing");
  refreshBtnSubs();
}

// ============================================================
// Décision
// ============================================================
function decide(direction) {
  if (state.gameOver || !state.current) return;
  const card = state.current;
  const deltas = direction === "enc" ? card.enc : card.dec;
  const factor = difficultyFactor();
  const pulses = {};

  // Special: reset → ramène la jauge la plus extrême à 50
  if (card.special === "reset") {
    let target = GAUGES[0], maxDist = 0;
    GAUGES.forEach(g => {
      const dist = Math.abs(state[g.id] - 50);
      if (dist > maxDist) { maxDist = dist; target = g; }
    });
    state[target.id] = 50;
    pulses[target.id] = -1;
  }
  // Special: shuffle → réinitialise une jauge au hasard à 50
  if (card.special === "shuffle") {
    const g = GAUGES[Math.floor(rng() * GAUGES.length)];
    state[g.id] = 50;
    pulses[g.id] = -1;
  }

  GAUGES.forEach((g, i) => {
    const d = Math.round(deltas[i] * factor);
    state[g.id] = Math.max(-1, Math.min(101, state[g.id] + d));
    if (!pulses[g.id]) pulses[g.id] = d;
    spawnDamage(g.id, d);
  });

  // Score avec multiplicateur (+ double si carte spéciale "double")
  const mult = computeMult();
  let gain = mult;
  if (card.special === "double") gain *= 2;
  state.score += gain;

  // Combo
  const inIdeal = GAUGES.every(g => state[g.id] >= 35 && state[g.id] <= 65);
  if (inIdeal) {
    state.combo += 1;
    if (state.combo > state.comboMax) state.comboMax = state.combo;
  } else {
    state.combo = 0;
  }

  AudioFX[direction === "enc" ? "pop" : "thud"]();
  cardEl.classList.add(direction === "enc" ? "swipe-right" : "swipe-left");

  // Drift entre cartes
  applyDrift();

  updateGauges(pulses);
  checkPalier();

  const failed = GAUGES.find(g => state[g.id] <= 0 || state[g.id] >= 100);
  if (failed) {
    state.gameOver = true;
    const isHigh = state[failed.id] >= 100;
    setTimeout(() => playDefeat(failed, isHigh), 400);
    return;
  }

  setTimeout(() => showCard(pickCard()), 420);
}

function checkPalier() {
  for (const p of PALIERS) {
    if (state.score >= p.at && !state.paliersReached.has(p.at)) {
      state.paliersReached.add(p.at);
      showPalier(p.text);
      AudioFX.ding(0.1);
      return;
    }
  }
}

function showPalier(text) {
  palierBanner.textContent = text;
  palierBanner.classList.remove("show");
  void palierBanner.offsetWidth;
  palierBanner.classList.add("show");
  setTimeout(() => palierBanner.classList.remove("show"), 1800);
}

// ============================================================
// Défaite spectaculaire
// ============================================================
function playDefeat(gauge, isHigh) {
  dangerFrame.classList.remove("danger");
  if (AudioFX.stopMusic) AudioFX.stopMusic();
  const key = gauge.id + (isHigh ? "-high" : "-low");
  const def = DEFEATS[key];
  defeatScene.className = "defeat-scene active " + key + " shake";
  defeatEmoji.textContent = def.emoji;
  defeatScene.setAttribute("data-emoji", def.emoji);
  defeatLabel.textContent = def.label;
  AudioFX[def.sfx]();
  setTimeout(() => defeatScene.classList.remove("shake"), 2000);
  setTimeout(() => {
    defeatScene.classList.remove("active");
    showGameOver(gauge, isHigh, key);
  }, 2500);
}

function showGameOver(failedGauge, isHigh, key) {
  if (state.score > high) {
    high = state.score;
    localStorage.setItem(SAVE_KEY_HIGH, String(high));
  }
  if (state.isDaily) localStorage.setItem(SAVE_KEY_DAILY + ":" + dailySeed(), String(state.score));
  const def = DEFEATS[key];
  loTitle.textContent = def.label;
  const shareHtml = state.isDaily ? `<button id="lo-share" class="lo-share-btn">📋 Copier le récap</button>` : "";
  loSub.innerHTML = `
    <strong>Score :</strong> ${state.score} ${state.isDaily ? "<em>(défi du jour)</em>" : ""}<br>
    <strong>Record :</strong> ${high}<br>
    <strong>Combo zone idéale :</strong> ${state.comboMax} d'affilée<br><br>
    <em>«&nbsp;Pour que le système tienne, les estimes de soi doivent décroître exponentiellement.&nbsp;»</em><br>— Loulou, Acte I sc.5
    ${shareHtml ? "<br><br>" + shareHtml : ""}`;
  loStart.className = "loulou-btn encore";
  loStart.innerHTML = `Encore <span class="key-hint">Espace ou clic</span>`;
  overlay.hidden = false;

  // bouton partage (mode quotidien)
  setTimeout(() => {
    const btn = document.getElementById("lo-share");
    if (btn) btn.onclick = doShare;
  }, 50);

  try {
    Save.recordRun("loulou",
      state.score >= 30 ? "complete" : state.score >= 15 ? "partielle" : "neutre",
      { estime: state.est, suspicion: 0, charge: 0, doux: 0, cruel: 0, s_estime_min: 0, s_suspicion_max: 0, s_genie_smiled: 0, s_machine_used: 0, s_near_bell: false, tour: state.score },
      { score: state.score, gauge_failed: failedGauge.id, daily: state.isDaily });
  } catch (e) {}
}

// ============================================================
// Partage (mode quotidien)
// ============================================================
function buildShareString() {
  const grid = GAUGES.map(g => {
    const v = state[g.id];
    if (v <= 20 || v >= 80) return "🟥";
    if (v >= 35 && v <= 65) return "🟩";
    return "🟨";
  }).join("");
  return `Loulou — Machine du jour · ${todayDateStr()}
Score ${state.score} · combo max ×${computeMaxMultFromCombo(state.comboMax)}
${grid}`;
}

function computeMaxMultFromCombo(combo) {
  if (combo >= 20) return 5;
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  return 1;
}

function doShare() {
  const text = buildShareString();
  if (navigator.share) {
    navigator.share({ text }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  navigator.clipboard.writeText(text).then(() => {
    const b = document.getElementById("lo-share");
    if (b) { b.textContent = "✓ Copié dans le presse-papier"; setTimeout(() => { b.textContent = "📋 Copier le récap"; }, 2000); }
  }).catch(() => {
    prompt("Copie ce texte :", text);
  });
}

// ============================================================
// Start
// ============================================================
function startGame(daily = false) {
  state.asp = 50; state.pro = 50; state.est = 50; state.joie = 50;
  state.score = 0;
  state.combo = 0;
  state.comboMax = 0;
  state.multiplier = 1;
  state.used.clear();
  state.paliersReached.clear();
  state.cardsPlayed = 0;
  state.lastSpecialAt = 0;
  state.gameOver = false;
  state.started = true;
  state.isDaily = daily;
  rng = daily ? makeRng(dailySeed()) : Math.random;
  overlay.hidden = true;
  defeatScene.classList.remove("active");
  dangerFrame.classList.remove("danger");
  comboBlock.classList.remove("mult-2", "mult-3", "mult-5");
  buildGauges();
  updateGauges();
  showCard(pickCard());
  if (AudioFX.startMusic) AudioFX.startMusic();
}

// Écran d'accueil custom : 2 options
function buildIntroScreen() {
  loTitle.textContent = "Loulou — La Machine";
  loSub.innerHTML = `Tu joues Loulou, ex-banquier reconverti inventeur. Maintiens l'équilibre psychique de chaque passant.<br><br>
    <strong>Défi du jour :</strong> mêmes cartes, même ordre, pour tout le monde.<br>
    Date : <em>${todayDateStr()}</em>`;
  loStart.className = "loulou-btn encore";
  loStart.innerHTML = `Partie libre <span class="key-hint">Espace</span>`;
  // Ajoute bouton daily si pas déjà
  let daily = document.getElementById("lo-daily");
  if (!daily) {
    daily = document.createElement("button");
    daily.id = "lo-daily";
    daily.className = "loulou-btn discourage";
    daily.style.width = "100%";
    daily.style.marginTop = "10px";
    daily.style.padding = "18px";
    daily.style.fontSize = "16px";
    daily.innerHTML = `Défi du jour 🗓 <span class="key-hint">D</span>`;
    loStart.parentNode.appendChild(daily);
    daily.onclick = () => startGame(true);
  }
}

// ============================================================
// Inputs
// ============================================================
document.getElementById("btn-encourage").onclick = () => decide("enc");
document.getElementById("btn-discourage").onclick = () => decide("dec");
document.getElementById("zone-right").onclick = () => decide("enc");
document.getElementById("zone-left").onclick = () => decide("dec");

document.addEventListener("keydown", (e) => {
  if (!state.started || state.gameOver) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      startGame(false);
    } else if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      startGame(true);
    }
    return;
  }
  if (e.key === "ArrowRight") { e.preventDefault(); decide("enc"); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); decide("dec"); }
});

let touchStartX = 0;
cardEl.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
cardEl.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 60) decide(dx > 0 ? "enc" : "dec");
}, { passive: true });

loStart.onclick = () => startGame(false);

document.getElementById("restart").onclick = () => {
  state.gameOver = true;
  overlay.hidden = true;
  if (AudioFX.stopMusic) AudioFX.stopMusic();
  startGame(false);
};

const soundBtn = document.getElementById("sound-toggle");
soundBtn.onclick = () => {
  const m = !AudioFX.isMuted();
  AudioFX.setMuted(m);
  soundBtn.textContent = m ? "🔇" : "🔊";
  soundBtn.classList.toggle("muted", m);
  if (m && AudioFX.stopMusic) AudioFX.stopMusic();
  else if (!m && state.started && !state.gameOver && AudioFX.startMusic) AudioFX.startMusic();
};

let audioPrimed = false;
document.body.addEventListener("click", () => {
  if (audioPrimed) return;
  audioPrimed = true;
  AudioFX.init();
});

// Init
buildGauges();
updateGauges();
highEl.textContent = high;
buildIntroScreen();
