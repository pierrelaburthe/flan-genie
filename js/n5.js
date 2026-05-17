// ============================================================
// LE FLAN PÂTISSIER — Niveau 5 : Le Génie Gentil
// Niveau INDÉPENDANT — pas d'état partagé avec les autres
// Difficulté moyenne / élevée :
//   - Estime de départ basse (22%) — peut tomber à 0 = défaite
//   - Suspicion 80% = défaite
//   - Pour la fin Victoire, il faut 6+ choix doux ET conserver son estime
//   - Plus de pénalité sur les choix mous
// ============================================================

const refs = {
  dialogueEl: document.getElementById("dialogue"),
  choicesEl: document.getElementById("choices"),
  clocheEl: document.getElementById("cloche"),
  machineEl: document.getElementById("machine"),
  genieEl: document.getElementById("genie"),
  oeugenieEl: document.getElementById("oeugenie"),
  autelEl: document.getElementById("autel"),
  tourBadgeEl: document.getElementById("tour-badge"),
  tricotEl: document.getElementById("tricot-progress"),
  backdropEl: document.getElementById("backdrop"),
  bellWarnEl: document.getElementById("bell-warn"),
};

const extras = { asked_memee: false, revelation: null };
const localState = { the_servi: false };

Engine.init(refs);

const { S, O, D, A } = Engine;
const flashChar = Engine.flashChar;

function goto(fn) {
  Engine.offer([{ tag: "neutre", text: "Continuer", effects: {}, do: fn }]);
}

// Garde-fou estime
function checkEstimeOver() {
  if (Engine.getState().estime <= 0) {
    return finEffondrement();
  }
  return null;
}

// ============================================================
// SCÈNES
// ============================================================

function intro() {
  Engine.getState().tour = 0;
  Engine.setTourBadge("Intro", 0, 8);
  Engine.clearDialogue();
  Engine.play([
    D("Sous-grotte picarde. Lumière jaune œuf. Cliquetis d'aiguilles à tricoter au fond."),
    O("Œugénie est venue chercher du paprika doux. C'est la dernière épice qui manque à sa recette. Elle ne sait pas exactement pourquoi cette recette compte autant pour elle."),
    O("Au fond de la grotte, un Génie tricote. C'est le plus doux des six. Il s'appelle Gérard, mais personne ne le sait. Il garde l'autel sur lequel repose le paprika."),
    D("Mécanique : à 80% de Suspicion, la cloche sonne. À 0% d'Estime, Œugénie ne peut plus parler."),
  ], () => Engine.offer([
    { tag: "neutre", text: "Entrer dans la grotte.", effects: {}, do: tour1 }
  ]));
}

function tour1() {
  Engine.getState().tour = 1;
  Engine.setTourBadge("Tour 1 / 8", 1, 8);
  Engine.clearDialogue();
  Engine.play([
    S("Génie", "(sans lever les yeux) Tiens. Une visiteuse. Posez vos pieds où vous voulez. Le tapis est à tout le monde.", "genie"),
    S("Génie", "Je termine ma rangée et je suis à vous.", "genie"),
    S("Machine", "(sourdine) Mmh.", "machine"),
    S("Œugénie pense", "Il tricote. Il a un peignoir. Il faut que je sois douce. Mais douce comment ?", "oeugenie-pense"),
  ], () => Engine.offer([
    {
      tag: "doux", text: "« C'est joli, ce que vous faites. »",
      effects: { doux: 1, estime: -3, suspicion: -5 },
      do: () => Engine.play([
        S("Génie", "Vous trouvez ? C'est un bonnet. Pour un enfant que je ne connais pas encore.", "genie"),
        S("Génie", "J'aime tricoter pour des inconnus. C'est plus pur.", "genie"),
      ], () => goto(tour2))
    },
    {
      tag: "cruel", text: "« Vous tricotez vite pour quelqu'un qui n'a pas de pouces. »",
      effects: { cruel: 1, estime: 2, suspicion: 20 },
      do: () => Engine.play([
        S("Génie", "(s'arrête une seconde) C'est… c'est une remarque que je vais devoir digérer.", "genie"),
        S("Génie", "Je vais reprendre mon point. Pardon.", "genie"),
      ], () => goto(tour2))
    },
    {
      tag: "neutre", text: "« Bonjour. »",
      effects: { suspicion: 5, estime: -2 },
      do: () => Engine.play([
        S("Génie", "Bonjour. C'est court, mais c'est correct.", "genie"),
      ], () => goto(tour2))
    },
  ]));
}

