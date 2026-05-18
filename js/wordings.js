window.WORDINGS = {
  symbols: {
    flan: "🍮",
  },
  storage: {
    saveKey: "flan-chasse-progress",
  },
  code: {
    prefix: "FLAN-",
  },
  modes: {
    beginner: {
      label: "Débuflan",
      sub: "Tout doux. Pour débuter.",
    },
    medium: {
      label: "Mi-flan",
      sub: "Un cran au-dessus.",
    },
    hardcore: {
      label: "Hardcôt",
      sub: "Trop dur pour la plupart.",
    },
  },
  hud: {
    roundLabel: "Manche",
    roundTotal: "12",
    timeLabel: "Temps",
    timeUnit: "s",
    restart: {
      title: "Recommencer la partie",
      aria: "Recommencer",
      label: "Recommencer",
    },
    difficulty: {
      title: "Changer la difficulté",
      aria: "Changer la difficulté",
      label: "Difficulté",
    },
    ambience: {
      title: "Couper la musique d'ambiance",
      aria: "Musique d'ambiance",
      label: "Ambiance",
    },
    sfx: {
      title: "Couper les bruitages",
      aria: "Bruitages",
      label: "Bruitages",
    },
    home: {
      title: "Retour au hub",
      aria: "Hub",
    },
  },
  intro: {
    title: "La Chasse au Flan",
    leadHtml: "Trouve le <strong>🍮</strong> dans la foule. <strong>12 manches</strong>. Évite les imitateurs.",
    modeTitle: "Choisis ton mode",
  },
  win: {
    title: "Bravo !",
    subtitle: "Tu as trouvé le flan.",
    inviteLine1: "Tu as gagné le droit de venir",
    inviteTitle: "LE FLAN PÂTISSIER",
    inviteMetaHtml: "<span class=\"invite-author\">d'Etienne Bennequin · Cie de la Toque Flamboyante<br></span><strong>Aujourd'hui à 15 h 30</strong><br>Théâtre du Tremplin, Avignon",
    inviteHintHtml: "Place <strong>payante</strong>, comme tout le monde. On n'a pas les moyens, désolé.<br>Mais on est très contents que tu viennes.",
    modeTitle: "Rejouer dans un mode",
    hub: "Hub",
    newRecord: "✨ Nouveau record !",
    yourTime: "Ton temps",
  },
  lose: {
    title: "Loupé.",
    message: "Tu as raté le flan, mais le flan ne t'a pas raté.",
    inviteLine1: "Tu peux quand même venir",
    inviteTitle: "LE FLAN PÂTISSIER",
    inviteMetaHtml: "<strong>Aujourd'hui à 15 h 30</strong><br>Théâtre du Tremplin, Avignon",
    inviteHintHtml: "Place <strong>payante</strong> aussi (on n'a pas les moyens).<br>Mais à la fin, une <strong>part de flan t'attend</strong>. Tu as perdu et c'est ça la récompense.",
    modeTitle: "Essayer encore dans un mode",
    trickyTitle: "Faux flan.",
    trickyMessage: "C'était un imitateur. Mais on ne t'en veut pas.",
    timeoutTitle: "Le temps t'a battu.",
    timeoutMessage: "Le flan était là, quelque part. Tu l'as raté.",
    defaultTitle: "Loupé.",
    defaultMessage: "Mais le flan ne t'a pas raté.",
  },
  transition: {
    findFlanTitle: "Trouve le flan",
    findFlanSubtitle: "Clique-le dès que tu le vois.",
    roundLabel: "Manche",
  },
  effects: {
    giantRoosterText: "COCORICO !!",
  },
  reactions: {
    bravo: "Bravo !",
    miss: "Raté !",
    hurry: "Vite !",
  },
  records: {
    label: "Record ",
  },
  bubbles: [
    "Hé !", "Là-bas !", "Non, ici", "Trop tard", "COT COT", "Pas moi",
    "Cherche bien", "🍮 →", "← 🍮", "↑ 🍮", "Plus vite", "Oups",
    "Encore moi", "Ouvre l'œil", "Boum", "Hop hop hop", "Y'a un piège",
    "Pas celui-là", "Mais non !", "Là, là, là !", "Vite vite", "Tu chauffes",
    "Brûlant", "Froid", "Tu rêves", "Cocoricot", "Aïe", "Caquète",
  ],
  genieIntros: [
    { emoji: "🐔", title: "Le premier génie", subtitle: "Il est gentil. Tu vas voir." },
    { emoji: "🐔", title: "Le premier génie", subtitle: "Voilà sa poule." },
    { emoji: "🐔🐔", title: "Le deuxième génie", subtitle: "Foule plus dense." },
    { emoji: "🐔🐔", title: "Le deuxième génie", subtitle: "Et un imitateur." },
    { emoji: "🐔🐔🐔", title: "Le troisième génie", subtitle: "Plumes et bulles." },
    { emoji: "🐔🐔🐔", title: "Le troisième génie", subtitle: "Les emojis mutent." },
    { emoji: "🐔🐔🐔🐔", title: "Le quatrième génie", subtitle: "Tout ressemble au flan." },
    { emoji: "🐔🐔🐔🐔", title: "Le quatrième génie", subtitle: "Et des œufs te tombent dessus." },
    { emoji: "🐔🐔🐔🐔🐔", title: "Le cinquième génie", subtitle: "Les emojis permutent." },
    { emoji: "🐔🐔🐔🐔🐔", title: "Le cinquième génie", subtitle: "Plus vite, plus dur." },
    { emoji: "🐔🐔🐔🐔🐔🐔", title: "Le sixième génie", subtitle: "Le dernier. Bonne chance." },
    { emoji: "🐔🐔🐔🐔🐔🐔", title: "Le sixième génie", subtitle: "Cocorico final." },
  ],
};

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function applyChasseWordings() {
  const w = window.WORDINGS;
  if (!w) return;

  document.title = "La Chasse au Flan — Avignon";

  setText("ch-title-line1", w.intro.title);
  setText("ch-title-line2", "Avignon · Festival 2026");

  setText("ch-round-label", w.hud.roundLabel);
  setText("ch-round-total", w.hud.roundTotal);
  setText("ch-time-label", w.hud.timeLabel);
  setText("ch-time-unit", w.hud.timeUnit);

  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.title = w.hud.restart.title;
    restartBtn.setAttribute("aria-label", w.hud.restart.aria);
  }
  setText("restart-btn-label", w.hud.restart.label);

  const modeBtn = document.getElementById("mode-btn");
  if (modeBtn) {
    modeBtn.title = w.hud.difficulty.title;
    modeBtn.setAttribute("aria-label", w.hud.difficulty.aria);
  }
  setText("mode-btn-label", w.hud.difficulty.label);

  const ambienceBtn = document.getElementById("ambience-toggle");
  if (ambienceBtn) {
    ambienceBtn.title = w.hud.ambience.title;
    ambienceBtn.setAttribute("aria-label", w.hud.ambience.aria);
  }
  setText("ambience-btn-label", w.hud.ambience.label);

  const sfxBtn = document.getElementById("sfx-toggle");
  if (sfxBtn) {
    sfxBtn.title = w.hud.sfx.title;
    sfxBtn.setAttribute("aria-label", w.hud.sfx.aria);
  }
  setText("sfx-btn-label", w.hud.sfx.label);

  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.title = w.hud.home.title;
    homeBtn.setAttribute("aria-label", w.hud.home.aria);
  }

  setText("intro-title", w.intro.title);
  setHtml("intro-lead", w.intro.leadHtml);
  setText("intro-mode-title", w.intro.modeTitle);

  setText("mode-beginner-label", w.modes.beginner.label);
  setText("mode-beginner-sub", w.modes.beginner.sub);
  setText("mode-medium-label", w.modes.medium.label);
  setText("mode-medium-sub", w.modes.medium.sub);
  setText("mode-hardcore-label", w.modes.hardcore.label);
  setText("mode-hardcore-sub", w.modes.hardcore.sub);

  setText("win-title", w.win.title);
  setText("win-subtitle", w.win.subtitle);
  setText("win-invite-line1", w.win.inviteLine1);
  setText("win-invite-title", w.win.inviteTitle);
  setHtml("win-invite-meta", w.win.inviteMetaHtml);
  setHtml("win-invite-hint", w.win.inviteHintHtml);
  setText("win-mode-title", w.win.modeTitle);
  setText("mode-win-beginner-label", w.modes.beginner.label);
  setText("mode-win-medium-label", w.modes.medium.label);
  setText("mode-win-hardcore-label", w.modes.hardcore.label);
  setText("win-hub-label", w.win.hub);

  setText("lose-title", w.lose.title);
  setText("lose-message", w.lose.message);
  setText("lose-invite-line1", w.lose.inviteLine1);
  setText("lose-invite-title", w.lose.inviteTitle);
  setHtml("lose-invite-meta", w.lose.inviteMetaHtml);
  setHtml("lose-invite-hint", w.lose.inviteHintHtml);
  setText("lose-mode-title", w.lose.modeTitle);
  setText("mode-lose-beginner-label", w.modes.beginner.label);
  setText("mode-lose-medium-label", w.modes.medium.label);
  setText("mode-lose-hardcore-label", w.modes.hardcore.label);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyChasseWordings);
} else {
  applyChasseWordings();
}