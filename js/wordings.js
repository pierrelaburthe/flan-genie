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
      sub: "Le flan à la portée du premier venu.",
    },
    hardcore: {
      label: "Hardcôt",
      sub: "Les poules se rebellent.",
    },
    infinity: {
      label: "Inflanity",
      sub: "Un enfer sans fin.",
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
  },
  intro: {
    title: "La Chasse au Flan",
    leadHtml: "Comme Œugénie, trouve le <strong>🍮</strong> dans la foule.",
    modeTitle: "Choisis ton mode",
  },
  invite: {
    title: "LE FLAN PÂTISSIER",
    metaHtml: "<strong>Tous les jours à 15 h 30</strong><br>Théâtre Tremplin, Avignon",
  },
  win: {
    title: "Bravo !",
    subtitle: "Tu as trouvé le flan.",
    inviteLine1: "Tu as gagné le droit de voir",
    inviteHintHtml: "Place <strong>payante</strong>, comme tout le monde.<br>On n'a pas les moyens, désolé.<br>Mais on est très contents que tu viennes.",
    modeTitle: "Rejouer",
    newRecord: "✨ Nouveau record !",
    yourTime: "Ton temps",
  },
  lose: {
    title: "Loupé.",
    message: "Tu as raté le flan, mais le flan ne t'a pas raté.",
    inviteLine1: "Tu peux quand même venir voir",
    inviteHintHtml: "Ca t'aidera peut-être à t'améliorer.",
    modeTitle: "Réessayer",
    trickyTitle: "Faux flan.",
    trickyMessage: "C'était un imitateur. Mais on ne t'en veut pas.",
    timeoutTitle: "Trop lent !",
    timeoutMessage: "Le flan s'est enfui.",
    defaultTitle: "Loupé.",
    defaultMessage: "Mais le flan ne t'a pas raté.",
  },
  transition: {
    findFlanTitle: "Trouve le flan",
    findFlanSubtitle: "Clique dessus dès que tu le vois.",
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
    labelInfinity: "Meilleur niveau : ",
  },
  infinity: {
    trickyTitle: "C'était pas un flan.",
    trickyMessage: "C'était un imitateur. Mais on ne t'en veut pas.",
    timeoutTitle: "Le temps est écoulé.",
    timeoutMessage: "Même l'infini a ses limites.",
    defaultTitle: "Loupé.",
    defaultMessage: "L'infini ne pardonne pas.",
    levelReached: "Niveau atteint",
    newLevelRecord: "✨ Nouveau record de niveau !",
    inviteLine1: "Tu as bien mérité de voir",
    inviteHintHtml: "Ca te fera pas de mal de sortir un peu.",
  },
  bubbles: [
    "Hé !", "Là-bas !", "Non, ici", "Trop tard", "COT COT", "Pas moi",
    "Cherche bien", "🍮 →", "← 🍮", "↑ 🍮", "Plus vite", "Oups",
    "Encore moi", "Ouvre l'œil", "Boum", "Hop hop hop", "Y'a un piège",
    "Pas celui-là", "Mais non !", "Là, là, là !", "Vite vite", "Tu chauffes",
    "Brûlant", "Froid", "Tu rêves", "Cocoricot", "Aïe", "Caquète",
  ],
  genieIntros: [
    { emoji: "🐔", title: "Le premier génie · I", subtitle: "Il est gentil. Tu vas voir." },
    { emoji: "🐔", title: "Le premier génie · II", subtitle: "Voilà sa poule." },
    { emoji: "🐔🐔", title: "Le deuxième génie · I", subtitle: "Foule plus dense." },
    { emoji: "🐔🐔", title: "Le deuxième génie · II", subtitle: "Et un imitateur." },
    { emoji: "🐔🐔🐔", title: "Le troisième génie · I", subtitle: "Plumes et bulles." },
    { emoji: "🐔🐔🐔", title: "Le troisième génie · II", subtitle: "Les emojis mutent." },
    { emoji: "🐔🐔🐔🐔", title: "Le quatrième génie · I", subtitle: "Tout ressemble au flan." },
    { emoji: "🐔🐔🐔🐔", title: "Le quatrième génie · II", subtitle: "Et des œufs te tombent dessus." },
    { emoji: "🐔🐔🐔🐔🐔", title: "Le cinquième génie · I", subtitle: "Les emojis permutent." },
    { emoji: "🐔🐔🐔🐔🐔", title: "Le cinquième génie · II", subtitle: "Plus vite, plus dur." },
    { emoji: "🐔🐔🐔🐔🐔🐔", title: "Le sixième génie · I", subtitle: "Le dernier. Bonne chance." },
    { emoji: "🐔🐔🐔🐔🐔🐔", title: "Le sixième génie · II", subtitle: "Cocorico final." },
  ],
  genieIntrosInfinity: [
    { emoji: "♾️",             title: "Au-delà des limites",      subtitle: "Seul le chaos t'attend." },
    { emoji: "🐔🐔🐔🐔🐔🐔",   title: "Tu es encore là ?",        subtitle: "Impressionnant." },
    { emoji: "🌀",             title: "Et encore",                subtitle: "Et encore. Et encore." },
    { emoji: "🐔💥",           title: "Plus fort, plus vite",     subtitle: "Plus flan." },
    { emoji: "🔁",             title: "Boucle infinie",            subtitle: "On n'est pas pressés." },
    { emoji: "😶",             title: "Tu cherches encore ?",      subtitle: "Respect." },
    { emoji: "🐔💀",           title: "La poule ne dort plus",    subtitle: "Toi non plus." },
    { emoji: "🌑",             title: "Le chaos se densifie",     subtitle: "Bonne chance quand même." },
    { emoji: "😮",             title: "Sérieusement ?",           subtitle: "Vas-y, on regarde." },
    { emoji: "🐔🐔🐔🐔🐔🐔🐔", title: "Niveau inconnu",            subtitle: "Le flan prolifère." },
    { emoji: "🔥",             title: "Incandescent",             subtitle: "Ça va finir en cendre." },
    { emoji: "🐔🐔🐔🐔🐔🐔",   title: "Fragment suivant",         subtitle: "Le flan est indomptable." },
    { emoji: "💥",             title: "Explosion proche",         subtitle: "On voit pas comment tu tiens." },
    { emoji: "💩🐔",           title: "Absolument tout",          subtitle: "Tout est ligué contre toi." },
    { emoji: "👓",             title: "T'as des yeux bioniques ?", subtitle: "Demande-toi." },
    { emoji: "🐔🕔",           title: "Pas d'heure pour le flan", subtitle: "Ni pour les fous." },
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

  setText("ch-title-line1", "Le Flan Patissier");
  setText("ch-title-line2", "Avignon · Festival Off 2026");

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

  setText("intro-title", w.intro.title);
  setHtml("intro-lead", w.intro.leadHtml);
  setText("intro-mode-title", w.intro.modeTitle);

  setText("mode-beginner-label", w.modes.beginner.label);
  setText("mode-beginner-sub", w.modes.beginner.sub);
  setText("mode-hardcore-label", w.modes.hardcore.label);
  setText("mode-hardcore-sub", w.modes.hardcore.sub);
  setText("mode-infinity-label", w.modes.infinity.label);
  setText("mode-infinity-sub", w.modes.infinity.sub);

  setText("win-title", w.win.title);
  setText("win-subtitle", w.win.subtitle);
  setText("win-invite-line1", w.win.inviteLine1);
  setText("win-invite-title", w.invite.title);
  setHtml("win-invite-meta", w.invite.metaHtml);
  setHtml("win-invite-hint", w.win.inviteHintHtml);
  setText("win-mode-title", w.win.modeTitle);
  setText("mode-win-beginner-label", w.modes.beginner.label);
  setText("mode-win-hardcore-label", w.modes.hardcore.label);
  setText("mode-win-infinity-label", w.modes.infinity.label);
  setText("win-hub-label", w.win.hub);

  setText("lose-title", w.lose.title);
  setText("lose-message", w.lose.message);
  setText("lose-invite-line1", w.lose.inviteLine1);
  setText("lose-invite-title", w.invite.title);
  setHtml("lose-invite-meta", w.invite.metaHtml);
  setHtml("lose-invite-hint", w.lose.inviteHintHtml);
  setText("lose-mode-title", w.lose.modeTitle);
  setText("mode-lose-beginner-label", w.modes.beginner.label);
  setText("mode-lose-hardcore-label", w.modes.hardcore.label);
  setText("mode-lose-infinity-label", w.modes.infinity.label);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyChasseWordings);
} else {
  applyChasseWordings();
}