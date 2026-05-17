// ============================================================
// Engine — runner partagé entre tous les niveaux
// Expose : Engine.init(refs), Engine.play, Engine.offer, Engine.delta,
//          Engine.helpers S/O/D/W/A, Engine.flashChar
// ============================================================

const Engine = (() => {
  const state = {
    estime: 22,
    suspicion: 0,
    charge: 5,
    doux: 0,
    cruel: 0,
    tour: 0,
    extras: {},
    s_machine_used: 0,
    s_estime_min: 22,
    s_suspicion_max: 0,
    s_genie_smiled: 0,
    s_near_bell: false,
    s_choices: [], // log de tous les tags choisis
  };

  let refs = {};
  let queue = [];
  let typing = false;
  let skipRequested = false;
  let onSceneEnd = null;
  let suspicionThreshold = 60; // déclenchement bell-warn

  // Labels personnalisables par niveau pour les prévisualisations de choix
  let effectLabels = {
    estime:    { icon: "❤", label: "Estime" },
    suspicion: { icon: "👁", label: "Suspicion" },
    charge:    { icon: "⚡", label: "Machine" },
  };

  function init(r, opts = {}) {
    refs = r;
    if (opts.initialState) Object.assign(state, opts.initialState);
    if (opts.suspicionThreshold !== undefined) suspicionThreshold = opts.suspicionThreshold;
    if (opts.effectLabels) Object.assign(effectLabels, opts.effectLabels);
    refs.dialogueEl.onclick = () => { if (typing) skipRequested = true; };
    updateHUD();
  }

  function getState() { return state; }

  // ---------- HUD ----------
  function updateHUD(pulses) {
    if (!refs.dialogueEl) return;
    const fE = document.getElementById("fill-estime");
    const fS = document.getElementById("fill-suspicion");
    const vE = document.getElementById("val-estime");
    const vS = document.getElementById("val-suspicion");
    const dC = document.getElementById("dots-charge");

    if (fE) {
      fE.style.width = Math.max(0, Math.min(100, state.estime)) + "%";
      vE.textContent = Math.round(state.estime) + "%";
      if (state.estime < 10) fE.style.background = "var(--corail)";
      else if (state.estime < 30) fE.style.background = "var(--jaune)";
      else fE.style.background = "var(--fougere)";
    }
    if (fS) {
      fS.style.width = Math.max(0, Math.min(100, state.suspicion)) + "%";
      vS.textContent = Math.round(state.suspicion) + "%";
    }
    if (refs.bellWarnEl && refs.clocheEl) {
      if (state.suspicion >= suspicionThreshold) {
        refs.clocheEl.classList.add("ringing");
        refs.bellWarnEl.classList.add("warn");
        state.s_near_bell = true;
      } else {
        refs.clocheEl.classList.remove("ringing");
        refs.bellWarnEl.classList.remove("warn");
      }
    }
    if (dC) {
      dC.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        const d = document.createElement("div");
        d.className = "dot";
        if (i >= state.charge) d.classList.add(state.charge === 0 ? "dead" : "spent");
        dC.appendChild(d);
      }
      if (refs.machineEl) {
        if (state.charge === 0) refs.machineEl.classList.add("dead");
        else refs.machineEl.classList.remove("dead");
      }
    }
    if (pulses) {
      pulses.forEach(p => {
        const g = document.querySelectorAll(".gauge")[p.idx];
        if (!g) return;
        g.classList.add(p.dir === "up" ? "pulse-up" : "pulse-down");
        setTimeout(() => g.classList.remove("pulse-up", "pulse-down"), 600);
      });
    }
  }

  function setTourBadge(label, progressNum, progressTotal) {
    if (!refs.tourBadgeEl) return;
    refs.tourBadgeEl.textContent = label;
    refs.tourBadgeEl.classList.add("flash");
    setTimeout(() => refs.tourBadgeEl.classList.remove("flash"), 400);
    if (refs.tricotEl && progressNum != null) {
      const progress = Math.min(100, (progressNum / progressTotal) * 100);
      refs.tricotEl.style.setProperty("--tricot", progress + "%");
    }
  }

  // ---------- Animations char ----------
  function flashChar(el, cls, ms = 1000) {
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  function animateForChoice(tag, effects) {
    if (tag === "cruel") {
      flashChar(refs.genieEl, "shocked", 700);
      if (refs.backdropEl) {
        refs.backdropEl.classList.add("shake");
        setTimeout(() => refs.backdropEl.classList.remove("shake"), 400);
      }
      AudioFX.thud();
    } else if (tag === "doux") {
      flashChar(refs.genieEl, "smiling", 1500);
      flashChar(refs.oeugenieEl, "embarrassed", 1000);
      state.s_genie_smiled++;
      AudioFX.pop(0.05, 520);
    } else if (tag === "machine" || tag === "coloc") {
      flashChar(refs.machineEl, "talking", 900);
      AudioFX.mmh();
      state.s_machine_used++;
      if (effects && effects.charge && (state.charge + effects.charge) <= 0) {
        setTimeout(() => AudioFX.grind(), 700);
      }
    } else {
      flashChar(refs.oeugenieEl, "thinking", 700);
      AudioFX.click();
    }
  }

  // ---------- Scene runner ----------
  function play(actions, onEnd) {
    queue = [...actions];
    onSceneEnd = onEnd;
    next();
  }

  function next() {
    if (queue.length === 0) {
      refs.dialogueEl.classList.remove("busy");
      if (onSceneEnd) {
        const cb = onSceneEnd; onSceneEnd = null;
        cb();
      }
      return;
    }
    refs.dialogueEl.classList.add("busy");
    const a = queue.shift();
    if (a.type === "say") typewrite(a.speaker, a.text, a.cls, next);
    else if (a.type === "oracle") typewriteOracle(a.text, "oracle", next);
    else if (a.type === "didascalie") typewriteFlat(a.text, "didascalie", next);
    else if (a.type === "wait") setTimeout(next, a.ms || 400);
    else if (a.type === "anim") { a.fn(); next(); }
    else if (a.type === "sfx") { AudioFX[a.name] && AudioFX[a.name](a.vol); next(); }
  }

  function makeLine(cls) {
    const p = document.createElement("p");
    p.className = "line " + (cls || "");
    return p;
  }

  function typewrite(speaker, text, cls, done) {
    const p = makeLine(cls);
    if (speaker) {
      const s = document.createElement("span");
      s.className = "speaker";
      s.textContent = speaker;
      p.appendChild(s);
      p.appendChild(document.createTextNode(" "));
    }
    const span = document.createElement("span");
    p.appendChild(span);
    const caret = document.createElement("span");
    caret.className = "caret";
    p.appendChild(caret);
    refs.dialogueEl.appendChild(p);

    let i = 0;
    typing = true;
    const speed = cls === "oeugenie-pense" ? 18 : 22;
    const step = () => {
      if (skipRequested) {
        span.textContent = text;
        caret.remove();
        typing = false;
        skipRequested = false;
        setTimeout(done, 120);
        return;
      }
      if (i >= text.length) {
        caret.remove();
        typing = false;
        setTimeout(done, 280);
        return;
      }
      span.textContent += text[i];
      if ((text[i] !== " ") && (i % 3 === 0) && cls !== "machine") {
        if (Math.random() < 0.35) AudioFX.tick(0.018);
      }
      i++;
      setTimeout(step, speed);
    };
    step();
  }

  function typewriteFlat(text, cls, done) {
    const p = makeLine(cls);
    const span = document.createElement("span");
    p.appendChild(span);
    const caret = document.createElement("span");
    caret.className = "caret";
    p.appendChild(caret);
    refs.dialogueEl.appendChild(p);

    let i = 0;
    typing = true;
    const step = () => {
      if (skipRequested) {
        span.textContent = text;
        caret.remove();
        typing = false;
        skipRequested = false;
        setTimeout(done, 120);
        return;
      }
      if (i >= text.length) {
        caret.remove();
        typing = false;
        setTimeout(done, 320);
        return;
      }
      span.textContent += text[i];
      i++;
      setTimeout(step, 22);
    };
    step();
  }

  function typewriteOracle(text, cls, done) {
    if (typeof OracleVoice !== "undefined") OracleVoice.speak(text);
    typewriteFlat(text, cls, done);
  }

  // ---------- Dialogue helpers ----------
  function clearDialogue() { refs.dialogueEl.innerHTML = ""; }
  function clearChoices() {
    refs.choicesEl.innerHTML = "";
    refs.choicesEl.classList.remove("appearing");
  }

  const INVERTED = new Set(["suspicion"]);

  function renderEffects(effects) {
    if (!effects) return null;
    const wrap = document.createElement("div");
    wrap.className = "choice-effects";
    for (const key of Object.keys(effects)) {
      if (!effectLabels[key]) continue;
      const v = effects[key];
      if (v === 0) continue;
      const span = document.createElement("span");
      const inverted = INVERTED.has(key);
      const isGood = inverted ? v < 0 : v > 0;
      span.className = "effect " + (isGood ? "up" : "down");
      const sign = v > 0 ? "+" : "";
      span.innerHTML = `<span class="effect-icon">${effectLabels[key].icon}</span>${effectLabels[key].label} ${sign}${v}`;
      wrap.appendChild(span);
    }
    return wrap.children.length ? wrap : null;
  }

  function offer(choices) {
    clearChoices();
    refs.choicesEl.classList.add("appearing");
    choices.forEach(c => {
      if (c.if && !c.if()) return;
      const b = document.createElement("button");
      const isSecondary = c.tag === "machine" || c.tag === "coloc";
      b.className = "choice" + (isSecondary ? " machine-action" : "");

      const head = document.createElement("div");
      head.className = "choice-head";
      if (c.tag) {
        const t = document.createElement("span");
        t.className = "tag " + c.tag;
        t.textContent = c.tag;
        head.appendChild(t);
      }
      const txt = document.createElement("span");
      txt.className = "choice-text";
      txt.textContent = c.text;
      head.appendChild(txt);
      b.appendChild(head);

      const eff = renderEffects(c.effects);
      if (eff) b.appendChild(eff);

      b.onclick = () => {
        AudioFX.click();
        clearChoices();
        animateForChoice(c.tag, c.effects);
        if (c.tag) state.s_choices.push(c.tag);
        delta(c.effects || {});
        c.do();
      };
      refs.choicesEl.appendChild(b);
    });
  }

  function delta(d) {
    const pulses = [];
    if (d.estime) {
      state.estime += d.estime;
      state.estime = Math.max(0, Math.min(100, state.estime));
      if (state.estime < state.s_estime_min) state.s_estime_min = state.estime;
      pulses.push({ idx: 0, dir: d.estime > 0 ? "up" : "down" });
    }
    if (d.suspicion) {
      state.suspicion += d.suspicion;
      state.suspicion = Math.max(0, Math.min(100, state.suspicion));
      if (state.suspicion > state.s_suspicion_max) state.s_suspicion_max = state.suspicion;
      pulses.push({ idx: 1, dir: d.suspicion < 0 ? "up" : "down" });
    }
    if (d.charge) {
      state.charge += d.charge;
      state.charge = Math.max(0, state.charge);
      pulses.push({ idx: 2, dir: d.charge > 0 ? "up" : "down" });
    }
    if (d.doux) state.doux += d.doux;
    if (d.cruel) state.cruel += d.cruel;
    updateHUD(pulses);
  }

  // ---------- Helpers de scène ----------
  const S = (speaker, text, cls) => ({ type: "say", speaker, text, cls });
  const O = (text) => ({ type: "oracle", text });
  const D = (text) => ({ type: "didascalie", text });
  const W = (ms) => ({ type: "wait", ms });
  const A = (fn) => ({ type: "anim", fn });

  return {
    init, getState, play, offer, delta, clearDialogue, clearChoices,
    setTourBadge, flashChar, animateForChoice, updateHUD,
    S, O, D, W, A,
  };
})();