function tour2() {
  const e = checkEstimeOver(); if (e) return;
  Engine.getState().tour = 2;
  Engine.setTourBadge("Tour 2 / 8", 2, 8);
  Engine.clearDialogue();
  Engine.play([
    S("Génie", "(sans regarder) Vous cherchez quelque chose, ou vous traversez ?", "genie"),
    S("Machine", "(s'allume) Elle cherche. Elle cherche tout le temps. C'est sa principale activité.", "machine"),
    S("Œugénie", "(à la Machine) Tais-toi.", "oeugenie"),
  ], () => Engine.offer([
    {
      tag: "neutre", text: "« Je cherche une recette. Un flan. »",
      effects: { suspicion: 10 },
      do: () => Engine.play([
        S("Génie", "Un flan. (longue pause) Il y a beaucoup de flans, vous savez. Il y a même des flans qui ne sont pas des flans.", "genie"),
      ], () => goto(tour3))
    },
    {
      tag: "doux", text: "« Je traverse. J'admirais votre grotte. »",
      effects: { doux: 1, suspicion: -10, estime: -2 },
      do: () => Engine.play([
        S("Génie", "(sourit) Ma grotte. Personne ne dit jamais « votre grotte ». Vous êtes la première en douze ans.", "genie"),
        S("Génie", "Asseyez-vous. Il y a un coussin à gauche de la marmite.", "genie"),
      ], () => goto(tour3))
    },
    {
      tag: "doux", text: "« Je cherche mon père. »",
      effects: { doux: 1, estime: 3, suspicion: -5 },
      do: () => Engine.play([
        S("Génie", "(pose ses aiguilles) Ah.", "genie"),
        A(() => flashChar(refs.genieEl, "posed", 1200)),
        S("Génie", "C'est une autre catégorie de recherche, ça.", "genie"),
      ], () => goto(tour3))
    },
  ]));
}

function tour3() {
  const e = checkEstimeOver(); if (e) return;
  Engine.getState().tour = 3;
  Engine.setTourBadge("Tour 3 / 8", 3, 8);
  Engine.clearDialogue();
  Engine.play([
    S("Génie", "Vous voulez du thé ? J'ai du thé de bouleau. C'est amer mais c'est franc.", "genie"),
  ], () => Engine.offer([
    {
      tag: "doux", text: "« Volontiers, merci. »",
      effects: { doux: 1, suspicion: -12, estime: -3 },
      do: () => {
        localState.the_servi = true;
        Engine.play([
          S("Génie", "(verse le thé dans une coquille d'œuf) Tenez. C'est chaud par endroits et froid par d'autres.", "genie"),
          S("Machine", "Le thé est une boisson humaine. Œugénie aime les boissons humaines. C'est une de ses qualités.", "machine"),
        ], () => goto(tour4));
      }
    },
    {
      tag: "cruel", text: "« Non merci, je suis pressée. »",
      effects: { cruel: 1, suspicion: 18, estime: 1 },
      do: () => Engine.play([
        S("Génie", "Pressée. (note) C'est rare, ici. Les gens dans une grotte sont rarement pressés. C'est contradictoire.", "genie"),
      ], () => goto(tour4))
    },
    {
      tag: "machine", text: "[Machine] FLATTER — fait croire à une réputation lointaine",
      if: () => Engine.getState().charge > 0,
      effects: { charge: -1, suspicion: -18, doux: 1 },
      do: () => Engine.play([
        S("Machine", "(vibre) Monsieur, votre thé est légendaire. On en parle jusqu'à Pantin. Jusqu'à Pantin.", "machine"),
        S("Génie", "(touché) On en parle à Pantin ? Je n'y suis jamais allé. C'est… c'est très flatteur.", "genie"),
      ], () => goto(tour4))
    },
  ]));
}

