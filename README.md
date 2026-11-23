# Portal Arena Comp 2026

Site oficial da Arena Comp 2026, gincana do curso de Engenharia de Software da UEPA, Campus Parauapebas.

O site é **estático**: só arquivos HTML, CSS, JavaScript, imagens e PDFs. **Não usa banco de dados, PHP, Node.js nem nenhum programa rodando no servidor.** Basta um servidor web comum (Nginx, Apache, IIS etc.).

---

## ✅ O build já está pronto

**Não é preciso instalar nem compilar nada.** O site pronto para publicar está na pasta:

```
site-pronto/arena-comp/
```

(O mesmo conteúdo também pode ser enviado compactado como `arena-comp-site.zip`.)

---

## Como colocar o site no ar

### 1. Copie os arquivos

Pegue a pasta **`site-pronto/arena-comp`** (ou descompacte o `arena-comp-site.zip`, que contém a mesma pasta `arena-comp`).

Coloque a pasta `arena-comp` **dentro da pasta pública do servidor web** (a mesma pasta onde fica o `index.html` do site principal). Exemplos:

| Servidor | Onde colocar |
| --- | --- |
| Nginx (padrão) | `/var/www/html/arena-comp/` |
| Apache (padrão) | `/var/www/html/arena-comp/` |
| Hospedagem com painel (cPanel etc.) | `public_html/arena-comp/` |

Confira se ficou assim (o `index.html` precisa estar **direto** dentro de `arena-comp`):

```
pasta-publica-do-servidor/
└── arena-comp/
    ├── index.html
    ├── 404.html
    ├── _next/
    ├── brand/
    ├── docs/
    ├── cronograma/
    ├── equipes/
    └── ...
```

### 2. Acesse

Abra no navegador: **`https://SEU-DOMINIO/arena-comp/`**

Pronto. Na maioria dos servidores não é preciso configurar mais nada.

> **Importante:** o site foi preparado para funcionar no endereço **`/arena-comp/`**. Se ele for colocado em outro endereço (por exemplo, na raiz de um domínio ou em `/arenacomp`), as páginas abrem sem estilo. Nesse caso, peça um novo pacote informando o endereço final (veja "Gerar um novo pacote", mais abaixo).

### 3. Só se precisar: configuração do Nginx

Se o servidor já tiver uma regra que redireciona tudo para o `index.html` do site principal (comum em sites feitos com React/Vue), o portal pode abrir em branco. Para resolver, acrescente dentro do bloco `server { ... }` do site, **antes** do `location /`:

```nginx
location = /arena-comp {
    return 301 /arena-comp/;
}

location ^~ /arena-comp/ {
    try_files $uri $uri/ =404;
    error_page 404 /arena-comp/404.html;
}

location ^~ /arena-comp/_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Depois, teste e recarregue o Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Se a pasta `arena-comp` ficar **fora** da pasta pública do site, adicione `alias` com o caminho dela nos dois últimos blocos (com a barra no final). Exemplo:

```nginx
location ^~ /arena-comp/ {
    alias /var/www/outra-pasta/arena-comp/;
    try_files $uri $uri/ =404;
    error_page 404 /arena-comp/404.html;
}
```

### Como saber se deu certo

- `https://SEU-DOMINIO/arena-comp/` abre a página inicial colorida, com o mascote.
- Os menus (Cronograma, Equipes, Desafios…) abrem normalmente.
- O link "Baixar regimento (PDF)" baixa o arquivo.

Se a página abrir **sem cores/estilo**, os arquivos estão num endereço diferente de `/arena-comp/` ou alguma regra do servidor está desviando os arquivos `.js` e `.css` (veja o passo 3).

---

## O que se atualiza sozinho

O servidor **não precisa ser mexido** durante o evento. Duas partes do site são atualizadas direto pelo Google, no navegador de quem acessa:

- **Placar:** lido da planilha de pontuação (aba `Página1`), a cada 60 segundos.
- **Galeria de fotos:** as fotos colocadas na pasta **ArenaComp** do Google Drive aparecem no site em até ~8 minutos.

Isso depende apenas de a planilha e a pasta do Drive continuarem compartilhadas como **"Qualquer pessoa com o link: Leitor"**.

---

## Para quem mantém o projeto

