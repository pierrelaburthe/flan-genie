// ============================================================
// LE FLAN PÂTISSIER — Niveau 2 : Le Flan Anonyme
// Niveau INDÉPENDANT — pas d'état partagé avec les autres
// VICTOIRE : réveiller Jean-Nathan ET partager le flan (doux suffisant)
// DÉFAITE : manger le second flan avec Laure-Yann (légende) OU se faire surprendre
// ============================================================

const refs = {
  dialogueEl: document.getElementById("dialogue"),
  choicesEl: document.getElementById("choices"),
  clocheEl: document.getElementById("cloche"),
  machineEl: document.getElementById("machine"),
  genieEl: document.getElementById("genie"),       // = Jean-Nathan endormi
  oeugenieEl: document.getElementById("oeugenie"),
  autelEl: document.getElementById("autel"),       // = boîte du flan
  tourBadgeEl: document.getElementById("tour-badge"),
  tricotEl: document.getElementById("tricot-progress"),
  backdropEl: document.getElementById("backdrop"),
  bellWarnEl: document.getElementById("bell-warn"),
};

const extras = { ate_flan: false, woke_jeannathan: false, told_truth: false };

Engine.init(refs, {
  initialState: { estime: 35, suspicion: 0, charge: 2 },
  suspicionThreshold: 50,
  effectLabels: {
    charge: { icon: "🥧", label: "Flans" },
    suspicion: { icon: "👁", label: "Tension" },
    estime: { icon: "❤", label: "Estime" },
  },
});

const { S, O, D, A } = Engine;
const flashChar = Engine.flashChar;

function goto(fn) {
  Engine.offer([{ tag: "neutre", text: "Continuer", effects: {}, do: fn }]);
}

function checkSurprise() {
  if (Engine.getState().suspicion >= 70) return finSurprise();
  if (Engine.getState().estime <= 0) return finEffondrement();
  return null;
}

// ============================================================
// SCÈNES
// ============================================================

function intro() {
  Engine.getState().tour = 0;
  Engine.setTourBadge("Intro", 0, 5);
  Engine.clearDialogue();
  refs.autelEl.classList.add("visible");
  Engine.play([
    D("Appartement parisien. 22h. Lumière jaune du couloir."),
    O("Œugénie rentre des courses. Devant la porte de l'appartement : une boîte. Sans nom. Sans mot. Juste une ficelle blanche."),
    O("À l'intérieur, deux flans pâtissiers. Encore tièdes."),
    O("Jean-Nathan, son copain depuis sept ans, dort sur le canapé. Le bloc de marbre qu'il devait sculpter est toujours intact."),
    O("Laure-Yann, leur colocataire, se vernit les ongles. Vernis vert fougère. Elle regarde la boîte avec une attention nouvelle."),
    D("Légende picarde : manger le second flan sans son aimé condamnerait le couple à un attachement sans passion. Personne ne sait si c'est vrai."),
    D("Mécanique : la Tension dans la pièce monte avec Laure-Yann. À 70%, Jean-Nathan se réveille et la soirée bascule."),
  ], () => Engine.offer([
    { tag: "neutre", text: "Entrer dans la cuisine.", effects: {}, do: tour1 }
  ]));
}

