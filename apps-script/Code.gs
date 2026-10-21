/**
 * Recebe as respostas do questionário do Collab2Us, grava uma linha na planilha
 * e envia um e-mail com o results.csv.
 *
 * Funciona aberto pela planilha (Extensões → Apps Script) ou como projeto avulso em
 * script.google.com: nesse caso cria a planilha "Collab2Us · respostas do piloto" no
 * seu Drive na primeira execução. Instalação: veja apps-script/README.md.
 */

// Opcional: e-mail que recebe os avisos. Vazio = a conta que publicou o script.
var EMAIL = '';

// Ordem das colunas igual ao results.csv gerado pela página.
var COLUNAS = [
  'horario', 'participante',
  'PU1', 'PU2', 'PU3', 'PU4', 'PEOU1', 'PEOU2', 'PEOU3', 'PEOU4',
  'BI1', 'BI2', 'BI3', 'ENJ1', 'ENJ2', 'ENJ3',
  'SUS1', 'SUS2', 'SUS3', 'SUS4', 'SUS5', 'SUS6', 'SUS7', 'SUS8', 'SUS9', 'SUS10',
  'Q1', 'Q2', 'Q3',
  'idioma'
];
var ABA = 'results';
var NOME_PLANILHA = 'Collab2Us · respostas do piloto';

function doPost(e) {
  try {
    registrar(JSON.parse(e.postData.contents));
    return resposta({ ok: true });
  } catch (err) {
    console.error(err);
    return resposta({ ok: false, erro: String(err) });
  }
}

// Abrir a URL /exec no navegador mostra se a implantação está no ar.
function doGet() {
  return resposta({ ok: true, servico: 'Collab2Us questionário', planilha: planilha().getUrl() });
}

function registrar(dados) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var linha = COLUNAS.map(function (c) { return dados[c] == null ? '' : String(dados[c]); });
    var ss = planilha();
    var aba = ss.getSheetByName(ABA) || ss.insertSheet(ABA);
    if (aba.getLastRow() === 0) aba.appendRow(COLUNAS);
    // Planilhas criadas antes de uma coluna nova (ex.: idioma) recebem o cabeçalho completo.
    else if (aba.getRange(1, COLUNAS.length).getValue() === '') aba.getRange(1, 1, 1, COLUNAS.length).setValues([COLUNAS]);
    // Grava tudo como texto para a planilha não reinterpretar datas ou números.
    aba.getRange(aba.getLastRow() + 1, 1, 1, linha.length).setNumberFormat('@').setValues([linha]);
    enviarEmail(linha, dados.participante, ss.getUrl());
  } finally {
    lock.releaseLock();
  }
}

// Usa a planilha à qual o script está vinculado; se for avulso, cria uma e guarda o ID.
function planilha() {
  var ativa = SpreadsheetApp.getActiveSpreadsheet();
  if (ativa) return ativa;
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PLANILHA_ID');
  if (id) return SpreadsheetApp.openById(id);
  var nova = SpreadsheetApp.create(NOME_PLANILHA);
  props.setProperty('PLANILHA_ID', nova.getId());
  return nova;
}

function enviarEmail(linha, participante, urlPlanilha) {
  var destino = EMAIL || Session.getEffectiveUser().getEmail();
  if (!destino) throw new Error('Não foi possível descobrir o e-mail de destino. Preencha a variável EMAIL no topo do script.');
  var csv = '﻿' + [COLUNAS, linha].map(function (r) {
    return r.map(function (v) {
      return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(',');
  }).join('\r\n') + '\r\n';
  MailApp.sendEmail({
    to: destino,
    subject: 'Collab2Us · novo questionário (' + (participante || 'sem código') + ')',
    body: 'Novo questionário recebido em ' + linha[0] + '.\n\n' +
          'Participante: ' + (participante || 'sem código') + '\n' +
          'Planilha com todas as respostas: ' + urlPlanilha + '\n\n' +
          'O results.csv desta resposta está em anexo.',
    attachments: [Utilities.newBlob(csv, 'text/csv', 'results.csv')]
  });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Rode pelo editor para autorizar planilha e e-mail. Erros aparecem no registro de execução.
function testarEnvio() {
  registrar({ horario: 'TESTE', participante: 'TESTE' });
  console.log('Tudo certo. Planilha: ' + planilha().getUrl());
}
