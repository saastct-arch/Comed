# Clínica Comed

Landing page da Clínica Comed (Horto, Ipatinga/MG).

- `site/` é o site estático (um único `index.html` com CSS e JavaScript embutidos e as fotos em `site/img/`).
- `design-system/` guarda a proposta inicial de identidade, cores e textos.
- O site é publicado no GitHub Pages pelo workflow `.github/workflows/pages.yml` a cada alteração em `site/` na `main`.

## Publicar no Vercel

No painel do Vercel, em **Add New > Project**, importe este repositório. O arquivo `vercel.json` já aponta a saída para a pasta `site/` e não há build nem instalação. Sugestão de nome do projeto: `comed-ipatinga` (endereço `comed-ipatinga.vercel.app`).

## Publicar no GitHub Pages

Endereço: https://saastct-arch.github.io/Comed/ (em Settings > Pages, escolher Source: GitHub Actions).
