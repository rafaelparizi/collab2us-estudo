// Registro local do aceite do TCLE. Fica só no navegador do participante;
// serve para liberar a página de instruções, não como registro formal do consentimento.
window.Collab2UsConsent = (function () {
  const KEY = "collab2us-tcle-v1";
  function storageOk() {
    try { localStorage.setItem(KEY + "-t", "1"); localStorage.removeItem(KEY + "-t"); return true; }
    catch (e) { return false; }
  }
  function get() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  }
  function save(audio) {
    const rec = { accepted: true, audio: audio, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    return rec;
  }
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }
  function hasConsent() {
    if (get()) return true;
    // Navegadores sem armazenamento local chegam com ?aceite=1 vindo do TCLE.
    return !storageOk() && new URLSearchParams(location.search).get("aceite") === "1";
  }
  return { get, save, clear, hasConsent, storageOk };
})();