function tour4() {
  const e = checkEstimeOver(); if (e) return;
  Engine.getState().tour = 4;
  Engine.setTourBadge("Tour 4 / 8", 4, 8);
  Engine.clearDialogue();
  const intro4 = localState.the_servi
    ? [S("Génie", "(en sirotant) Vous savez, ma mémé faisait du flan. C'est elle qui m'a appris.", "genie")]
    : [
        S("Génie", "Je vais boire mon thé seul. Ma mémé buvait son thé seule pendant quarante ans. C'était une discipline.", "genie"),
      ];
  Engine.play([...intro4, S("Œugénie pense", "Sa mémé. C'est une ouverture. Ne la rate pas.", "oeugenie-pense")],
    () => Engine.offer([
      {
        tag: "doux", text: "« Votre mémé. Elle s'appelait comment ? »",
        effects: { doux: 1, suspicion: -15 },
        do: () => {
          extras.asked_memee = true;
          Engine.play([
            S("Génie", "Huguette. Huguette la Picarde. Elle pondait deux œufs par jour pendant l'Occupation.", "genie"),
            S("Génie", "(œil humide) Vous êtes la deuxième personne à me poser la question. La première, c'était le facteur, en 1998.", "genie"),
          ], () => goto(tour5));
        }
      },
      {
        tag: "cruel", text: "« Les mémés c'est surfait. »",
        effects: { cruel: 1, estime: 3, suspicion: 30 },
        do: () => Engine.play([
          S("Génie", "(long silence) Je crois que je vais finir mon rang en silence.", "genie"),
        ], () => goto(tour5))
      },
      {
        tag: "neutre", text: "« La mienne aussi faisait du flan. »",
        effects: { doux: 1, estime: 1, suspicion: -3 },
        do: () => Engine.play([
          S("Génie", "Ah. (pose ses aiguilles) Les flans des mémés appellent les flans des mémés. C'est une loi qu'on n'écrit pas mais qui existe.", "genie"),
        ], () => goto(tour5))
      },
    ])
  );
}

function tour5() {
  const e = checkEstimeOver(); if (e) return;
  Engine.getState().tour = 5;
  Engine.setTourBadge("Tour 5 / 8", 5, 8);
  Engine.clearDialogue();
  const opener = Engine.getState().suspicion >= 50
    ? [
        S("Génie", "(regarde la cloche au plafond) Vous savez, il y a une cloche, ici. Je l'ai jamais sonnée. Je me demande quel son ça fait.", "genie"),
        O("Doucement. Doucement."),
      ]
    : [S("Génie", "Je vais vous dire un truc. Vous me rappelez quelqu'un. Mais je sais pas qui.", "genie")];

  Engine.play(opener, () => Engine.offer([
    {
      tag: "doux", text: "« Votre tricot est vraiment beau. Vraiment. »",
      effects: { doux: 1, estime: -4, suspicion: -20 },
      do: () => Engine.play([
        S("Génie", "Vous le dites deux fois. Ça veut dire que c'est sincère. Ou que vous voulez quelque chose. Les deux me vont.", "genie"),
      ], () => goto(tour6))
    },
    {
      tag: "neutre", text: "« Parlez-moi du flan. Du vrai. »",
      effects: { suspicion: 15 },
      do: () => Engine.play([
        S("Génie", "Le vrai flan. (sourit) C'est une question d'œuf. Tout est dans l'œuf. Le reste, c'est de la décoration.", "genie"),
      ], () => goto(tour6))
    },
    {
      tag: "machine", text: "[Machine] VÉRITÉ — la Machine dit ce qu'elle pense vraiment",
      if: () => Engine.getState().charge > 0,
      effects: { charge: -2, estime: -10, suspicion: -8 },
      do: () => Engine.play([
        S("Machine", "(grince) Vérité. Vérité. Œugénie pense que ce génie est plus heureux qu'elle. Et elle a raison.", "machine"),
        S("Génie", "(la regarde) C'est… c'est cruel et c'est juste. Vous êtes une machine étrange.", "genie"),
      ], () => goto(tour6))
    },
  ]));
}