function tour1() {
  Engine.getState().tour = 1;
  Engine.setTourBadge("Tour 1 / 5", 1, 5);
  Engine.clearDialogue();
  Engine.play([
    S("Laure-Yann", "(sans lever les yeux) Y'a une boîte. J'ai pas ouvert. J'attendais.", "machine"),
    S("Laure-Yann", "C'est qui ?", "machine"),
    S("Œugénie pense", "Personne ne m'envoie de flan. Personne.", "oeugenie-pense"),
  ], () => Engine.offer([
    {
      tag: "doux", text: "« Je vais réveiller Jean-Nathan. On l'ouvre tous les trois. »",
      effects: { doux: 2, estime: 4, suspicion: 10 },
      do: () => {
        Engine.play([
          S("Œugénie", "Jean-Nathan ? Mon amour ?", "oeugenie"),
          S("Laure-Yann", "Laisse-le. Il rêve qu'il commence sa sculpture.", "machine"),
          S("Œugénie pense", "Elle a peut-être raison.", "oeugenie-pense"),
        ], () => goto(tour2));
      }
    },
    {
      tag: "neutre", text: "« On regarde juste. On ne touche pas. »",
      effects: { suspicion: 12, estime: -2 },
      do: () => Engine.play([
        S("Laure-Yann", "(soulève le couvercle) Deux. Deux flans.", "machine"),
        S("Œugénie", "Pas de message.", "oeugenie"),
      ], () => goto(tour2))
    },
    {
      tag: "cruel", text: "« On les mange. Maintenant. À deux. »",
      effects: { cruel: 1, estime: 6, suspicion: 35 },
      do: () => Engine.play([
        S("Laure-Yann", "(sourit) T'es sérieuse ?", "machine"),
        S("Œugénie", "Je suis fatiguée d'être sérieuse.", "oeugenie"),
        A(() => flashChar(refs.oeugenieEl, "embarrassed", 1200)),
      ], () => goto(tour2))
    },
  ]));
}

function tour2() {
  const e = checkSurprise(); if (e) return;
  Engine.getState().tour = 2;
  Engine.setTourBadge("Tour 2 / 5", 2, 5);
  Engine.clearDialogue();
  Engine.play([
    D("La boîte est ouverte. Deux flans. Brillants. L'odeur de sucre brûlé monte."),
    S("Laure-Yann", "Y'a un livre dans la bibliothèque. « Contes et Légendes du Pays Picard ». Page 178.", "machine"),
    S("Laure-Yann", "Histoire de deux flans. Le premier crée le besoin. Le second, la passion.", "machine"),
    S("Œugénie pense", "Elle a lu ça quand ?", "oeugenie-pense"),
  ], () => Engine.offer([
    {
      tag: "doux", text: "« C'est une légende. On range les flans au frigo. »",
      effects: { doux: 1, suspicion: -12, estime: -2 },
      do: () => Engine.play([
        S("Laure-Yann", "(tourne la page) Tu es sûre ?", "machine"),
        S("Œugénie pense", "Non.", "oeugenie-pense"),
      ], () => goto(tour3))
    },
    {
      tag: "cruel", text: "« Je veux savoir si c'est vrai. Continue. »",
      effects: { cruel: 1, estime: 5, suspicion: 20 },
      do: () => Engine.play([
        S("Laure-Yann", "Bien. Faut les manger dans l'ordre. Le premier crée le besoin. Le deuxième, la passion.", "machine"),
      ], () => goto(tour3))
    },
    {
      tag: "coloc", text: "[Laure-Yann] « Tu lis quoi exactement ? »",
      effects: { suspicion: -3, charge: 0 },
      do: () => Engine.play([
        S("Laure-Yann", "« Au village de Sains-Richaumont, deux génies des œufs envoient des flans aux jeunes couples. Le second flan, mangé ailleurs qu'avec l'aimé, condamne l'âme à un attachement sans passion. »", "machine"),
        S("Œugénie pense", "Un attachement sans passion. Ça me dit quelque chose.", "oeugenie-pense"),
      ], () => goto(tour3))
    },
  ]));
}

