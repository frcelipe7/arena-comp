/**
 * Arena Comp 2026 — lista as fotos da galeria guardadas no Google Drive.
 *
 * Sem este script, o site mostra as fotos que estavam no Drive no momento do
 * último `npm run build`. Com ele publicado, fotos novas aparecem no site em
 * até ~2 minutos, SEM novo build (o Drive não deixa o navegador listar a pasta
 * diretamente; este script faz isso pela sua conta e devolve um JSON).
 *
 * COMO PUBLICAR (uma única vez, ~2 minutos):
 *  1. Acesse https://script.google.com → "Novo projeto", apague o conteúdo e cole este arquivo.
 *  2. PASTA_RAIZ_ID já está preenchido com a pasta "ArenaComp".
 *  3. Clique em "Implantar" → "Nova implantação" → engrenagem → "App da Web":
 *       Executar como: Eu
 *       Quem pode acessar: Qualquer pessoa
 *     Clique em "Implantar" e autorize o acesso ao Drive quando o Google pedir
 *     (em "Google hasn't verified this app": Avançado → Acessar projeto).
 *  4. Copie a URL que termina em /exec e cole em galleryDriveEndpoint
 *     (src/data/gallery.ts). Faça um novo build só desta vez.
 *
 * Legenda: preencha a "Descrição" do arquivo no Drive (botão direito →
 * Informações do arquivo → Descrição). Ela vira a legenda e o texto alternativo.
 *
 * Se mudar o código depois: "Implantar" → "Gerenciar implantações" → editar
 * → Versão: "Nova versão". A URL continua a mesma.
 */

// Pasta "ArenaComp" no Drive.
const PASTA_RAIZ_ID = '1qbHoemlg6zBQuwaGyO6WBQk-NDZhC3iR';

// A lista fica em cache por alguns minutos para responder rápido.
const CACHE_SEGUNDOS = 120;

function doGet(e) {
  const cache = CacheService.getScriptCache();
  const forcar = e && e.parameter && e.parameter.atualizar;
  if (!forcar) {
    const emCache = cache.get('galeria');
    if (emCache) return responder(emCache);
  }

  const fotos = [];
  varrer(DriveApp.getFolderById(PASTA_RAIZ_ID), [], fotos);
  fotos.sort(function (a, b) {
    return a.pasta === b.pasta ? a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true }) : a.pasta.localeCompare(b.pasta);
  });

  const corpo = JSON.stringify({ atualizadoEm: new Date().toISOString(), total: fotos.length, fotos: fotos });
  try {
    cache.put('galeria', corpo, CACHE_SEGUNDOS);
  } catch (err) {
    // Cache aceita até 100 KB; acima disso o script só responde sem cache.
  }
  return responder(corpo);
}

function varrer(pasta, caminho, fotos) {
  const arquivos = pasta.getFiles();
  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    if (arquivo.isTrashed() || !/^image\//.test(arquivo.getMimeType())) continue;
    fotos.push({
      id: arquivo.getId(),
      nome: arquivo.getName(),
      pasta: caminho.join('/'),
      descricao: arquivo.getDescription() || '',
      criadoEm: arquivo.getDateCreated().toISOString(),
    });
  }
  const subpastas = pasta.getFolders();
  while (subpastas.hasNext()) {
    const sub = subpastas.next();
    if (sub.isTrashed()) continue;
    varrer(sub, caminho.concat(sub.getName()), fotos);
  }
}

function responder(corpo) {
  return ContentService.createTextOutput(corpo).setMimeType(ContentService.MimeType.JSON);
}
