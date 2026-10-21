# Envio automático das respostas (Google Apps Script)

O questionário envia cada resposta concluída para um Apps Script na sua conta Google.
O script grava uma linha na aba `results` da planilha e manda um e-mail com um `results.csv` em anexo
para a conta que publicou o script. O endereço não aparece no código público da página.

## Instalação

1. Acesse https://script.google.com e clique em **Novo projeto**.
   (Também funciona abrindo **Extensões → Apps Script** a partir de uma planilha.)
2. Apague o conteúdo de `Código.gs`, cole o conteúdo de [`Code.gs`](Code.gs) e salve (Ctrl/Cmd + S).
3. Na barra superior, escolha a função **`testarEnvio`** e clique em **Executar**.
   - Em "Autorização necessária", clique em **Revisar permissões** e escolha sua conta.
   - Se aparecer "O Google não verificou este app", clique em **Avançado → Acessar … (não seguro)**.
     O app é seu; o aviso aparece para todo script pessoal.
   - Confira o **Registro de execução**: deve terminar com `Tudo certo. Planilha: …`.
   - Deve chegar um e-mail de teste. Abra a planilha pelo link e apague a linha `TESTE`.
4. Clique em **Implantar → Nova implantação**, na engrenagem escolha **App da Web** e defina:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa** (não "Qualquer pessoa com Conta do Google")
5. Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
6. Abra essa URL no navegador: deve aparecer `{"ok":true, …}` com o link da planilha.
   Envie a URL para colocarmos em `assets/js/questionario.js` (`ENVIO_URL`).

Se alterar o código depois: **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**.
Salvar o código não basta; a URL `/exec` continua usando a versão implantada.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Erro no registro ao rodar `testarEnvio` | Leia a mensagem; se for de e-mail, preencha `EMAIL` no topo do script |
| Abrir a URL `/exec` pede login | Acesso definido como "Qualquer pessoa com Conta do Google"; troque para "Qualquer pessoa" |
| A página mostra "Não foi possível enviar" | Implantação antiga (publique uma nova versão) ou URL errada (use a que termina em `/exec`, não `/dev`) |

O participante não baixa as respostas. Se o envio falhar, a página mostra o botão "Tentar enviar novamente"; as respostas ficam salvas no navegador até o envio dar certo.
A URL `/exec` aceita envios de qualquer pessoa que a conheça; uma linha estranha na planilha pode ser apagada.