function tour6() {
  const e = checkEstimeOver(); if (e) return;
  Engine.getState().tour = 6;
  Engine.setTourBadge("Tour 6 / 8", 6, 8);
  Engine.clearDialogue();
  refs.autelEl.classList.add("visible");
  Engine.play([
    S("Génie", "(range son tricot) Bon. Vous êtes là depuis vingt minutes. Vous n'avez rien volé. Vous n'avez pas crié.", "genie"),
    A(() => flashChar(refs.genieEl, "posed", 1200)),
    S("Génie", "Qu'est-ce que vous voulez vraiment ?", "genie"),
  ], () => Engine.offer([
    {
      tag: "doux", text: "« Du paprika. Du paprika doux. »",
      effects: { doux: 1, suspicion: -5 },
      do: () => Engine.play([
        S("Génie", "(étonné) Du paprika. Voilà une demande honnête. C'est la première de la semaine.", "genie"),
        S("Génie", "Le paprika est sur l'autel. Mais l'autel est fermé. Et la clé est sur moi.", "genie"),
      ], () => goto(tour7))
    },
    {
      tag: "cruel", text: "« La recette du flan de votre mémé. »",
      effects: { suspicion: 30 },
      do: () => Engine.play([
        S("Génie", "(se ferme) Ça, je ne donne pas. Ça se mérite. Ça se transmet. Ça ne se demande pas comme on demande l'heure.", "genie"),
      ], () => goto(tour7))
    },
    {
      tag: "doux", text: "« Je veux retrouver mon père. »",
      effects: { doux: 1, estime: 4, suspicion: -12 },
      do: () => Engine.play([
        S("Génie", "(long silence) Alors vous êtes au bon endroit. Pas pour le retrouver. Mais pour comprendre pourquoi vous le cherchez.", "genie"),
      ], () => goto(tour7))
    },
  ]));
}

function tour7() {
  if (Engine.getState().suspicion >= 80) return echecCloche();
  const e = checkEstimeOver(); if (e) return;
  Engine.getState().tour = 7;
  Engine.setTourBadge("Tour 7 / 8", 7, 8);
  Engine.clearDialogue();
  Engine.play([
    S("Génie", "Je vais vous proposer un marché. Vous me racontez une chose vraie sur vous. Une seule. Et je vous donne ce qu'il y a sur l'autel.", "genie"),
    S("Œugénie pense", "Une chose vraie. Combien j'en ai en stock ? Pas beaucoup.", "oeugenie-pense"),
  ], () => Engine.offer([
    {
      tag: "doux", text: "« J'ai mangé un flan dans le dos de mon copain avec sa coloc, et je n'ai jamais réussi à lui dire. »",
      effects: { doux: 1, estime: -7, suspicion: -30 },
      do: () => {
        extras.revelation = "flan_trahi";
        Engine.play([
          S("Génie", "(hoche la tête) C'est lourd. C'est très lourd. Merci.", "genie"),
          S("Génie", "Ma mémé disait : « Les secrets, c'est comme les œufs, ça pourrit dans le frigo si on les ouvre pas. »", "genie"),
        ], () => goto(tour8));
      }
    },
    {
      tag: "doux", text: "« Je suis malheureuse sans interruption depuis mes douze ans. »",
      effects: { doux: 1, estime: 10, suspicion: -35 },
      do: () => {
        extras.revelation = "douze_ans";
        Engine.play([
          S("Génie", "(pose tout) Douze ans. C'est l'âge où on devient un peu une statue. Je suis désolé.", "genie"),
          S("Génie", "Vous êtes la première personne à me dire ça à voix haute.", "genie"),
        ], () => goto(tour8));
      }
    },
    {
      tag: "cruel", text: "« Je n'aime pas les poules. »",
      effects: { cruel: 1, suspicion: 50 },
      do: () => {
        extras.revelation = "poules";
        Engine.play([
          S("Génie", "(très calme) C'est une chose vraie. Je l'accepte. Mais le marché n'est plus le même.", "genie"),
        ], () => goto(tour8));
      }
    },
  ]));
}

