# Project Memory

## Core
Design: azul escuro primary + laranja accent/cta + verde whatsapp. Fonts: Montserrat display, Inter body.
Projeto de SEO programático para desentupidora focado EXCLUSIVAMENTE em Goiânia e bairros.
Backend: Lovable Cloud com tabelas: services, neighborhoods, blog_posts, site_settings.
Rotas: /:slug (smart router resolve bairro ou serviço+bairro). Sem páginas de cidade.
Layout segue padrão idêntico ao site de referência desentupidoras.goiania.br.
Admin: /admin com login por auth, sidebar com módulos de CRUD + bulk import.
RLS: leitura pública, escrita para authenticated.

## Memories
- [Estratégia SEO](mem://features/seo-strategy) — Foco em Goiânia, palavras-chave "desentupidora no setor [nome]" e "serviço+bairro"