### Requisitos

Node.js 20 ou superior.

```bash
npm install
npm run dev        # desenvolvimento: http://localhost:3000/arena-comp/
npm run build      # gera a pasta out/ (baixa antes a planilha e a lista de fotos)
npm run preview    # testa a pasta out/ em http://localhost:3000/arena-comp/
```

### Gerar um novo pacote

1. `npm run build` (gera a pasta `out/`).
2. Substitua o conteúdo de `site-pronto/arena-comp/` pelo conteúdo de `out/`.
3. Se for enviar compactado: gere `arena-comp-site.zip` com `site-pronto/LEIA-ME.txt` e a pasta `arena-comp`.

Para outro endereço de publicação, defina a subpasta no build:

```bash
PUBLIC_BASE_PATH="/outro-caminho" npm run build   # https://dominio/outro-caminho/
PUBLIC_BASE_PATH="" npm run build                 # raiz do domínio
```

Os metadados de compartilhamento usam `https://feliperaphael.com.br`; para outro domínio, defina `NEXT_PUBLIC_SITE_URL`.

### Placar (Google Sheets)

Planilha de pontuação, aba **`Página1`**, tabela com as colunas `Equipes`, `Algoritmo`, `Maratona`, `Torta na Cara`, `Robótica`, `Bônus` e `Total`. Os valores são **pontos** (100, 80, 60…); célula vazia significa "ainda não lançado". A equipe pode ser escrita pelo nome (Pressman) ou pela cor (Azul).

`npm run pontuacao -- --ver` mostra o que o site está lendo.

### Galeria (Google Drive + Google Sheets)

```
Pasta ArenaComp no Drive ──a cada 5 min──▶ aba "Galeria" da planilha ──▶ site
          script da planilha (deploy/planilha-galeria.gs)
```

Subpastas do Drive: `03-dezembro`, `04-dezembro`, `algoritmo-natural`, `maratona-programacao`, `perguntas-respostas`, `robotica`, `premiacao`, `bastidores` e `equipes/<equipe>` (`pressman`, `turing`, `sommerville`, `kurose`, `ada`, `grace`). A pasta define o filtro em que a foto aparece; a **Descrição** do arquivo no Drive vira a legenda.

**Instalação do script (uma vez, pela conta dona da planilha):**

1. Planilha de pontuação → **Extensões → Apps Script**.
2. Cole o conteúdo de [`deploy/planilha-galeria.gs`](deploy/planilha-galeria.gs) e salve.
3. Selecione a função **`instalar`** → **Executar** → autorize (em "O Google não verificou este app": Avançado → Acessar).

A aba **Galeria** passa a se atualizar sozinha a cada 5 minutos; o menu **Arena Comp → Atualizar galeria agora** força a atualização. Não renomeie as abas `Galeria` e `Página1`.

### Onde mudar o conteúdo

Tudo em `src/data/`, sem mexer no visual:

| Arquivo | Conteúdo |
| --- | --- |
| `teams.ts` | Equipes, líderes, vice-líderes e integrantes |
| `schedule.ts` | Cronograma dos dois dias |
| `challenges.ts` | Regras e critérios de cada desafio |
| `scoring.ts` | Pontos por colocação, bônus, desempate e nota extra |
| `faq.ts` | Perguntas frequentes |
| `rules.ts` | Regulamento por capítulo |
| `event.ts` | Datas, local, documentos e menu |
| `results.ts` | Placar manual (usado só se a planilha não tiver pontos) |

Depois de alterar, gere um novo pacote.

### Estrutura

```
src/app/          páginas (rotas)
src/components/   componentes visuais
src/data/         conteúdo do site
src/lib/          leitura da planilha/Drive, placar, downloads
public/           imagens (brand/), PDFs (docs/) e imagem de compartilhamento
scripts/          leitura da planilha e do Drive no build; preview local
deploy/           script da planilha (galeria) e exemplo de Nginx
site-pronto/      build pronto para publicar (pasta arena-comp + LEIA-ME.txt)
assets-src/       artes originais em alta resolução (não vão para o site)
```

Tecnologias: Next.js 15 (exportação estática), TypeScript, Tailwind CSS 4, GSAP, Lenis, Lucide e fflate.
