# Clínica Comed

Landing page da Clínica Comed (Horto, Ipatinga/MG).

- `site/` é o site estático (um único `index.html` com CSS e JavaScript embutidos e as fotos em `site/img/`).
- `design-system/` guarda a proposta inicial de identidade, cores e textos.
- O site é publicado no GitHub Pages pelo workflow `.github/workflows/pages.yml` a cada alteração em `site/` na `main`.

## Ícones e arte do link preview

`node tools/make_assets.js` gera os favicons, os ícones do app, a imagem de compartilhamento (`site/og/og-home.jpg`), o manifesto, o `robots.txt` e o `sitemap.xml`. Os endereços absolutos usam `https://comed-ipatinga.vercel.app`. Se o domínio for outro, troque `BASE` em `tools/make_assets.js` e os endereços em `site/index.html` (canonical, `og:` e dados estruturados), e rode o comando de novo.

## Publicar no Vercel

No painel do Vercel, em **Add New > Project**, importe este repositório. O arquivo `vercel.json` já aponta a saída para a pasta `site/` e não há build nem instalação. Sugestão de nome do projeto: `comed-ipatinga` (endereço `comed-ipatinga.vercel.app`).

## Publicar no GitHub Pages

Endereço: https://saastct-arch.github.io/Comed/ (em Settings > Pages, escolher Source: GitHub Actions).
