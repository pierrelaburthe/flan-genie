// ============================================================
// Save — persistance localStorage + achievements
// ============================================================

const Save = (() => {
  const KEY = "flan-genie:v1";

  const DEFAULT = {
    runs: 0,
    endings: {},       // { "n5:complete": 1, "n5:partielle": 2, ... }
    achievements: {},  // { "first_step": true, ... }
    flags: {},         // état persistant (genie_remembers_oeugenie, machine_grilled)
    history: [],       // dernières 20 runs (n, ending, doux, cruel, charge, date)
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT);
      return Object.assign(structuredClone(DEFAULT), JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULT);
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { console.warn("save failed", e); }
  }

  function reset() { localStorage.removeItem(KEY); }

  // -------- Niveaux jouables --------
  // Le hub utilise ceci pour savoir quelles cases activer
  const PLAYABLE = new Set(["n2", "n5"]);
  function isPlayable(id) { return PLAYABLE.has(id); }

  // -------- Achievements --------
  const ACHIEVEMENTS = [
    {
      id: "first_step",
      label: "Premier pas",
      desc: "Terminer une run, quelle qu'elle soit.",
    },
    {
      id: "facteur_1998",
      label: "Le facteur de 1998",
      desc: "Poser la question du prénom de la mémé.",
    },
    {
      id: "sans_machine",
      label: "Sans Machine",
      desc: "Finir le niveau 5 sans utiliser la Machine.",
    },
    {
      id: "sans_cruel",
      label: "Sans cruauté",
      desc: "Finir le niveau 5 sans aucun choix cruel.",
    },
    {
      id: "cloche_frolee",
      label: "Cloche frôlée",
      desc: "Faire trembler la cloche sans la faire sonner.",
    },
    {
      id: "succes_complet",
      label: "Le vrai flan",
      desc: "Obtenir la fin Succès complet du niveau 5.",
    },
    {
      id: "saboteuse",
      label: "Saboteuse",
      desc: "Faire sonner la cloche.",
    },
    {
      id: "trois_fins",
      label: "Collectionneuse",
      desc: "Découvrir 3 fins différentes du niveau 5.",
    },
    {
      id: "huguette",
      label: "Huguette la Picarde",
      desc: "Apprendre le prénom de la mémé du Génie.",
    },
    {
      id: "recidiviste",
      label: "Récidiviste",
      desc: "Jouer 5 runs.",
    },
    {
      id: "trahison_flan",
      label: "Le flan partagé",
      desc: "Niveau 2 : manger le 2ᵉ flan avec Laure-Yann pendant que Jean-Nathan dort.",
    },
    {
      id: "honnete",
      label: "L'honnête",
      desc: "Niveau 2 : refuser le flan et réveiller Jean-Nathan.",
    },
  ];

  function unlock(data, id) {
    if (data.achievements[id]) return false;
    data.achievements[id] = { unlockedAt: Date.now() };
    return true;
  }

  function check(data, runCtx) {
    // runCtx: { level, ending, state, extras }
    const unlocked = [];
    const u = (id) => { if (unlock(data, id)) unlocked.push(id); };

    u("first_step");
    if (runCtx.level === "n5") {
      if (runCtx.ending === "complete") u("succes_complet");
      if (runCtx.ending === "echec") u("saboteuse");
      if (runCtx.state.s_machine_used === 0 && runCtx.ending !== "echec") u("sans_machine");
      if (runCtx.state.cruel === 0 && runCtx.ending !== "echec") u("sans_cruel");
      if (runCtx.state.s_near_bell && runCtx.ending !== "echec") u("cloche_frolee");
      if (runCtx.extras && runCtx.extras.asked_memee) {
        u("facteur_1998");
        u("huguette");
      }
      const fins = data.endings;
      const distinctN5 = ["complete", "partielle", "neutre", "echec"].filter(e => fins["n5:" + e]).length;
      if (distinctN5 >= 3) u("trois_fins");
    }
    if (runCtx.level === "n2") {
      if (runCtx.extras && runCtx.extras.ate_flan) u("trahison_flan");
      if (runCtx.extras && runCtx.extras.woke_jeannathan) u("honnete");
    }
    if (data.runs >= 5) u("recidiviste");

    return unlocked;
  }

  function recordRun(level, ending, state, extras = {}) {
    const data = load();
    data.runs += 1;
    const key = level + ":" + ending;
    data.endings[key] = (data.endings[key] || 0) + 1;
    data.history.unshift({
      level, ending,
      doux: state.doux, cruel: state.cruel,
      estime_min: Math.round(state.s_estime_min),
      suspicion_max: Math.round(state.s_suspicion_max),
      charge_left: state.charge,
      genie_smiles: state.s_genie_smiled,
      date: Date.now(),
    });
    data.history = data.history.slice(0, 20);

    // flags persistants
    if (level === "n5") {
      data.flags.genie_met_oeugenie = (data.flags.genie_met_oeugenie || 0) + 1;
      if (state.charge === 0) data.flags.machine_grilled = true;
    }
    if (level === "n2") {
      if (extras.ate_flan) data.flags.ate_second_flan = true;
      if (extras.woke_jeannathan) data.flags.honest_at_n2 = true;
    }

    const unlocked = check(data, { level, ending, state, extras });
    save(data);
    return { data, unlocked };
  }

  function getFlags() { return load().flags; }
  function getEndings() { return load().endings; }
  function getAchievements() {
    const data = load();
    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: !!data.achievements[a.id] }));
  }
  function summary() {
    const data = load();
    return {
      runs: data.runs,
      endings_count: Object.keys(data.endings).length,
      achievements_unlocked: Object.keys(data.achievements).length,
      achievements_total: ACHIEVEMENTS.length,
      flags: data.flags,
      history: data.history,
    };
  }

  // Toast pour annoncer un achievement débloqué
  function toastUnlocked(ids) {
    if (!ids || !ids.length) return;
    const wrap = document.createElement("div");
    wrap.className = "achievement-toasts";
    document.body.appendChild(wrap);
    ids.forEach((id, i) => {
      const meta = ACHIEVEMENTS.find(a => a.id === id);
      if (!meta) return;
      const t = document.createElement("div");
      t.className = "ach-toast";
      t.innerHTML = `<div class="ach-toast-head">🏆 Trophée débloqué</div><div class="ach-toast-title">${meta.label}</div><div class="ach-toast-desc">${meta.desc}</div>`;
      wrap.appendChild(t);
      setTimeout(() => t.classList.add("show"), 100 + i * 200);
      setTimeout(() => t.classList.remove("show"), 4500 + i * 200);
      setTimeout(() => t.remove(), 5200 + i * 200);
    });
    setTimeout(() => wrap.remove(), 6500 + ids.length * 200);
  }

  return {
    load, save, reset,
    recordRun, getFlags, getEndings, getAchievements,
    summary, isPlayable, ACHIEVEMENTS,
    toastUnlocked,
  };
})();