function tour8() {
  Engine.getState().tour = 8;
  Engine.setTourBadge("Tour 8 / 8", 8, 8);
  if (Engine.getState().suspicion >= 80) return echecCloche();
  if (Engine.getState().estime <= 0) return finEffondrement();

  // Conditions plus exigeantes
  const doux = Engine.getState().doux;
  const cruel = Engine.getState().cruel;
  if (doux >= 6 && cruel === 0) return finVictoire();
  if (doux >= 4) return finPartielle();
  return finNeutre();
}

// ============================================================
// FINS
// ============================================================

function endingScreen(cls, title, lines, unlocks) {
  Engine.setTourBadge("Fin", 8, 8);
  Engine.clearDialogue();
  Engine.clearChoices();

  if (cls === "complete" || cls === "partielle") refs.autelEl.classList.add("visible", "glow");

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
    u.innerHTML = "<h4>Conséquences</h4>" + unlocks.map(x => "• " + x).join("<br>");
    wrap.appendChild(u);
  }

  refs.dialogueEl.appendChild(wrap);

  const result_save = Save.recordRun("n5", cls, Engine.getState(), extras);
  if (result_save.unlocked.length) Save.toastUnlocked(result_save.unlocked);

  const rWrap = document.createElement("div");
  rWrap.className = "continue-wrap";
  const r = document.createElement("button");
  r.className = "continue";
  r.textContent = "Rejouer";
  r.onclick = () => location.reload();
  const h = document.createElement("a");
  h.href = "index.html";
  h.className = "continue";
  h.textContent = "Hub";
  h.style.background = "var(--corail)";
  rWrap.appendChild(r);
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
    ["Sourires du Génie", st.s_genie_smiled],
    ["Phrases douces", st.doux],
    ["Phrases cruelles", st.cruel],
    ["Machine utilisée", st.s_machine_used + " fois"],
    ["Charge restante", st.charge + " / 5"],
    ["Estime minimale", Math.round(st.s_estime_min) + " %"],
    ["Suspicion max", Math.round(st.s_suspicion_max) + " %"],
    ["Cloche frôlée", st.s_near_bell ? "oui" : "non"],
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
  const st = Engine.getState();
  const lines = [];
  if (cls === "complete") lines.push("Tu as menti gentiment, beaucoup. Sans jamais blesser. Le Génie t'a crue.");
  else if (cls === "partielle") lines.push("Tu as obtenu ce que tu voulais. Sans plus, sans moins.");
  else if (cls === "neutre") lines.push("Tu n'as pas voulu choisir. Personne ne t'en veut, sauf toi.");
  else if (cls === "effondrement") lines.push("Œugénie s'est tue. Elle est ressortie sans parler à personne. Elle a oublié le paprika.");
  else lines.push("Tu as poussé trop loin. La cloche n'attendait que ça.");

  if (st.s_genie_smiled >= 3) lines.push("Le Génie a souri " + st.s_genie_smiled + " fois — c'est presque indécent dans sa carrière.");
  if (st.s_machine_used === 0) lines.push("Tu n'as jamais branché la Machine. Loulou ne le saura pas, mais il le sentira.");
  if (st.s_near_bell && cls !== "echec") lines.push("La cloche t'a regardée. Tu l'as regardée. Personne n'a parlé.");
  if (extras.revelation === "douze_ans") lines.push("« Je suis malheureuse depuis mes douze ans. » Gérard a noté la phrase.");
  return lines.join(" ");
}