function tour3() {
  const e = checkSurprise(); if (e) return;
  Engine.getState().tour = 3;
  Engine.setTourBadge("Tour 3 / 5", 3, 5);
  Engine.clearDialogue();
  Engine.play([
    S("Laure-Yann", "(regarde Jean-Nathan dormir) Il ronfle d'une manière satisfaite.", "machine"),
    S("Laure-Yann", "Je peux te dire un truc ? Je n'ai jamais aimé personne avec passion. J'aimerais essayer une fois.", "machine"),
    S("Œugénie pense", "Elle me regarde en disant ça. C'est pas un hasard.", "oeugenie-pense"),
  ], () => Engine.offer([
    {
      tag: "cruel", text: "« On le mange. Toi et moi. Maintenant. »",
      effects: { cruel: 1, estime: 10, suspicion: 40, charge: -1 },
      do: () => {
        extras.ate_flan = true;
        Engine.play([
          A(() => flashChar(refs.oeugenieEl, "embarrassed", 1500)),
          S("Laure-Yann", "(coupe le second flan en deux) Tiens.", "machine"),
          S("Œugénie", "(mord) … C'est sucré. Trop sucré.", "oeugenie"),
          S("Laure-Yann", "(les yeux fermés) Voilà.", "machine"),
          D("Jean-Nathan remue. Pas tout à fait. Presque."),
        ], () => goto(tour4));
      }
    },
    {
      tag: "doux", text: "« Tu devrais aller te coucher, Laure-Yann. »",
      effects: { doux: 1, suspicion: -20, estime: -5 },
      do: () => Engine.play([
        S("Laure-Yann", "(referme le livre) D'accord.", "machine"),
        S("Laure-Yann", "(en partant) Mais le flan, il sera plus là demain.", "machine"),
        S("Œugénie pense", "Pourquoi est-ce que je suis triste ?", "oeugenie-pense"),
      ], () => goto(tour4))
    },
    {
      tag: "doux", text: "Réveiller Jean-Nathan.",
      effects: { doux: 3, suspicion: -40, estime: 8 },
      do: () => {
        extras.woke_jeannathan = true;
        Engine.play([
          S("Œugénie", "(secoue) Mon amour ? Y'a un flan. Y'a deux flans. Pour nous.", "oeugenie"),
          S("Jean-Nathan", "(brumeux) Un flan ? Pour nous ?", "genie"),
          A(() => flashChar(refs.genieEl, "smiling", 1500)),
          S("Jean-Nathan", "C'est gentil. Qui l'envoie ?", "genie"),
          S("Œugénie", "Je sais pas. On s'en fiche. Mange.", "oeugenie"),
        ], () => goto(tour4));
      }
    },
  ]));
}

function tour4() {
  const e = checkSurprise(); if (e) return;
  Engine.getState().tour = 4;
  Engine.setTourBadge("Tour 4 / 5", 4, 5);
  Engine.clearDialogue();

  if (extras.woke_jeannathan) {
    return Engine.play([
      D("Jean-Nathan assis sur le canapé. Cheveux en bataille. Il tient le flan à deux mains comme un trophée."),
      S("Jean-Nathan", "Vous avez vu, le bloc de marbre, il a l'air plus petit ce soir.", "genie"),
      S("Œugénie", "Tu veux commencer ?", "oeugenie"),
      S("Jean-Nathan", "(longue pause) Peut-être. Demain. Peut-être.", "genie"),
    ], () => Engine.offer([
      {
        tag: "doux", text: "« Mange ton flan. Pas demain. Ce soir. »",
        effects: { doux: 2, estime: 6, charge: -2 },
        do: () => Engine.play([
          S("Jean-Nathan", "(mord) Hm. Hm.", "genie"),
          S("Jean-Nathan", "Le meilleur flan que j'aie mangé depuis que je te connais.", "genie"),
          A(() => flashChar(refs.genieEl, "smiling", 1500)),
        ], () => goto(tour5))
      },
      {
        tag: "neutre", text: "« Demain, oui. »",
        effects: { estime: -3 },
        do: () => Engine.play([
          S("Jean-Nathan", "(repose le flan) Merci. Tu es bien.", "genie"),
        ], () => goto(tour5))
      },
    ]));
  }

  if (extras.ate_flan) {
    return Engine.play([
      D("Laure-Yann a refermé la boîte. Elle finit son vernis."),
      S("Laure-Yann", "(à voix basse) On en parle pas. À personne.", "machine"),
      S("Œugénie pense", "J'ai déjà oublié le goût. C'est terrifiant.", "oeugenie-pense"),
      D("Jean-Nathan ouvre un œil. Le referme."),
    ], () => Engine.offer([
      {
        tag: "doux", text: "« Pardon. Je vais te le dire. »",
        effects: { doux: 2, estime: -8, suspicion: -25 },
        do: () => {
          extras.told_truth = true;
          Engine.play([
            S("Œugénie", "Jean-Nathan ? J'ai mangé un flan. Avec Laure-Yann. Pendant que tu dormais.", "oeugenie"),
            S("Jean-Nathan", "(les yeux fermés) Ah. C'est bien.", "genie"),
            S("Œugénie pense", "Il dort. Il a dit ça en dormant.", "oeugenie-pense"),
          ], () => goto(tour5));
        }
      },
      {
        tag: "cruel", text: "« Demain je le dirai. Demain. »",
        effects: { cruel: 1, suspicion: 20, estime: 2 },
        do: () => Engine.play([
          S("Œugénie pense", "Demain. Demain. Demain.", "oeugenie-pense"),
        ], () => goto(tour5))
      },
    ]));
  }

  // ni mangé ni réveillé
  return Engine.play([
    D("Œugénie referme la boîte. La range dans le frigo."),
    S("Laure-Yann", "(sans regarder) Tu es bizarre, ce soir.", "machine"),
    D("Jean-Nathan dort toujours. Le flan attend dans le frigo. Encore tiède."),
  ], () => Engine.offer([
    { tag: "neutre", text: "Aller se coucher.", effects: { estime: -5 }, do: tour5 }
  ]));
}

