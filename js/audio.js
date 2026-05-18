// ============================================================
// AudioFX — sons synthétisés via Web Audio API
// Pas de fichiers externes, tout est généré
// ============================================================

const AudioFX = (() => {
  let ctx = null;
  let enabled = true;
  let muted = false;
  let sfxMuted = false; // bruitages one-shot
  let ambianceNodes = null;

  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function gainEnvelope(node, peak, attack, hold, release, when) {
    const t = when || ensure().currentTime;
    node.gain.setValueAtTime(0, t);
    node.gain.linearRampToValueAtTime(peak, t + attack);
    node.gain.setValueAtTime(peak, t + attack + hold);
    node.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
  }

  // Petit clic d'aiguilles à tricoter (impulse de bois)
  function tick(volume = 0.04) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    const f = c.createBiquadFilter();
    osc.type = "square";
    osc.frequency.setValueAtTime(2200 + Math.random() * 400, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.04);
    f.type = "highpass"; f.frequency.value = 800;
    osc.connect(f); f.connect(g); g.connect(c.destination);
    gainEnvelope(g, volume, 0.002, 0.01, 0.05, t);
    osc.start(t); osc.stop(t + 0.08);
  }

  // "Mmh" mécanique de la Machine
  function mmh(volume = 0.08) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(160, t + 0.3);
    osc.connect(g); g.connect(c.destination);
    gainEnvelope(g, volume, 0.05, 0.25, 0.2, t);
    osc.start(t); osc.stop(t + 0.6);
  }

  // Ding de cloche
  function ding(volume = 0.15) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    [880, 1320, 1760].forEach((freq, i) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(g); g.connect(c.destination);
      gainEnvelope(g, volume * (1 - i * 0.3), 0.003, 0.02, 1.2, t);
      osc.start(t); osc.stop(t + 1.5);
    });
  }

  // Click doux pour les boutons de choix
  function click(volume = 0.06) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.05);
    osc.connect(g); g.connect(c.destination);
    gainEnvelope(g, volume, 0.002, 0.01, 0.06, t);
    osc.start(t); osc.stop(t + 0.1);
  }

  // Bzzt machine grille
  function grind(volume = 0.12) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(40, t + 0.6);
    osc.connect(g); g.connect(c.destination);
    gainEnvelope(g, volume, 0.01, 0.1, 0.5, t);
    osc.start(t); osc.stop(t + 0.7);
  }

  // Pop d'effet positif (jauge qui monte)
  function pop(volume = 0.05, freq = 600) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.6, t + 0.1);
    osc.connect(g); g.connect(c.destination);
    gainEnvelope(g, volume, 0.005, 0.02, 0.1, t);
    osc.start(t); osc.stop(t + 0.15);
  }

  // Battement d'ailes (bruit blanc filtré court)
  function flap(volume = 0.07) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const dur = 0.16;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.7;
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + dur);
    filter.Q.value = 0.7;
    const g = c.createGain();
    noise.connect(filter); filter.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.start(t); noise.stop(t + dur + 0.02);
  }

  // Battement de cœur (lub-dub) — basse sine + harmonique [AMBIANCE]
  function heartbeat(volume = 0.12) {
    if (muted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    [0, 0.13].forEach((delay, i) => {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(85, t + delay);
      osc.frequency.exponentialRampToValueAtTime(45, t + delay + 0.13);
      const g = c.createGain();
      osc.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0, t + delay);
      g.gain.linearRampToValueAtTime(volume * (i === 0 ? 1 : 0.65), t + delay + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.15);
      osc.start(t + delay); osc.stop(t + delay + 0.18);
      // Harmonique sourde
      const osc2 = c.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 32;
      const g2 = c.createGain();
      osc2.connect(g2); g2.connect(c.destination);
      g2.gain.setValueAtTime(0, t + delay);
      g2.gain.linearRampToValueAtTime(volume * 0.5 * (i === 0 ? 1 : 0.6), t + delay + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.18);
      osc2.start(t + delay); osc2.stop(t + delay + 0.2);
    });
  }

  // Une note de fanfare (square+sawtooth, timbre cuivré)
  function fanfareNote(freq, dur, volume = 0.14, when = 0) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime + when;
    const osc1 = c.createOscillator();
    osc1.type = "square";
    osc1.frequency.value = freq;
    const osc2 = c.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = freq * 2.005; // léger desaccord
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + dur);
    const g = c.createGain();
    osc1.connect(filter); osc2.connect(filter);
    filter.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.015);
    g.gain.setValueAtTime(volume * 0.9, t + dur - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc1.start(t); osc1.stop(t + dur + 0.02);
    osc2.start(t); osc2.stop(t + dur + 0.02);
  }

  // Note "douce" (sine + harmonique) — pour mélodies plus chantantes
  function softNote(freq, dur, volume = 0.10, when = 0) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime + when;
    const osc1 = c.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = freq;
    const osc2 = c.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;
    const g = c.createGain();
    osc1.connect(g);
    const g2 = c.createGain();
    g2.gain.value = 0.3;
    osc2.connect(g2); g2.connect(g);
    g.connect(c.destination);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.01);
    g.gain.setValueAtTime(volume * 0.85, t + Math.max(0.05, dur - 0.1));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc1.start(t); osc1.stop(t + dur + 0.02);
    osc2.start(t); osc2.stop(t + dur + 0.02);
  }

  // Fanfare courte (utilisée comme intro de winMusic)
  function victoryFanfare() {
    if (muted || sfxMuted || !enabled) return;
    const seq = [
      { f: 523, d: 0.13, off: 0 },
      { f: 659, d: 0.13, off: 0.14 },
      { f: 784, d: 0.13, off: 0.28 },
      { f: 1047, d: 0.20, off: 0.42 },
      { f: 1319, d: 0.16, off: 0.64 },
      { f: 1568, d: 0.40, off: 0.82 },
    ];
    seq.forEach(n => fanfareNote(n.f, n.d, n.vol || 0.13, n.off));
  }

  // VRAIE musique de victoire (~5 sec) : fanfare + mélodie + accord plaqué
  function winMusic() {
    if (muted || sfxMuted || !enabled) return;
    // Phrase 1 : montée triomphale do-mi-sol-do-mi-sol-do6
    const phrase1 = [
      { f: 523, d: 0.13 }, { f: 659, d: 0.13 }, { f: 784, d: 0.13 },
      { f: 1047, d: 0.20 }, { f: 1319, d: 0.20 }, { f: 1568, d: 0.40 },
    ];
    let off = 0;
    phrase1.forEach(n => { fanfareNote(n.f, n.d, 0.14, off); off += n.d; });
    // Petit silence
    off += 0.05;
    // Phrase 2 : motif rythmé sol-mi-sol-do6
    const phrase2 = [
      { f: 784, d: 0.10 }, { f: 1047, d: 0.10 }, { f: 1319, d: 0.10 },
      { f: 1568, d: 0.20 }, { f: 1319, d: 0.10 }, { f: 1568, d: 0.20 },
      { f: 2093, d: 0.50 }, // do7 final
    ];
    phrase2.forEach(n => { fanfareNote(n.f, n.d, 0.14, off); off += n.d; });

    // Basse tenue do en arrière-plan
    drone(0.05, 4.0, 65);
    setTimeout(() => drone(0.04, 1.5, 78), 1800);

    // Accord plaqué final (do majeur, plusieurs octaves)
    setTimeout(() => {
      fanfareNote(523, 1.4, 0.08);
      fanfareNote(659, 1.4, 0.08);
      fanfareNote(784, 1.4, 0.08);
      fanfareNote(1047, 1.4, 0.10);
    }, Math.round(off * 1000));

    // Cymbale (tick) au début et à la fin
    tick(0.10);
    setTimeout(() => tick(0.12), Math.round(off * 1000));
  }

  // VRAIE musique de défaite (~4 sec) : trombone + mélodie triste + accord dissonant + boum final
  function loseMusic() {
    if (muted || sfxMuted || !enabled) return;
    // 1. Trombone principal (wah-wah-waaaah)
    defeatTrombone();
    // 2. Petite mélodie descendante de "piano triste" en parallèle, démarre légèrement après
    setTimeout(() => {
      const sad = [
        { f: 392, d: 0.22 }, // G4
        { f: 349, d: 0.22 }, // F4
        { f: 311, d: 0.22 }, // Eb4
        { f: 277, d: 0.32 }, // Db4
        { f: 247, d: 0.55 }, // B3 (long)
      ];
      let off = 0;
      sad.forEach(n => { softNote(n.f, n.d, 0.085, off); off += n.d; });
    }, 600);
    // 3. Accord mineur dissonant final
    setTimeout(() => {
      softNote(196, 1.7, 0.10); // G3
      softNote(233, 1.7, 0.10); // Bb3
      softNote(277, 1.7, 0.10); // Db4 (accord diminué)
    }, 2400);
    // 4. Boum sourd final
    setTimeout(() => thud(0.25), 3700);
  }

  // Trombone de défaite (waaaah descendant)
  function defeatTrombone() {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    // Sawtooth qui glisse vers le bas, comme un trombone
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.4);
    osc.frequency.setValueAtTime(330, t + 0.5);
    osc.frequency.exponentialRampToValueAtTime(245, t + 0.9);
    osc.frequency.setValueAtTime(245, t + 1.0);
    osc.frequency.exponentialRampToValueAtTime(165, t + 1.5);
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    const g = c.createGain();
    osc.connect(filter); filter.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.08);
    g.gain.setValueAtTime(0.16, t + 0.45);
    g.gain.linearRampToValueAtTime(0.18, t + 0.55);
    g.gain.setValueAtTime(0.16, t + 0.95);
    g.gain.linearRampToValueAtTime(0.18, t + 1.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
    osc.start(t); osc.stop(t + 2.05);
    // Petit boum final
    setTimeout(() => thud(0.18), 1700);
  }

  // Bruit de glissement sur surface de verre (pour le dégoulinement du flan)
  function glassSlide(volume = 0.08) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const dur = 0.45 + Math.random() * 0.3;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.6;
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const f1 = c.createBiquadFilter();
    f1.type = "highpass";
    f1.frequency.setValueAtTime(2200, t);
    f1.frequency.exponentialRampToValueAtTime(450, t + dur);
    const f2 = c.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.value = 1400 + Math.random() * 600;
    f2.Q.value = 3.5;
    const g = c.createGain();
    noise.connect(f1); f1.connect(f2); f2.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.start(t); noise.stop(t + dur + 0.05);
  }

  // Splat liquide (impact mou contre vitre)
  function splat(volume = 0.15) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    // Bruit blanc court + un thud bas
    const dur = 0.25;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + dur);
    const g = c.createGain();
    noise.connect(filter); filter.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.start(t); noise.stop(t + dur + 0.05);
    // Boum grave
    thud(volume * 1.3);
  }

  // Drone grave inquiétant (basse continue)
  function drone(volume = 0.04, duration = 1.5, baseFreq = 55) {
    if (muted || !enabled) return; // [AMBIANCE]
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = baseFreq;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    filter.Q.value = 2;
    const g = c.createGain();
    osc.connect(filter); filter.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.25);
    g.gain.linearRampToValueAtTime(volume * 0.8, t + duration - 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.start(t); osc.stop(t + duration + 0.05);
  }

  // Apparition de poule : varie aléatoirement entre 4 styles
  function chickenAppear(volume = 0.13) {
    if (muted || sfxMuted || !enabled) return;
    const roll = Math.random();
    if (roll < 0.20) {
      // Jacassement excité
      flap(volume * 0.65);
      setTimeout(() => clucksExcited(volume), 70);
    } else if (roll < 0.35) {
      // BAAAWK surprise
      flap(volume * 0.8);
      setTimeout(() => squawk(volume), 90);
      setTimeout(() => cot(volume * 0.6, 1.1), 500);
    } else if (roll < 0.55) {
      // 3 cot rapides + ailes
      flap(volume * 0.7);
      setTimeout(() => cot(volume, 1.0 + Math.random() * 0.15), 60);
      setTimeout(() => cot(volume * 0.9, 0.95 + Math.random() * 0.15), 170);
      setTimeout(() => cot(volume * 0.85, 1.05 + Math.random() * 0.1), 270);
      setTimeout(() => flap(volume * 0.5), 380);
    } else {
      // Cluck classique
      flap(volume * 0.7);
      setTimeout(() => cluck(volume), 70);
      setTimeout(() => flap(volume * 0.5), 280);
    }
  }

  // Un seul "cot" naturel (avec slide aigu→médium et formant nasal)
  function cot(volume = 0.10, pitch = 1) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const f0 = 650 * pitch * (0.92 + Math.random() * 0.16);

    // Voix fondamentale (triangle = timbre nasal)
    const osc1 = c.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(f0 * 1.3, t);
    osc1.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 0.07);
    const f1 = c.createBiquadFilter();
    f1.type = "bandpass"; f1.frequency.value = 1100 * pitch; f1.Q.value = 3;
    const g1 = c.createGain();
    osc1.connect(f1); f1.connect(g1); g1.connect(c.destination);
    g1.gain.setValueAtTime(0, t);
    g1.gain.linearRampToValueAtTime(volume, t + 0.005);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    // Harmonique aigu (square = mordant)
    const osc2 = c.createOscillator();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(f0 * 2.7, t);
    osc2.frequency.exponentialRampToValueAtTime(f0 * 1.3, t + 0.07);
    const f2 = c.createBiquadFilter();
    f2.type = "bandpass"; f2.frequency.value = 2600 * pitch; f2.Q.value = 6;
    const g2 = c.createGain();
    osc2.connect(f2); f2.connect(g2); g2.connect(c.destination);
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(volume * 0.5, t + 0.003);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc1.start(t); osc1.stop(t + 0.1);
    osc2.start(t); osc2.stop(t + 0.1);
  }

  // Compatibilité : cluck = 2 cots rapides
  function cluck(volume = 0.10) {
    cot(volume, 0.95 + Math.random() * 0.1);
    setTimeout(() => cot(volume * (0.8 + Math.random() * 0.3), 0.9 + Math.random() * 0.2), 150);
  }

  // Jacassement excité (4-6 cots rapides, pitch varié)
  function clucksExcited(volume = 0.12) {
    if (muted || sfxMuted || !enabled) return;
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      setTimeout(() => cot(volume * (0.85 + Math.random() * 0.3), 0.95 + Math.random() * 0.25), i * 70);
    }
  }

  // "BAAAWK" : long cri descendant (poule paniquée / surprise)
  function squawk(volume = 0.13) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880 + Math.random() * 120, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.35);
    const f = c.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = 1100; f.Q.value = 3.5;
    const g = c.createGain();
    osc.connect(f); f.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.02);
    g.gain.linearRampToValueAtTime(volume * 0.7, t + 0.22);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.start(t); osc.stop(t + 0.42);
  }

  // Cocorico complet (4 syllabes du chant de coq)
  function cocorico(volume = 0.15) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    // CO - CO - RI - COOO
    const notes = [
      { f: 500, slide: 420, d: 0.13, off: 0,    vol: 0.85 },
      { f: 650, slide: 550, d: 0.11, off: 0.16, vol: 0.9 },
      { f: 920, slide: 820, d: 0.18, off: 0.30, vol: 1.0 },
      { f: 780, slide: 320, d: 0.45, off: 0.52, vol: 1.0 },
    ];
    notes.forEach(n => {
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(n.f, t + n.off);
      osc.frequency.exponentialRampToValueAtTime(n.slide, t + n.off + n.d);
      const f = c.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 2.5;
      const g = c.createGain();
      osc.connect(f); f.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0, t + n.off);
      g.gain.linearRampToValueAtTime(volume * n.vol, t + n.off + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, t + n.off + n.d);
      osc.start(t + n.off); osc.stop(t + n.off + n.d + 0.04);
    });
  }

  // Thud d'effet négatif
  function thud(volume = 0.07) {
    if (muted || sfxMuted || !enabled) return;
    const c = ensure();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.15);
    osc.connect(g); g.connect(c.destination);
    gainEnvelope(g, volume, 0.005, 0.02, 0.18, t);
    osc.start(t); osc.stop(t + 0.25);
  }

  // Ambiance : cliquetis de tricot très doux en boucle
  function startAmbiance() {
    if (muted || sfxMuted || !enabled) return;
    if (ambianceNodes) return;
    ambianceNodes = setInterval(() => {
      if (Math.random() < 0.6) tick(0.018);
    }, 700);
  }

  function stopAmbiance() {
    if (ambianceNodes) { clearInterval(ambianceNodes); ambianceNodes = null; }
  }

  function setMuted(m) {
    muted = m;
    if (m) stopAmbiance();
    else startAmbiance();
  }

  function setSfxMuted(m) { sfxMuted = m; }
  function isSfxMuted() { return sfxMuted; }

  // ---------- Soundtrack 8-bit en boucle ----------
  // Un seul AudioBuffer contient mélodie + harmonie + basse + percus + pause.
  // AudioBufferSourceNode loop=true : aucun timer JS, aucune automation de gain.
  let _musicSource = null;
  let _melodyAudioBuf = null; // rebuilt if null

  // 1 unité = noire à 175 BPM (0.343 s)
  const BEAT_8BIT = 0.343;
  // Articulation mélodie : 55 % son, 45 % silence
  const ARTICULATION = 0.55;
  // Respiration entre boucles : 1 noire
  const LOOP_PAUSE_BEATS = 1;

  const MELODY_8BIT = [
    { f: 493.88, len: 1   }, // B4
    { f: 392.00, len: 1.5 }, // G4
    { f: 493.88, len: 0.5 }, // B4
    { f: 440.00, len: 0.5 }, // A4
    { f: 587.33, len: 0.5 }, // D5
    { f: 493.88, len: 0.5 }, // B4
    { f: 392.00, len: 0.5 }, // G4
    { f: 493.88, len: 1   }, // B4
    { f: 392.00, len: 1.5 }, // G4
    { f: 493.88, len: 0.5 }, // B4
    { f: 440.00, len: 0.5 }, // A4
    { f: 587.33, len: 0.5 }, // D5
    { f: 392.00, len: 1   }, // G4
  ];

  // Harmony : tierce majeure au-dessus de chaque note de mélodie
  const HARMONY_8BIT = [
    { f: 622.25, len: 1   }, // D#5 / Eb5  (+m3 de B4)
    { f: 493.88, len: 1.5 }, // B4         (+M3 de G4)
    { f: 622.25, len: 0.5 }, // Eb5
    { f: 554.37, len: 0.5 }, // C#5        (+M3 de A4)
    { f: 739.99, len: 0.5 }, // F#5        (+M3 de D5)
    { f: 622.25, len: 0.5 }, // Eb5
    { f: 493.88, len: 0.5 }, // B4
    { f: 622.25, len: 1   }, // Eb5
    { f: 493.88, len: 1.5 }, // B4
    { f: 622.25, len: 0.5 }, // Eb5
    { f: 554.37, len: 0.5 }, // C#5
    { f: 739.99, len: 0.5 }, // F#5
    { f: 493.88, len: 1   }, // B4
  ];

  // Bass : 1 octave sous la mélodie, notes courtes
  const BASS_8BIT = [
    { f: 246.94, start: 0,    len: 0.6  }, // B3
    { f: 196.00, start: 1,    len: 0.9  }, // G3
    { f: 246.94, start: 2.5,  len: 0.3  }, // B3
    { f: 220.00, start: 3,    len: 0.3  }, // A3
    { f: 293.66, start: 3.5,  len: 0.3  }, // D4
    { f: 246.94, start: 4,    len: 0.3  }, // B3
    { f: 196.00, start: 4.5,  len: 0.3  }, // G3
    { f: 246.94, start: 5,    len: 0.6  }, // B3
    { f: 196.00, start: 6,    len: 0.9  }, // G3
    { f: 246.94, start: 7.5,  len: 0.3  }, // B3
    { f: 220.00, start: 8,    len: 0.3  }, // A3
    { f: 293.66, start: 8.5,  len: 0.3  }, // D4
    { f: 196.00, start: 9,    len: 0.6  }, // G3
  ];

  function _writeTriangle(data, pos, freq, sr, samples, volume, articulation) {
    const soundSamples = Math.round(samples * articulation);
    const fadeLen = Math.min(128, Math.round(sr * 0.004));
    const period = sr / freq;
    for (let i = 0; i < soundSamples; i++) {
      const phase = (i % period) / period;
      const v = volume * (1 - 4 * Math.abs(phase - 0.5));
      let env = 1;
      if (i < fadeLen) env = i / fadeLen;
      else if (i >= soundSamples - fadeLen) env = (soundSamples - 1 - i) / fadeLen;
      data[pos + i] += v * env;
    }
  }

  // Kick : sine très courte qui descend rapidement
  function _writeKick(data, samplePos, sr, totalSamples, vol) {
    const dur = Math.round(sr * 0.10);
    if (samplePos + dur > totalSamples) return;
    for (let i = 0; i < dur; i++) {
      const t = i / sr;
      const freq = 180 * Math.exp(-25 * t);
      const phase = 2 * Math.PI * freq * t;
      const env = Math.exp(-18 * t);
      data[samplePos + i] += vol * Math.sin(phase) * env;
    }
  }

  // Hi-hat : bruit blanc très court, filtré aigu
  function _writeHihat(data, samplePos, sr, totalSamples, vol) {
    const dur = Math.round(sr * 0.028);
    if (samplePos + dur > totalSamples) return;
    for (let i = 0; i < dur; i++) {
      const env = 1 - i / dur;
      // pseudo-bruit via harmoniques hautes fréquences
      const t = i / sr;
      const v = (Math.sin(2 * Math.PI * 8000 * t) + Math.sin(2 * Math.PI * 11200 * t)) * 0.5;
      data[samplePos + i] += vol * v * env;
    }
  }

  function _buildMelodyAudioBuffer(c) {
    const sr = c.sampleRate;
    const melodyBeats  = MELODY_8BIT.reduce((s, n) => s + n.len, 0);
    const totalBeats   = melodyBeats + LOOP_PAUSE_BEATS;
    const totalSamples = Math.round(totalBeats * BEAT_8BIT * sr);

    const audioBuf = c.createBuffer(1, totalSamples, sr);
    const data = audioBuf.getChannelData(0);

    // --- Mélodie ---
    let pos = 0;
    for (const note of MELODY_8BIT) {
      const slotSamples = Math.round(note.len * BEAT_8BIT * sr);
      _writeTriangle(data, pos, note.f, sr, slotSamples, 0.12, ARTICULATION);
      pos += slotSamples;
    }

    // --- Harmonie (même rythme, volume plus doux) ---
    pos = 0;
    for (const note of HARMONY_8BIT) {
      const slotSamples = Math.round(note.len * BEAT_8BIT * sr);
      _writeTriangle(data, pos, note.f, sr, slotSamples, 0.055, ARTICULATION);
      pos += slotSamples;
    }

    // --- Basse (sine) ---
    for (const bn of BASS_8BIT) {
      const bStart   = Math.round(bn.start * BEAT_8BIT * sr);
      const bSamples = Math.round(bn.len   * BEAT_8BIT * sr);
      if (bStart + bSamples > totalSamples) continue;
      const fadeLen = Math.min(256, Math.round(sr * 0.008));
      const period  = sr / bn.f;
      for (let i = 0; i < bSamples; i++) {
        const phase = (i % period) / period;
        const v = 0.09 * Math.sin(2 * Math.PI * phase);
        let env = 1;
        if (i < fadeLen) env = i / fadeLen;
        else if (i >= bSamples - fadeLen) env = (bSamples - 1 - i) / fadeLen;
        data[bStart + i] += v * env;
      }
    }

    // --- Percussions : kick sur les temps forts, hi-hat en doubles croches ---
    // Grille en croches (0.5 beat) sur toute la durée mélodie
    const halfBeat = BEAT_8BIT * 0.5;
    const numEighths = Math.floor(melodyBeats / 0.5);
    for (let i = 0; i < numEighths; i++) {
      const t = Math.round(i * halfBeat * sr);
      const beat = i * 0.5; // position en beats
      // Kick : sur chaque noire (0, 1, 2, …)
      if (i % 2 === 0) _writeKick(data, t, sr, totalSamples, 0.18);
      // Hi-hat : sur chaque croche
      _writeHihat(data, t, sr, totalSamples, 0.06);
    }

    return audioBuf;
  }

  function startMusic() {
    if (_musicSource) return;
    const c = ensure();
    if (!_melodyAudioBuf) _melodyAudioBuf = _buildMelodyAudioBuffer(c);
    const src = c.createBufferSource();
    src.buffer = _melodyAudioBuf;
    src.loop = true;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3400;
    filter.Q.value = 0.5;
    src.connect(filter);
    filter.connect(c.destination);
    src.start();
    _musicSource = src;
  }

  function stopMusic() {
    if (_musicSource) {
      try { _musicSource.stop(); } catch (e) {}
      _musicSource.disconnect();
      _musicSource = null;
    }
  }

  return {
    init: ensure,
    tick, mmh, ding, click, grind, pop, thud,
    cluck, cot, clucksExcited, squawk, cocorico, flap, chickenAppear,
    heartbeat, drone, victoryFanfare, defeatTrombone, fanfareNote,
    softNote, winMusic, loseMusic, glassSlide, splat,
    setSfxMuted, isSfxMuted,
    startAmbiance, stopAmbiance,
    startMusic, stopMusic,
    setMuted,
    isMuted: () => muted,
  };
})();
