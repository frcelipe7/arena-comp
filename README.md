# Portal Arena Comp 2026

Portal de informações da Arena Comp 2026, gincana do curso de Engenharia de Software da UEPA, Campus Parauapebas.

Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis e Lucide.

## Rodar e publicar

O site é **100% estático**: o build gera a pasta **`out/`** (HTML, CSS, JS, imagens e PDFs), pronta para qualquer servidor web, como o `build/` de um projeto React.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # baixa a planilha de pontuação e gera a pasta out/
npm run preview    # (opcional) testa out/ em http://localhost:3000/arena-comp/
```

**Publicar na VPS:** o build sai preparado para a subpasta **`/arena-comp`** (https://feliperaphael.com.br/arena-comp). Para publicar na raiz de um domínio, gere com `PUBLIC_BASE_PATH="" npm run build`.

1. Copie o **conteúdo** de `out/` para `/var/www/feliperaphael.com.br/arena-comp/` na VPS (apague a versão anterior antes).
2. Cole os blocos de [`deploy/nginx-arena-comp.conf`](deploy/nginx-arena-comp.conf) dentro do `server` com `listen 443 ssl`.
3. `sudo nginx -t && sudo systemctl reload nginx`.

Defina `NEXT_PUBLIC_SITE_URL` (padrão `https://feliperaphael.com.br`) se o domínio mudar.

Só é preciso refazer o build quando mudar conteúdo (equipes, textos, fotos). O placar **não** precisa de novo build: ele é atualizado pela planilha direto no navegador.

## Rotas

`/` · `/cronograma` · `/equipes` · `/desafios` · `/desafios/algoritmo-natural` · `/desafios/maratona` · `/desafios/perguntas-e-respostas` · `/desafios/robotica` · `/pontuacao` · `/regulamento` · `/faq` · `/galeria`

## Atualizar o conteúdo (sem mexer no visual)

Todo o conteúdo fica em `src/data/`:

| Arquivo | O que atualizar |
| --- | --- |
| `teams.ts` | `leader`, `viceLeader` e `members` de cada equipe. Vazios = aviso "será divulgada". |
| `schedule.ts` | Horários do dia 03 (hoje `time: null`, `status: "pendente"`) e da final da Maratona. |
| `results.ts` | Reserva manual do placar, usada só se a planilha não tiver pontos. |
| `gallery.ts` | Registros das fotos (veja abaixo). |
| `faq.ts` | Perguntas e respostas. |
| `challenges.ts`, `scoring.ts`, `rules.ts` | Regras do regimento. |
| `event.ts` | Datas, local, documentos e menu. |

### Fotos da galeria (Google Drive)

As fotos ficam na pasta **ArenaComp** do Google Drive (pública para leitura), com as subpastas `03-dezembro`, `04-dezembro`, `algoritmo-natural`, `maratona-programacao`, `perguntas-respostas`, `robotica`, `premiacao`, `bastidores` e `equipes/<equipe>`.

**Como as fotos chegam ao site:**

1. **No build (automático):** `npm run build` roda `scripts/galeria-drive.mjs`, que lê a pasta pública e grava a lista em `src/data/galeria-drive.json`. Toda publicação já sai com as fotos que estiverem no Drive. Para conferir sem buildar: `npm run galeria:drive -- --ver`.
2. **Ao vivo (opcional, recomendado durante o evento):** publique o Apps Script [`deploy/galeria-apps-script.gs`](deploy/galeria-apps-script.gs) (o ID da pasta já está preenchido; instruções no topo do arquivo) e cole a URL `/exec` em `galleryDriveEndpoint` (`src/data/gallery.ts`). Depois de um build com a URL, fotos novas aparecem em até ~2 minutos **sem novo build**, e a **Descrição** do arquivo no Drive vira a legenda.

**Filtros:** a pasta define onde a foto aparece. `03-dezembro`/`04-dezembro` vão para o filtro do dia; Algoritmo Natural conta no dia 03; Perguntas e Respostas, Robótica e Premiação no dia 04; Maratona nos dois dias; `equipes/<equipe>` em Equipes com o nome da equipe.

O site usa versões redimensionadas pelo Google (900 px no grid, 2000 px no visualizador), então pode subir as fotos originais.

Fotos também podem ser colocadas no próprio site (`public/images/gallery/`, rode `npm run galeria:otimizar` e registre em `src/data/gallery.ts`); elas aparecem junto com as do Drive.

## Identidade visual

- Logotipo e mascote: `public/brand/*.webp`, já no tamanho de uso. Os PNGs originais em alta ficam em `assets-src/` (recortados da arte original `public/references/logo-mascote.jpeg` e do PDF de divulgação, sem redesenho).
- Cores: azul-marinho `#022442` (logo), dourado `#F5B623`, papel `#F1E5C9` (arte de divulgação). Tokens em `src/app/globals.css`.
- Tipografia: Poppins, a mesma da arte de divulgação.

## Documentos

- `public/docs/regimento-arena-comp-2026.pdf`: regimento oficial (traz as datas originais; o portal sinaliza a atualização para 03 e 04/12).
- `public/docs/gincana-arena-comp-2026.pdf`: arte de divulgação.