function tour5() {
  const e = checkSurprise(); if (e) return;
  Engine.getState().tour = 5;
  Engine.setTourBadge("Tour 5 / 5", 5, 5);

  const doux = Engine.getState().doux;

  if (extras.woke_jeannathan && doux >= 5) return finCouple();
  if (extras.woke_jeannathan) return finCoupleFatigue();
  if (extras.ate_flan && extras.told_truth) return finAveu();
  if (extras.ate_flan) return finDesir();
  return finReporte();
}

// ============================================================
// FINS
// ============================================================

function endingScreen(cls, title, lines, unlocks) {
  Engine.setTourBadge("Fin", 5, 5);
  Engine.clearDialogue();
  Engine.clearChoices();

  const wrap = document.createElement("div");
  wrap.className = "ending " + cls;

  const badge = document.createElement("div");
  badge.className = "result-badge";
  badge.textContent = "Fin atteinte";
  wrap.appendChild(badge);

  const t = document.createElement("div");
  t.className = "ending-title";
  t.textContent = title;
  wrap.appendChild(t);

  const body = document.createElement("div");
  body.className = "ending-body";
  lines.forEach(l => {
    const p = document.createElement("p");
    p.className = "line " + (l.cls || "oracle");
    if (l.speaker) {
      const s = document.createElement("span");
      s.className = "speaker";
      s.textContent = l.speaker;
      p.appendChild(s);
      p.appendChild(document.createTextNode(" " + l.text));
    } else {
      p.textContent = l.text;
    }
    body.appendChild(p);
  });
  wrap.appendChild(body);
  wrap.appendChild(buildDebrief(cls));

  if (unlocks && unlocks.length) {
    const u = document.createElement("div");
    u.className = "unlocks";
    u.innerHTML = "<h4>Indices</h4>" + unlocks.map(x => "• " + x).join("<br>");
    wrap.appendChild(u);
  }

  refs.dialogueEl.appendChild(wrap);

  const r = Save.recordRun("n2", cls, Engine.getState(), extras);
  if (r.unlocked.length) Save.toastUnlocked(r.unlocked);

  const rWrap = document.createElement("div");
  rWrap.className = "continue-wrap";
  const r1 = document.createElement("button");
  r1.className = "continue";
  r1.textContent = "Rejouer";
  r1.onclick = () => location.reload();
  const h = document.createElement("a");
  h.href = "index.html";
  h.className = "continue";
  h.textContent = "Hub";
  h.style.background = "var(--corail)";
  rWrap.appendChild(r1);
  rWrap.appendChild(h);
  refs.choicesEl.appendChild(rWrap);
}

