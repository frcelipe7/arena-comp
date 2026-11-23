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

### Fotos da galeria (Google Drive) — atualização automática

As fotos ficam na pasta **ArenaComp** do Google Drive (pública para leitura), nas subpastas `03-dezembro`, `04-dezembro`, `algoritmo-natural`, `maratona-programacao`, `perguntas-respostas`, `robotica`, `premiacao`, `bastidores` e `equipes/<equipe>`.

**Como as fotos chegam ao site, sem novo build e sem acesso ao servidor:**

```
Drive (pasta ArenaComp) ──a cada 5 min──▶ Planilha, aba "Galeria" ──navegador──▶ site
        script da planilha (deploy/planilha-galeria.gs)       (a cada 3 min com a página aberta)
```

**Instalação (uma única vez, pela conta dona da planilha):**

1. Abra a planilha de pontuação → **Extensões → Apps Script**.
2. Apague o conteúdo, cole [`deploy/planilha-galeria.gs`](deploy/planilha-galeria.gs) e salve.
3. Selecione a função **`instalar`** e clique em **Executar**. Autorize o acesso (em "O Google não verificou este app": Avançado → Acessar).
4. A aba **Galeria** é criada e passa a se atualizar sozinha a cada 5 minutos. Na planilha surge o menu **Arena Comp → Atualizar galeria agora**.

**Regras para tudo continuar funcionando:** não renomear a aba `Galeria` nem a aba `Página1`; manter a planilha e a pasta do Drive como "Qualquer pessoa com o link: Leitor".

**Filtros:** a pasta define onde a foto aparece. `03-dezembro`/`04-dezembro` vão para o filtro do dia; Algoritmo Natural conta no dia 03; Perguntas e Respostas, Robótica e Premiação no dia 04; Maratona nos dois dias; `equipes/<equipe>` em Equipes com o nome da equipe. A **Descrição** do arquivo no Drive vira a legenda.

O site usa versões redimensionadas pelo Google (900 px no grid, 2000 px no visualizador) e baixa o original nos downloads. Se a aba `Galeria` não existir, o site mostra as fotos lidas no último `npm run build` (`scripts/galeria-drive.mjs`).

Fotos também podem ser colocadas no próprio site (`public/images/gallery/`, rode `npm run galeria:otimizar` e registre em `src/data/gallery.ts`); elas aparecem junto com as do Drive.

## Identidade visual

- Logotipo e mascote: `public/brand/*.webp`, já no tamanho de uso. Os PNGs originais em alta ficam em `assets-src/` (recortados da arte original `public/references/logo-mascote.jpeg` e do PDF de divulgação, sem redesenho).
- Cores: azul-marinho `#022442` (logo), dourado `#F5B623`, papel `#F1E5C9` (arte de divulgação). Tokens em `src/app/globals.css`.
- Tipografia: Poppins, a mesma da arte de divulgação.

## Documentos

- `public/docs/regimento-arena-comp-2026.pdf`: regimento oficial (traz as datas originais; o portal sinaliza a atualização para 03 e 04/12).
- `public/docs/gincana-arena-comp-2026.pdf`: arte de divulgação.
