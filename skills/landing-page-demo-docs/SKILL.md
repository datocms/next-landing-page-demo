---
name: landing-page-demo-docs
description: >-
  Use for documentation-area work in the DatoCMS landing page demo starter:
  documentation home, documentation pages, docs tree structure, docs sidebar,
  highlighted docs pages, docs page Structured Text rendering, docs metadata,
  and /docs routes. Handles Documentation Home, Documentation Page,
  app/[locale]/(docs-layout)/**, components/DocumentationSidebarItem/**,
  components/FeaturedDocumentationPages/**, components/DatoStructuredText/**,
  QuoteBlock, and docs code/quote rendering. Do not use for regular marketing
  page sections, shared header/footer/layout, blog/pricing/testimonial/changelog
  content records, new non-docs routes, or generic DatoCMS schema work.
---

# Landing Page Demo Docs

Use this for the documentation surface in the landing page starter. Docs are a separate route group with a docs home singleton, tree records, sidebar rendering, and Structured Text rules.

## Prerequisites

Before schema or content operations:

- Confirm the shared DatoCMS `agent-skills` plugin is available. If it is missing, ask whether the user already has it installed; if not, request installation before continuing.
- Expect the DatoCMS MCP to be installed and running. If live schema or content facts are needed and MCP is unavailable, pause and ask the user to install or start it.
- Inspect live schema/content through MCP before assuming API keys, localized fields, validators, singleton records, or tree structure.

## Existing docs structure

- Docs home singleton: `documentation_home`.
- Docs page tree type: `documentation_page`.
- Docs home route: `app/[locale]/(docs-layout)/docs/`.
- Docs page route: `app/[locale]/(docs-layout)/docs/[slug]/`.
- Docs shell query and sidebar: `app/[locale]/(docs-layout)/query.graphql`.
- Sidebar renderer: `components/DocumentationSidebarItem/**`.
- Featured docs cards: `components/FeaturedDocumentationPages/**`.
- Structured Text renderer: `components/DatoStructuredText/**`, with docs-specific rules in the docs page `Content.tsx`.

## Common workflows

### Add or edit docs pages

1. Confirm the request is docs-specific, not a regular marketing page or blog post.
2. Inspect `documentation_page` fields and the existing tree through MCP.
3. Create or update the docs page through the shared DatoCMS skills or MCP.
4. Set parent/child placement when the user asks for sidebar hierarchy.
5. Preserve existing slugs unless the user explicitly requests a URL change.
6. Publish the record if the docs page should be public.
7. Verify `/docs/[slug]`, metadata, and sidebar active state.

### Change docs home

1. Inspect the `documentation_home` singleton through MCP.
2. Update title, subheader, logo, footer text, or highlighted pages as requested.
3. Keep highlighted pages linked to valid `documentation_page` records.
4. Publish the singleton if the change should be public.
5. Verify `/docs` and featured docs cards.

### Change docs rendering

1. Inspect the existing docs content shape and route component before changing rendering.
2. Update `DatoStructuredText` usage or docs-specific node rules only for the requested behavior.
3. Preserve headings, paragraphs, lists, quotes, code blocks, and sidebar behavior.
4. Regenerate GraphQL types after query changes.
5. Verify a docs page with representative Structured Text.

## Guardrails

- Regular page sections belong to `landing-page-demo-sections`.
- Shared header, footer, navigation, notification, logo, social links, and accent color belong to `landing-page-demo-layout`.
- Posts, authors, tags, testimonials, pricing tiers, changelog entries, and legal pages belong to `landing-page-demo-content-records`.
- New non-docs routes, preview links, and SEO-analysis mapping belong to `landing-page-demo-routing-preview`.
- Do not flatten the docs tree unless the user explicitly asks for a structure change.

## Acceptance criteria

- Docs home renders correctly.
- Docs sidebar reflects the record tree.
- Docs page routes resolve by slug.
- Structured Text still handles headings, paragraphs, lists, quotes, and code blocks.
- Featured docs cards link to valid docs pages.
- Metadata, GraphQL type generation, and build pass after code changes.