function buildDebrief(cls) {
  const st = Engine.getState();
  const wrap = document.createElement("div");
  wrap.className = "debrief";
  wrap.innerHTML = "<h3>Débrief — fortune cookie</h3>";

  const stats = document.createElement("div");
  stats.className = "debrief-stats";
  const items = [
    ["Phrases douces", st.doux],
    ["Phrases cruelles", st.cruel],
    ["Flans restants", st.charge + " / 2"],
    ["Tension max", Math.round(st.s_suspicion_max) + " %"],
    ["Estime minimale", Math.round(st.s_estime_min) + " %"],
    ["Flan trahi", extras.ate_flan ? "oui" : "non"],
  ];
  items.forEach(([k, v]) => {
    const d = document.createElement("div");
    d.className = "debrief-stat";
    d.innerHTML = `<strong>${k}</strong><span>${v}</span>`;
    stats.appendChild(d);
  });
  wrap.appendChild(stats);

  const narr = document.createElement("div");
  narr.className = "debrief-narrative";
  narr.textContent = narrativeFor(cls);
  wrap.appendChild(narr);
  return wrap;
}

function narrativeFor(cls) {
  // cls = couleur de fin (complete/partielle/echec/neutre) — narrative dépend du title réel
  // On utilise extras pour décider
  if (extras.woke_jeannathan) {
    if (Engine.getState().doux >= 5) return "Tu as choisi de réveiller Jean-Nathan. Vous avez mangé le flan ensemble. Le marbre, dans le salon, a brillé une seconde.";
    return "Vous avez partagé le flan, mais sans la chaleur qu'il aurait fallu. Jean-Nathan l'a senti sans le dire.";
  }
  if (extras.ate_flan && extras.told_truth) return "Tu as mangé avec Laure-Yann, puis tu as parlé. Jean-Nathan dormait. Quelque chose a été dit quand même.";
  if (extras.ate_flan) return "Tu as suivi le désir, pas la légende. Quinze ans avec Jean-Nathan, sans passion mais avec attachement. C'est une vie comme une autre.";
  if (cls === "echec" && Engine.getState().s_suspicion_max >= 70) return "Jean-Nathan s'est réveillé au mauvais moment. Il a vu, il a compris.";
  if (cls === "echec") return "Œugénie s'est couchée par terre dans le couloir. La boîte est restée ouverte sur la table.";
  return "Le flan attend dans le frigo. Tu n'as pas choisi. C'est aussi un choix.";
}

function finCouple() {
  endingScreen("complete", "Le couple",
    [
      { cls: "genie", speaker: "Jean-Nathan", text: "(la bouche pleine) C'est qui qui l'a envoyé ?" },
      { cls: "oeugenie", speaker: "Œugénie", text: "Personne. Mange." },
      { cls: "genie", speaker: "Jean-Nathan", text: "C'est très bon." },
      { text: "Laure-Yann est partie sans dire au revoir. Le couple a fini son flan en silence. Le marbre, dans le salon, a brillé une seconde." },
    ],
    [ "Chemin emprunté : tu as réveillé Jean-Nathan tôt et tu es restée douce." ]
  );
}

function finCoupleFatigue() {
  endingScreen("partielle", "Le couple fatigué",
    [
      { cls: "genie", speaker: "Jean-Nathan", text: "(en mangeant) Tu vas bien ?" },
      { cls: "oeugenie", speaker: "Œugénie", text: "Oui. Oui oui." },
      { text: "Le flan a été partagé. Mais Œugénie n'y croyait pas vraiment. Jean-Nathan l'a senti sans le dire. Le marbre est resté éteint." },
    ],
    [ "Chemin emprunté : tu as réveillé Jean-Nathan, mais avec peu de tendresse." ]
  );
}

