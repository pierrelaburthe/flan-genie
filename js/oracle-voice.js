// ============================================================
// OracleVoice — synthèse vocale pour les lignes de l'Oracle
// Utilise window.speechSynthesis (offline, gratuit, par défaut système)
// ============================================================

const OracleVoice = (() => {
  let enabled = true;
  let voice = null;
  let initialized = false;

  function pickVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    // Préférer une voix française
    const fr = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("fr"));
    if (fr.length) {
      // Préférer une voix masculine grave si on peut la deviner par le nom
      const grave = fr.find(v => /thomas|daniel|jean|reed|pierre|frederic/i.test(v.name));
      return grave || fr[0];
    }
    return voices[0] || null;
  }

  function init() {
    if (initialized || !window.speechSynthesis) return;
    voice = pickVoice();
    if (!voice) {
      window.speechSynthesis.onvoiceschanged = () => { voice = pickVoice(); };
    }
    initialized = true;
  }

  function speak(text) {
    if (!enabled) return;
    if (!window.speechSynthesis) return;
    init();
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || "fr-FR";
      u.rate = 0.88;
      u.pitch = 0.85;
      u.volume = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // silent
    }
  }

  function stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function setEnabled(v) {
    enabled = v;
    if (!v) stop();
  }

  function isEnabled() { return enabled; }

  return { init, speak, stop, setEnabled, isEnabled };
})();