function finVictoire() {
  endingScreen("complete", "Le paprika doux",
    [
      { cls: "genie", speaker: "Génie", text: "(ouvre l'autel) Tenez. Le paprika doux. Et puis tant qu'à faire, la graine de fenouil. Pour la route." },
      { cls: "genie", speaker: "Génie", text: "Vous reviendrez ? Personne ne revient jamais. Mais on a le droit d'espérer." },
      { text: "Œugénie est sortie de la grotte à 14h47. Elle avait le paprika dans son sac. Elle n'avait plus aucune estime d'elle-même." },
    ],
    [
      "Chemin emprunté : tu as charmé le Génie sans jamais le blesser.",
      "Ingrédients récupérés : paprika doux, fenouil.",
    ]
  );
}

function finPartielle() {
  endingScreen("partielle", "Le paprika seul",
    [
      { cls: "genie", speaker: "Génie", text: "(ouvre l'autel à moitié) Tenez. Le paprika. C'est ce que vous étiez venue chercher." },
      { cls: "genie", speaker: "Génie", text: "Je garde le reste. C'est pas de la méchanceté. C'est de la prudence." },
      { text: "Œugénie est sortie avec ce qu'elle voulait. Sans plus, sans moins. C'est rare et ça ne se raconte pas." },
    ],
    [ "Chemin emprunté : tu as obtenu l'essentiel, sans bonus." ]
  );
}

function finNeutre() {
  endingScreen("neutre", "Autel vide",
    [
      { cls: "genie", speaker: "Génie", text: "Je crois qu'on s'est tout dit. Vous pouvez prendre ce qu'il y a sur l'autel. Il n'est plus fermé." },
      { cls: "oeugenie", speaker: "Œugénie", text: "(ouvre l'autel) … Il est vide." },
      { cls: "genie", speaker: "Génie", text: "Ah. Tiens. C'est ennuyeux." },
      { text: "Œugénie est ressortie sans paprika. Elle a regardé par la fenêtre du car." },
    ],
    [ "Chemin emprunté : trop peu de douceur, trop de neutralité." ]
  );
}

function finEffondrement() {
  Engine.clearDialogue();
  Engine.clearChoices();
  refs.backdropEl.classList.add("darken");
  AudioFX.thud();
  endingScreen("echec", "L'effondrement",
    [
      { cls: "didascalie", text: "Œugénie s'est tue au milieu d'une phrase. Elle n'a pas su comment finir." },
      { cls: "genie", speaker: "Génie", text: "(la regarde longtemps) … Vous voulez vous asseoir ?" },
      { text: "Œugénie a tourné les talons. Elle a pris le car de 13h. Elle a regardé par la fenêtre pendant tout le trajet." },
    ],
    [ "Mécanique : ton estime est tombée à zéro." ]
  );
}

function echecCloche() {
  refs.clocheEl.classList.add("ringing");
  refs.backdropEl.classList.add("darken", "shake");
  AudioFX.ding();
  setTimeout(() => refs.backdropEl.classList.remove("shake"), 500);
  endingScreen("echec", "La cloche a sonné",
    [
      { cls: "didascalie", text: "SFX : cloche, quatre notes de Pennsylvania Polka. L'ombre du Coq géant s'étire sur le mur." },
      { cls: "genie", speaker: "Génie", text: "(sans malice) Je suis désolé. La cloche s'est sonnée toute seule." },
      { text: "Œugénie n'a pas vu le Coq arriver. Elle a juste entendu un battement d'aile. Puis le noir." },
    ],
    [ "Mécanique : la suspicion a dépassé 80%." ]
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
