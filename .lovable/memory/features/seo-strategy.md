---
name: SEO Strategy - Goiânia Only with Service+Neighborhood combos
description: Site focused on Goiânia neighborhoods with automatic service+neighborhood combo pages
type: feature
---
- Foco exclusivo na cidade de Goiânia com atuação em bairros da capital
- Palavras-chave locais: "desentupidora no setor [nome]" e "[serviço]-[bairro]"
- Rotas: /:slug via DynamicSlugPage (resolve bairro ou serviço+bairro automaticamente)
- URL combos: /{service-slug}-{neighborhood-slug} (ex: hidrojateamento-village-atalaia)
- Todas as páginas seguem o padrão do site de referência desentupidoras.goiania.br
- Estrutura padronizada: hero, serviços, outros serviços, CTA banners, vantagens, por que escolher, FAQ, depoimentos, contato, lista de bairros
- Cada página adaptada apenas no nome do bairro/serviço, mantendo conteúdo fiel ao modelo
- ServiceCard nas páginas de bairro linka para /{service-slug}-{neighborhood-slug}
- Lista de bairros nas páginas combo linka para /{service-slug}-{other-neighborhood-slug}
