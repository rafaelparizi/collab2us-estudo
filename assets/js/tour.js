// Marcadores numerados sobre o print da tela inicial.
// x, y = posição do número; tx, ty = ponto para onde a seta aponta (pixels do print 1629x690).
(function () {
  const W = 1629, H = 690;
  const spots = [
    { x: 574,  y: 108, tx: 574,  ty: 58,  t: "Home", s: "Painel principal", d: "Painel principal: mostra o estado das integrações e os atalhos para iniciar o fluxo.", en: { t: "Home", d: "Main dashboard: shows the status of the integrations and shortcuts to start the flow.", s: "Main dashboard" } },
    { x: 647,  y: 108, tx: 647,  ty: 52,  t: "Boards", s: "Escolha dos quadros Miro e Trello", d: "Seleção do quadro Miro de origem, do quadro Trello de destino e da coluna do Kanban.", en: { t: "Boards", d: "Selects the source Miro board, the target Trello board and the Kanban column.", s: "Pick the Miro and Trello boards" } },
    { x: 744,  y: 108, tx: 744,  ty: 52,  t: "User Stories", s: "Editor com QUS, INVEST e IA", d: "Editor das histórias candidatas, com escore QUS e indicadores INVEST. Permite editar, reavaliar, pedir refinamento à IA e escolher o que exportar.", en: { t: "User Stories", d: "Editor for the candidate stories, with the QUS score and INVEST indicators. Lets you edit, re-assess, ask the AI for refinement and choose what to export.", s: "Editor with QUS, INVEST and AI" } },
    { x: 842,  y: 108, tx: 842,  ty: 52,  t: "Metrics", s: "Qualidade e operação", d: "Indicadores de qualidade das histórias e dados de operação da ferramenta.", en: { t: "Metrics", d: "Quality indicators for the stories and operational data for the tool.", s: "Quality and operations" } },
    { x: 930,  y: 108, tx: 930,  ty: 52,  t: "Workflow", s: "Fluxo do Miro ao Trello", d: "Visão do fluxo do Collab2Us, do workshop no Miro ao backlog no Trello.", en: { t: "Workflow", d: "Overview of the Collab2Us flow, from the Miro workshop to the Trello backlog.", s: "Flow from Miro to Trello" } },
    { x: 1031, y: 108, tx: 1031, ty: 52,  t: "References", s: "Fundamentos: QUS e INVEST", d: "Fundamentos usados pela ferramenta, como o framework QUS e os critérios INVEST.", en: { t: "References", d: "Foundations used by the tool, such as the QUS framework and the INVEST criteria.", s: "Foundations: QUS and INVEST" } },
    { x: 1451, y: 108, tx: 1451, ty: 58,  t: "Idioma", s: "Idioma da interface", d: "Alterna o idioma da interface.", en: { t: "Language", d: "Switches the interface language.", s: "Interface language" } },
    { x: 1585, y: 108, tx: 1518, ty: 54,  t: "Perfil", s: "Conta do usuário", d: "Conta do usuário conectado.", en: { t: "Profile", d: "Account of the signed-in user.", s: "User account" } },
    { x: 130,  y: 345, tx: 194,  ty: 345, t: "Miro Integration", d: "Status da conexão com o Miro. Em “Manage Miro” você informa a chave de API/token e autoriza os quadros do workshop.", en: { t: "Miro Integration", d: "Status of the Miro connection. In “Manage Miro” you enter the API key/token and authorize the workshop boards." } },
    { x: 795,  y: 250, tx: 795,  ty: 272, t: "Trello Backlog", d: "Status da conexão com o Trello. Em “Manage Trello” você configura o acesso ao backlog de destino.", en: { t: "Trello Backlog", d: "Status of the Trello connection. In “Manage Trello” you set up access to the target backlog." } },
    { x: 1500, y: 345, tx: 1396, ty: 345, t: "User Session", d: "Sessão do usuário, protegida por autenticação JWT. “View Settings” abre as configurações.", en: { t: "User Session", d: "User session, protected by JWT authentication. “View Settings” opens the settings." } },
    { x: 297,  y: 662, tx: 297,  ty: 610, t: "Select Boards", d: "Inicia uma nova sincronização: escolha dos quadros do Miro e do destino no Trello.", en: { t: "Select Boards", d: "Starts a new sync: choose the Miro boards and the Trello destination." } },
    { x: 449,  y: 662, tx: 449,  ty: 610, t: "Map Stories", d: "Lê notas e conectores do quadro e monta as histórias candidatas, usando as relações do grafo e a proximidade espacial.", en: { t: "Map Stories", d: "Reads the board’s notes and connectors and builds the candidate stories, using graph relations and spatial proximity." } },
    { x: 925,  y: 662, tx: 925,  ty: 610, t: "Metrics Dashboard", d: "Registros das exportações, taxa de sucesso do pipeline e membros ativos.", en: { t: "Metrics Dashboard", d: "Export logs, pipeline success rate and active members." } }
  ];

  // Página em inglês (html lang="en"): usa os textos de cada marcador em inglês.
  if (document.documentElement.lang.startsWith("en")) spots.forEach(s => Object.assign(s, { s: undefined }, s.en));

  const stage = document.querySelector(".tour-stage");
  if (!stage) return;
  const svg = stage.querySelector(".tour-arrows");
  const tip = document.getElementById("tour-tip");
  // Itens 1–8 (menu e barra superior) ao lado da figura; 9–14 (painel) abaixo.
  const legendSide = document.getElementById("tour-legend-side");
  const legendBelow = document.getElementById("tour-legend-below");
  const NS = "http://www.w3.org/2000/svg";
  let pinned = null;

  spots.forEach((s, i) => {
    const n = i + 1;
    const dx = s.tx - s.x, dy = s.ty - s.y, len = Math.hypot(dx, dy) || 1;
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", s.x + dx / len * 26);
    line.setAttribute("y1", s.y + dy / len * 26);
    line.setAttribute("x2", s.tx);
    line.setAttribute("y2", s.ty);
    line.setAttribute("marker-end", "url(#tour-head)");
    if (len > 30) svg.appendChild(line);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "tour-dot";
    dot.textContent = n;
    dot.style.left = (s.x / W * 100) + "%";
    dot.style.top = (s.y / H * 100) + "%";
    dot.setAttribute("aria-label", n + ". " + s.t + ": " + s.d);
    dot.setAttribute("aria-describedby", "tour-tip");
    stage.appendChild(dot);

    const li = document.createElement("li");
    li.innerHTML = '<span class="n">' + n + '</span><span><b></b> — <span class="d"></span></span>';
    li.querySelector("b").textContent = s.t;
    // Ao lado da figura vai a descrição curta; a completa aparece no tooltip.
    li.querySelector(".d").textContent = s.s || s.d;
    (i < 8 ? legendSide : legendBelow).appendChild(li);

    s.dot = dot; s.line = line; s.li = li;
    const show = () => activate(s);
    const hide = () => { if (pinned !== s) activate(pinned); };
    dot.addEventListener("mouseenter", show);
    dot.addEventListener("focus", show);
    dot.addEventListener("mouseleave", hide);
    dot.addEventListener("blur", hide);
    dot.addEventListener("click", () => { pinned = pinned === s ? null : s; activate(pinned || s); });
    li.addEventListener("mouseenter", show);
    li.addEventListener("mouseleave", hide);
    li.addEventListener("click", () => {
      pinned = s; activate(s);
      dot.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  });

  function activate(s) {
    spots.forEach(o => {
      const on = o === s;
      o.dot.classList.toggle("on", on);
      o.line.classList.toggle("on", on);
      o.li.classList.toggle("on", on);
    });
    if (!s) { tip.hidden = true; return; }
    tip.innerHTML = "<b></b><span></span>";
    tip.querySelector("b").textContent = s.dot.textContent + ". " + s.t;
    tip.querySelector("span").textContent = s.d;
    tip.hidden = false;
    const sw = stage.clientWidth, sh = stage.clientHeight;
    const px = s.x / W * sw, py = s.y / H * sh;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = Math.min(Math.max(px - tw / 2, 8), sw - tw - 8);
    let top = py + 22;
    if (top + th > sh - 4) top = py - th - 22;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  document.addEventListener("click", e => {
    if (!e.target.closest(".tour-dot, .tour-legend li")) { pinned = null; activate(null); }
  });
  window.addEventListener("resize", () => activate(pinned));
})();