function finAveu() {
  endingScreen("partielle", "L'aveu en dormant",
    [
      { cls: "oeugenie", speaker: "Œugénie", text: "J'ai dit. Il a entendu. Pas vraiment. Mais un peu." },
      { text: "Le secret a été lâché à un homme qui dormait. Il ne sait pas. Mais il sait, quelque part. Quinze ans plus tard, il s'en souviendra." },
    ],
    [ "Chemin emprunté : tu as mangé le second flan avec Laure-Yann, puis tu as confessé." ]
  );
}

function finDesir() {
  endingScreen("echec", "Le désir partagé",
    [
      { cls: "machine", speaker: "Laure-Yann", text: "(les yeux fermés) Voilà." },
      { text: "Tu as mangé le second flan avec Laure-Yann. Tu as rempli les conditions exactes de la légende picarde." },
      { text: "Selon la légende, le sort des deux flans s'est enclenché : attachement avec Jean-Nathan, oui — passion, jamais. Pendant les quinze prochaines années, ils visiteront 730 flanteries sans retrouver celui-là. Personne ne sait si c'est une malédiction ou une vie ordinaire." },
    ],
    [ "Chemin emprunté : tu as suivi le désir, pas la prudence. Tu n'as pas dit." ]
  );
}

function finReporte() {
  endingScreen("neutre", "Dans le frigo",
    [
      { text: "Œugénie a éteint la lumière. Le flan attend dans le frigo. Personne ne sait quand elle le mangera. Elle non plus." },
      { cls: "didascalie", text: "(Le lendemain matin, la boîte est vide. Personne ne demande rien.)" },
    ],
    [ "Chemin emprunté : tu n'as pas tranché." ]
  );
}

function finSurprise() {
  refs.bellWarnEl.classList.add("warn");
  AudioFX.ding();
  endingScreen("echec", "Jean-Nathan s'est réveillé",
    [
      { cls: "didascalie", text: "Bruit du canapé. Toux. Lumière qui s'allume." },
      { cls: "genie", speaker: "Jean-Nathan", text: "(les yeux ouverts) Qu'est-ce que vous faites ?" },
      { text: "Il vous a vues. Toutes les deux. Avec la boîte ouverte. Il a tout compris en deux secondes. Le couple s'est terminé dans ces deux secondes-là." },
    ],
    [ "Mécanique : la tension dans la pièce a dépassé 70%." ]
  );
}

function finEffondrement() {
  refs.backdropEl.classList.add("darken");
  AudioFX.thud();
  endingScreen("echec", "L'effondrement",
    [
      { cls: "didascalie", text: "Œugénie s'est laissée glisser le long du frigo. Elle n'a pas trouvé de mots." },
      { text: "Elle s'est endormie dans le couloir. Personne ne l'a vue avant 6h du matin." },
    ],
    [ "Mécanique : ton estime est tombée à zéro." ]
  );
}

// ============================================================
// CONTRÔLES
// ============================================================

document.getElementById("restart").onclick = () => location.reload();

const soundBtn = document.getElementById("sound-toggle");
soundBtn.onclick = () => {
  const m = !AudioFX.isMuted();
  AudioFX.setMuted(m);
  soundBtn.textContent = m ? "🔇" : "🔊";
  soundBtn.classList.toggle("muted", m);
};

const voiceBtn = document.getElementById("voice-toggle");
voiceBtn.onclick = () => {
  const m = !OracleVoice.isEnabled();
  OracleVoice.setEnabled(m);
  voiceBtn.textContent = m ? "🗣" : "🔇";
  voiceBtn.classList.toggle("muted", !m);
};

let audioPrimed = false;
function primeAudio() {
  if (audioPrimed) return;
  audioPrimed = true;
  AudioFX.init();
  AudioFX.startAmbiance();
  OracleVoice.init();
}
document.body.addEventListener("click", primeAudio);

intro();
