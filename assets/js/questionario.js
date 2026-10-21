// Questionário TAM3 (7 pontos) + SUS (5 pontos).
// Redação, ordem e escalas conforme os documentos de orientação do estudo.
// URL do app da Web do Google Apps Script que grava na planilha e envia o e-mail
// (veja apps-script/README.md). Vazia: as respostas ficam só neste navegador.
const ENVIO_URL = "https://script.google.com/macros/s/AKfycbx6T0qJtF645v0NrvoCwDaql_wuYnva07F1dbcfZqR7krhL8xiVVYaanoIpxQa_pN0Obw/exec";

(function () {
  // Textos em português (versão do estudo) e em inglês (redação original de
  // Venkatesh e Bala, 2008, e Brooke, 1996, adaptada ao Collab2Us). A página em
  // inglês tem html lang="en".
  const EN = document.documentElement.lang.startsWith("en");
  const PT = {
    SCALE7: [
      "Discordo totalmente", "Discordo moderadamente", "Discordo um pouco",
      "Nem concordo nem discordo", "Concordo um pouco", "Concordo moderadamente", "Concordo totalmente"
    ],
    SCALE5: ["Discordo totalmente", "Discordo", "Nem concordo nem discordo", "Concordo", "Concordo totalmente"],
    TAM: [
      { title: "Utilidade percebida", items: [
        ["PU1", "Usar o Collab2Us melhora meu desempenho nas tarefas de requisitos."],
        ["PU2", "Usar o Collab2Us aumenta minha produtividade nas tarefas de requisitos."],
        ["PU3", "Usar o Collab2Us aumenta minha eficácia na realização das tarefas de requisitos."],
        ["PU4", "Considero o Collab2Us útil para as tarefas de requisitos."]
      ]},
      { title: "Facilidade de uso percebida", items: [
        ["PEOU1", "Minha interação com o Collab2Us é clara e compreensível."],
        ["PEOU2", "Interagir com o Collab2Us não exige muito esforço mental."],
        ["PEOU3", "Considero o Collab2Us fácil de usar."],
        ["PEOU4", "Considero fácil fazer o Collab2Us executar o que desejo."]
      ]},
      { title: "Intenção de uso",
        note: "Para estas afirmativas, considere que você teria acesso ao Collab2Us e oportunidades de realizar tarefas de requisitos.",
        items: [
        ["BI1", "Se eu tivesse acesso ao Collab2Us, teria intenção de utilizá-lo."],
        ["BI2", "Se eu tivesse acesso ao Collab2Us, acredito que o utilizaria."],
        ["BI3", "Planejo utilizar o Collab2Us nos próximos três meses."]
      ]},
      { title: "Prazer percebido no uso",
        note: "Considere a experiência de utilizar a ferramenta, independentemente de sua utilidade para concluir as tarefas.",
        items: [
        ["ENJ1", "Considero prazeroso utilizar o Collab2Us."],
        ["ENJ2", "O processo de utilizar o Collab2Us é agradável."],
        ["ENJ3", "Eu me divirto ao utilizar o Collab2Us."]
      ]}
    ],

    SUS: [
      "Acho que gostaria de utilizar o Collab2Us com frequência.",
      "Considerei o Collab2Us mais complexo do que necessário.",
      "Achei o Collab2Us fácil de utilizar.",
      "Acho que necessitaria de ajuda de um técnico para conseguir utilizar o Collab2Us.",
      "Considerei que as várias funcionalidades do Collab2Us estavam bem integradas.",
      "Achei que o Collab2Us tinha muitas inconsistências.",
      "Suponho que a maioria das pessoas aprenderia a utilizar rapidamente o Collab2Us.",
      "Considerei o Collab2Us muito complicado de utilizar.",
      "Senti-me muito confiante a utilizar o Collab2Us.",
      "Tive que aprender muito antes de conseguir lidar com o Collab2Us."
    ],
    msg: {
      progress: (d, t) => d + " de " + t + " respondidas",
      missing: n => (n === 1 ? "1 afirmativa ainda está sem resposta." : n + " afirmativas ainda estão sem resposta.") +
        " Os itens em destaque precisam ser marcados para concluir.",
      openCount: n => n === 1 ? "1 de 3 questões abertas está em branco." : n + " de 3 questões abertas estão em branco.",
      sending: "Enviando respostas ao pesquisador…",
      sent: "Respostas enviadas ao pesquisador.",
      failed: "Não foi possível enviar suas respostas. Verifique a conexão e tente novamente, ou chame o pesquisador."
    }
  };
  const ENG = {
    SCALE7: [
      "Strongly disagree", "Moderately disagree", "Somewhat disagree",
      "Neither agree nor disagree", "Somewhat agree", "Moderately agree", "Strongly agree"
    ],
    SCALE5: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"],
    TAM: [
      { title: "Perceived usefulness", items: [
        ["PU1", "Using Collab2Us improves my performance in requirements tasks."],
        ["PU2", "Using Collab2Us in requirements tasks increases my productivity."],
        ["PU3", "Using Collab2Us enhances my effectiveness in requirements tasks."],
        ["PU4", "I find Collab2Us to be useful in requirements tasks."]
      ]},
      { title: "Perceived ease of use", items: [
        ["PEOU1", "My interaction with Collab2Us is clear and understandable."],
        ["PEOU2", "Interacting with Collab2Us does not require a lot of my mental effort."],
        ["PEOU3", "I find Collab2Us to be easy to use."],
        ["PEOU4", "I find it easy to get Collab2Us to do what I want it to do."]
      ]},
      { title: "Behavioral intention",
        note: "For these statements, assume that you have access to Collab2Us and opportunities to carry out requirements tasks.",
        items: [
        ["BI1", "Assuming I had access to Collab2Us, I intend to use it."],
        ["BI2", "Given that I had access to Collab2Us, I predict that I would use it."],
        ["BI3", "I plan to use Collab2Us in the next three months."]
      ]},
      { title: "Perceived enjoyment",
        note: "Consider the experience of using the tool, regardless of how useful it is for completing the tasks.",
        items: [
        ["ENJ1", "I find using Collab2Us to be enjoyable."],
        ["ENJ2", "The actual process of using Collab2Us is pleasant."],
        ["ENJ3", "I have fun using Collab2Us."]
      ]}
    ],
    SUS: [
      "I think that I would like to use Collab2Us frequently.",
      "I found Collab2Us unnecessarily complex.",
      "I thought Collab2Us was easy to use.",
      "I think that I would need the support of a technical person to be able to use Collab2Us.",
      "I found the various functions in Collab2Us were well integrated.",
      "I thought there was too much inconsistency in Collab2Us.",
      "I would imagine that most people would learn to use Collab2Us very quickly.",
      "I found Collab2Us very cumbersome to use.",
      "I felt very confident using Collab2Us.",
      "I needed to learn a lot of things before I could get going with Collab2Us."
    ],
    msg: {
      progress: (d, t) => d + " of " + t + " answered",
      missing: n => (n === 1 ? "1 statement is still unanswered." : n + " statements are still unanswered.") +
        " The highlighted items must be answered to finish.",
      openCount: n => n === 1 ? "1 of 3 open questions is blank." : n + " of 3 open questions are blank.",
      sending: "Sending your answers to the researcher…",
      sent: "Answers sent to the researcher.",
      failed: "Your answers could not be sent. Check your connection and try again, or call the researcher."
    }
  };
  const L = EN ? ENG : PT;
  const SCALE7 = L.SCALE7, SCALE5 = L.SCALE5, TAM = L.TAM;
  const SUS = L.SUS.map((t, i) => ["SUS" + (i + 1), t]);

  // Classe de cor por posição: o ponto neutro é sempre cinza (s4).
  const COLOR7 = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"];
  const COLOR5 = ["s1", "s2", "s4", "s6", "s7"];

  const KEY = "collab2us-questionario-v1";
  const form = document.getElementById("q-form");
  const allIds = [];
  let n = 0;

  function legend(el, scale, colors) {
    el.innerHTML = scale.map((t, i) =>
      '<span><i style="background:var(--lk-' + colors[i].slice(1) + ')"></i>' + (i + 1) + " = " + t + "</span>").join("");
  }

  function item(id, text, scale, colors) {
    n++;
    allIds.push(id);
    const fs = document.createElement("fieldset");
    fs.className = "q-item";
    fs.id = "item-" + id;
    const lg = document.createElement("legend");
    lg.innerHTML = '<span class="num">' + n + '.</span><span class="txt"></span>';
    lg.querySelector(".txt").textContent = text;
    fs.appendChild(lg);
    const row = document.createElement("div");
    row.className = "lk n" + scale.length;
    scale.forEach((t, i) => {
      const lab = document.createElement("label");
      lab.className = colors[i];
      lab.dataset.tip = t;
      lab.innerHTML = '<input type="radio" name="' + id + '" value="' + (i + 1) + '"><span class="v">' + (i + 1) + '</span><span class="t"></span>';
      lab.querySelector(".t").textContent = t;
      row.appendChild(lab);
    });
    fs.appendChild(row);
    // Abaixo da barra: extremos da escala e o significado da opção marcada.
    const ends = document.createElement("div");
    ends.className = "lk-ends";
    ends.innerHTML = '<span></span><span class="sel" aria-hidden="true"></span><span></span>';
    ends.children[0].textContent = scale[0];
    ends.children[2].textContent = scale[scale.length - 1];
    fs.appendChild(ends);
    row.addEventListener("change", e => showSel(e.target));
    return fs;
  }

  // Mostra o significado da opção marcada, na cor do ponto da escala.
  function showSel(input) {
    const lab = input.closest("label");
    const sel = input.closest(".q-item").querySelector(".lk-ends .sel");
    sel.textContent = input.value + " · " + lab.dataset.tip;
    sel.className = "sel on " + lab.classList[0];
  }

  const tamBox = document.getElementById("items-tam");
  TAM.forEach(g => {
    const h = document.createElement("p");
    h.className = "q-group-title";
    h.textContent = g.title;
    tamBox.appendChild(h);
    if (g.note) {
      const p = document.createElement("p");
      p.className = "q-group-note";
      p.textContent = g.note;
      tamBox.appendChild(p);
    }
    g.items.forEach(([id, t]) => tamBox.appendChild(item(id, t, SCALE7, COLOR7)));
  });
  n = 0;
  const susBox = document.getElementById("items-sus");
  SUS.forEach(([id, t]) => susBox.appendChild(item(id, t, SCALE5, COLOR5)));
  legend(document.getElementById("legend-tam"), SCALE7, COLOR7);
  legend(document.getElementById("legend-sus"), SCALE5, COLOR5);

  const val = id => (form.querySelector('input[name="' + id + '"]:checked') || {}).value || "";
  const OPEN = ["Q1", "Q2", "Q3"];
  const openEl = id => document.getElementById(id);
  const codigo = document.getElementById("codigo");
  const data = document.getElementById("data");
  if (!data.value) data.value = new Date().toISOString().slice(0, 10);

  let finishedAt = "";

  function save() {
    const rec = { codigo: codigo.value.trim(), data: data.value, respostas: {} };
    allIds.forEach(id => rec.respostas[id] = val(id));
    OPEN.forEach(id => rec.respostas[id] = openEl(id).value);
    if (finishedAt) rec.horario = finishedAt;
    try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    return rec;
  }
  function load() {
    let rec = null;
    try { rec = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!rec) return;
    codigo.value = rec.codigo || "";
    if (rec.data) data.value = rec.data;
    if (rec.horario) finishedAt = rec.horario;
    OPEN.forEach(id => { if (rec.respostas && rec.respostas[id]) openEl(id).value = rec.respostas[id]; });
    allIds.forEach(id => {
      const v = (rec.respostas || {})[id];
      const r = v && form.querySelector('input[name="' + id + '"][value="' + v + '"]');
      if (r) {
        r.checked = true;
        showSel(r);
      }
    });
  }

  function progress() {
    let done = 0;
    allIds.forEach(id => {
      const ok = !!val(id);
      if (ok) done++;
      const fs = document.getElementById("item-" + id);
      fs.classList.toggle("answered", ok);
      if (ok) fs.classList.remove("missing");
    });
    document.getElementById("prog-text").textContent = L.msg.progress(done, allIds.length);
    document.getElementById("prog-bar").style.width = (done / allIds.length * 100) + "%";
    return done;
  }

  form.addEventListener("change", () => { progress(); save(); });
  codigo.addEventListener("input", save);
  data.addEventListener("change", save);
  OPEN.forEach(id => openEl(id).addEventListener("input", () => {
    if (openEl(id).value.trim()) openEl(id).closest(".q-open").classList.remove("empty");
    save();
  }));

  // Horário local de conclusão, no formato AAAA-MM-DD HH:MM:SS.
  function stamp() {
    const d = new Date(), z = n => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) + " " +
      z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds());
  }

  function finish() {
    finishedAt = stamp();
    const rec = save();
    send(rec);
    document.getElementById("missing-box").hidden = true;
    document.getElementById("finish").hidden = true;
    document.getElementById("done").hidden = false;
    document.getElementById("done").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const missing = allIds.filter(id => !val(id));
    if (!missing.length) return checkOpen();
    missing.forEach(id => document.getElementById("item-" + id).classList.add("missing"));
    document.getElementById("missing-title").textContent = L.msg.missing(missing.length);
    document.getElementById("missing-box").hidden = false;
    const first = document.getElementById("item-" + missing[0]);
    // Foco antes da rolagem: focar depois cancela o scroll suave no Chrome.
    first.querySelector("input").focus({ preventScroll: true });
    first.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  // Questões abertas são opcionais, mas pedimos confirmação (diálogo central) antes de concluir sem elas.
  const dialog = document.getElementById("open-dialog");
  let pendingEmpty = [];
  function backToOpen() {
    dialog.close();
    const first = openEl(pendingEmpty[0]);
    first.focus({ preventScroll: true });
    first.closest(".q-open").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.getElementById("open-dialog-back").addEventListener("click", backToOpen);
  document.getElementById("open-dialog-skip").addEventListener("click", () => { dialog.close(); finish(); });
  // Esc ou clique fora do cartão equivalem a voltar e responder.
  dialog.addEventListener("cancel", e => { e.preventDefault(); backToOpen(); });
  dialog.addEventListener("click", e => { if (e.target === dialog) backToOpen(); });

  function checkOpen() {
    const empty = OPEN.filter(id => !openEl(id).value.trim());
    if (!empty.length) return finish();
    pendingEmpty = empty;
    empty.forEach(id => openEl(id).closest(".q-open").classList.add("empty"));
    document.getElementById("open-dialog-count").textContent = L.msg.openCount(empty.length);
    dialog.showModal();
    document.getElementById("open-dialog-back").focus();
  }

  form.addEventListener("change", () => {
    if (allIds.every(id => val(id))) document.getElementById("missing-box").hidden = true;
  });

  document.getElementById("edit").addEventListener("click", () => {
    document.getElementById("done").hidden = true;
    document.getElementById("finish").hidden = false;
    document.getElementById("parte-tam").scrollIntoView({ behavior: "smooth" });
  });

  function columns(rec) {
    const cols = ["horario", "participante"].concat(allIds, OPEN);
    const row = [rec.horario || "", rec.codigo].concat(allIds.map(id => rec.respostas[id]), OPEN.map(id => rec.respostas[id]));
    return { cols, row };
  }

  // Envia ao Apps Script. text/plain evita a requisição prévia de CORS.
  async function send(rec) {
    const status = document.getElementById("send-status");
    if (!ENVIO_URL) { status.hidden = true; return; }
    const { cols, row } = columns(rec);
    const body = {};
    cols.forEach((c, i) => body[c] = row[i] == null ? "" : String(row[i]));
    body.idioma = EN ? "en" : "pt";
    const retry = document.getElementById("retry");
    retry.hidden = true;
    status.hidden = false;
    status.className = "send-status";
    status.textContent = L.msg.sending;
    try {
      const res = await fetch(ENVIO_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) });
      const out = await res.json();
      if (!out.ok) throw new Error(out.erro || "falha");
      status.className = "send-status ok";
      status.textContent = L.msg.sent;
    } catch (e) {
      status.className = "send-status fail";
      status.textContent = L.msg.failed;
      retry.hidden = false;
    }
  }

  document.getElementById("retry").addEventListener("click", () => send(save()));

  load();
  progress();
})();
