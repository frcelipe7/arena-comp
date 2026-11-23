/**
 * Arena Comp 2026 — mantém a aba "Galeria" da planilha de pontuação sempre
 * atualizada com as fotos da pasta "ArenaComp" do Google Drive.
 *
 * O site (hospedado pela universidade) lê essa aba direto do navegador, do
 * mesmo jeito que lê o placar. Assim, foto colocada no Drive aparece no site
 * sozinha, em até ~5 minutos, sem novo build e sem acesso ao servidor.
 *
 * INSTALAÇÃO (uma única vez, pela conta dona da planilha):
 *  1. Abra a planilha de pontuação → menu "Extensões" → "Apps Script".
 *  2. Apague o conteúdo do editor, cole este arquivo e clique em "Salvar" (ícone de disquete).
 *  3. No seletor de função (ao lado de "Depurar"), escolha "instalar" e clique em "Executar".
 *  4. O Google vai pedir autorização: "Revisar permissões" → escolha sua conta →
 *     (se aparecer "O Google não verificou este app": "Avançado" → "Acessar ...") → "Permitir".
 *  5. Pronto: a aba "Galeria" é criada e preenchida, e passa a se atualizar a cada 5 minutos.
 *
 * Depois disso não é preciso fazer mais nada. Na planilha aparece o menu
 * "Arena Comp" → "Atualizar galeria agora", para forçar a atualização na hora.
 *
 * Requisitos: a pasta do Drive e a planilha continuam compartilhadas como
 * "Qualquer pessoa com o link: Leitor". Não renomeie a aba "Galeria".
 *
 * Legenda das fotos: preencha a "Descrição" do arquivo no Drive
 * (botão direito → Informações do arquivo → Descrição).
 */

// Pasta "ArenaComp" no Drive.
const PASTA_RAIZ_ID = '1qbHoemlg6zBQuwaGyO6WBQk-NDZhC3iR';
const ABA = 'Galeria';
const INTERVALO_MINUTOS = 5;
const CABECALHO = ['id', 'nome', 'pasta', 'descricao', 'criadoEm'];

/** Executar uma vez: cria a aba, preenche e agenda a atualização automática. */
function instalar() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'atualizarGaleria'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('atualizarGaleria').timeBased().everyMinutes(INTERVALO_MINUTOS).create();
  const total = atualizarGaleria();
  SpreadsheetApp.getActive().toast(
    'Galeria instalada: ' + total + ' foto(s). Atualização automática a cada ' + INTERVALO_MINUTOS + ' minutos.',
    'Arena Comp', 10
  );
}

/** Lê a pasta do Drive (com subpastas) e reescreve a aba "Galeria". */
function atualizarGaleria() {
  const fotos = [];
  varrer(DriveApp.getFolderById(PASTA_RAIZ_ID), [], fotos);
  fotos.sort(function (a, b) {
    return a[2] === b[2] ? a[1].localeCompare(b[1], 'pt-BR', { numeric: true }) : a[2].localeCompare(b[2]);
  });

  const planilha = SpreadsheetApp.getActive();
  const aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
  const linhas = [CABECALHO].concat(fotos);

  aba.clearContents();
  aba.getRange(1, 1, linhas.length, CABECALHO.length).setNumberFormat('@').setValues(linhas);
  aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
  aba.getRange(1, CABECALHO.length + 2).setValue('Atualizado em ' + Utilities.formatDate(new Date(), 'America/Belem', 'dd/MM/yyyy HH:mm'));
  return fotos.length;
}

function varrer(pasta, caminho, fotos) {
  const arquivos = pasta.getFiles();
  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    if (arquivo.isTrashed() || !/^image\//.test(arquivo.getMimeType())) continue;
    fotos.push([
      arquivo.getId(),
      arquivo.getName(),
      caminho.join('/'),
      arquivo.getDescription() || '',
      arquivo.getDateCreated().toISOString(),
    ]);
  }
  const subpastas = pasta.getFolders();
  while (subpastas.hasNext()) {
    const sub = subpastas.next();
    if (!sub.isTrashed()) varrer(sub, caminho.concat(sub.getName()), fotos);
  }
}

/** Menu na planilha para atualizar na hora. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Arena Comp')
    .addItem('Atualizar galeria agora', 'atualizarComAviso')
    .addToUi();
}

function atualizarComAviso() {
  const total = atualizarGaleria();
  SpreadsheetApp.getActive().toast('Galeria atualizada: ' + total + ' foto(s).', 'Arena Comp', 5);
}
