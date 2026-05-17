// ============================================================
// HUB — page d'accueil avec scènes, stats, achievements
// ============================================================

const SCENES = [
  { id: "n1", num: "Prologue", title: "Le biscuit", file: null, total: null },
  { id: "n2", num: "Acte I — sc. 2", title: "Le flan anonyme", file: "niveau-2.html", total: 4 },
  { id: "n3", num: "Acte I — sc. 3", title: "Les flans des mémés", file: null, total: null },
  { id: "n4", num: "Acte I — sc. 5", title: "La machine à encourager", file: "niveau-loulou.html", total: null, arcade: true },
  { id: "n5", num: "Acte II — sc. 3", title: "Le Génie Gentil", file: "niveau-5.html", total: 4 },
  { id: "n6", num: "Acte II — sc. 4", title: "La grotte picarde", file: null, total: null },
  { id: "n7", num: "Acte II — sc. 5", title: "Le coq géant", file: null, total: null },
  { id: "n8", num: "Acte II — sc. 7", title: "La marmite", file: null, total: null },
  { id: "n9", num: "Acte II — sc. 9", title: "Le métro", file: null, total: null },
  { id: "n10", num: "Acte II — sc. 10", title: "La transsubstantiation", file: null, total: null },
  { id: "n11", num: "Acte III — sc. 1", title: "Le bloc de marbre", file: null, total: null },
  { id: "n12", num: "Acte III — sc. 4", title: "Le père-pâtissier", file: null, total: null },
];

const ENDINGS_FOR = {
  n5: ["complete", "partielle", "neutre", "echec"],
  n2: ["complete", "partielle", "neutre", "echec"],
};

const ACH_ICONS = {
  first_step: "👣",
  facteur_1998: "📮",
  sans_machine: "🔇",
  sans_cruel: "🕊",
  cloche_frolee: "🔔",
  succes_complet: "🥇",
  saboteuse: "💥",
  trois_fins: "🎭",
  huguette: "🐓",
  recidiviste: "🔁",
  trahison_flan: "🍮",
  honnete: "💍",
};

function renderHub() {
  const summary = Save.summary();

  // Stats top
  document.getElementById("stat-runs").textContent = summary.runs;
  document.getElementById("stat-endings").textContent = summary.endings_count;
  document.getElementById("stat-ach").textContent = summary.achievements_unlocked + " / " + summary.achievements_total;

  // Grille de scènes
  const grid = document.getElementById("scenes-grid");
  grid.innerHTML = "";
  const endings = Save.getEndings();

  SCENES.forEach(sc => {
    const card = document.createElement(sc.file ? "a" : "div");
    if (sc.file) card.href = sc.file;
    card.className = "scene-card " + (sc.file ? "playable" : "locked");

    const num = document.createElement("div");
    num.className = "scene-num";
    num.textContent = sc.num;
    card.appendChild(num);

    const title = document.createElement("div");
    title.className = "scene-title";
    title.textContent = sc.title;
    card.appendChild(title);

    // Status
    const stat = document.createElement("span");
    stat.className = "scene-status";
    if (!sc.file) {
      stat.classList.add("locked-tag");
      stat.textContent = "Verrouillé";
    } else if (sc.arcade) {
      stat.classList.add("play-tag");
      stat.style.background = "var(--corail)";
      stat.textContent = "Arcade";
    } else {
      const ends = ENDINGS_FOR[sc.id] || [];
      const seen = ends.filter(e => endings[sc.id + ":" + e]).length;
      if (seen === ends.length && seen > 0) {
        stat.classList.add("done-tag");
        stat.textContent = "Complet";
      } else {
        stat.classList.add("play-tag");
        stat.textContent = seen > 0 ? "Continuer" : "Jouer";
      }
    }
    card.appendChild(stat);

    // Record pour le niveau arcade
    if (sc.arcade) {
      const high = parseInt(localStorage.getItem("flan-genie:loulou-high") || "0", 10);
      if (high > 0) {
        const r = document.createElement("div");
        r.style.fontSize = "11px";
        r.style.color = "var(--ink-soft)";
        r.style.marginTop = "auto";
        r.textContent = "Record : " + high;
        card.appendChild(r);
      }
    }

    // Pips des fins découvertes
    if (sc.file && ENDINGS_FOR[sc.id]) {
      const pips = document.createElement("div");
      pips.className = "scene-endings";
      ENDINGS_FOR[sc.id].forEach(e => {
        const pip = document.createElement("span");
        pip.className = "pip" + (endings[sc.id + ":" + e] ? " seen" : "");
        pip.title = e;
        pips.appendChild(pip);
      });
      card.appendChild(pips);
    }

    grid.appendChild(card);
  });

  // Trophées
  const achGrid = document.getElementById("ach-grid");
  achGrid.innerHTML = "";
  const achs = Save.getAchievements();
  achs.forEach(a => {
    const c = document.createElement("div");
    c.className = "ach-card" + (a.unlocked ? "" : " locked");
    c.innerHTML = `<div class="ach-icon">${ACH_ICONS[a.id] || "🏆"}</div>
      <div class="ach-body">
        <div class="ach-name">${a.label}</div>
        <div class="ach-desc">${a.unlocked ? a.desc : "???"}</div>
      </div>`;
    achGrid.appendChild(c);
  });

  // Historique
  if (summary.history && summary.history.length) {
    document.getElementById("history-section").hidden = false;
    const hl = document.getElementById("history-list");
    hl.innerHTML = "";
    summary.history.slice(0, 8).forEach(h => {
      const d = document.createElement("div");
      d.className = "history-item";
      const when = new Date(h.date);
      const whenStr = when.toLocaleDateString("fr-FR") + " " + when.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
      d.innerHTML = `<span class="h-when">${whenStr}</span>
        <span><span class="h-level">${h.level.toUpperCase()}</span> · ${h.doux} doux / ${h.cruel} cruel · estime ↓${h.estime_min}% · suspicion ↑${h.suspicion_max}%</span>
        <span class="h-end">${h.ending}</span>`;
      hl.appendChild(d);
    });
  }
}

document.getElementById("reset-save").onclick = () => {
  if (confirm("Effacer toute la sauvegarde (runs, trophées, état persistant) ?")) {
    Save.reset();
    location.reload();
  }
};

renderHub();
