---
name: landing-page-demo-routing-preview
description: >-
  Use for route-level infrastructure in the DatoCMS landing page demo starter:
  adding or changing record-backed routes, static params, metadata, draft/live
  preview wrappers, Web Previews URL mapping, SEO-analysis route mapping, and
  route-aware cache/draft behavior. Covers app/[locale]/(common-layout)/**,
  app/[locale]/(docs-layout)/**, lib/datocms/**,
  app/api/draft/preview-links/route.tsx, app/api/seoAnalysis/route.tsx, and
  route meta.ts/page.tsx/Content.tsx/RealTime.tsx files. Do not use for
  ordinary page section edits, shared layout content, docs content edits,
  existing content record changes, or generic Next.js routing outside this
  starter.
---

# Landing Page Demo Routing and Preview

Use this for route infrastructure, preview-link mapping, SEO-analysis mapping, metadata, static params, and draft/live preview behavior in the landing page starter.

## Prerequisites

Before schema or content operations:

- Confirm the shared DatoCMS `agent-skills` plugin is available. If it is missing, ask whether the user already has it installed; if not, request installation before continuing.
- Expect the DatoCMS MCP to be installed and running. If live schema or content facts are needed and MCP is unavailable, pause and ask the user to install or start it.
- Inspect live schema/content through MCP before assuming API keys, slug fields, localized fields, draft status, SEO fields, or singleton records.

## Existing route pattern

Record-backed route folders normally contain:

- `meta.ts` for the route query (a gql.tada `graphql()` document composed from component fragments), its `Query`/`Variables` types, and page prop types.
- `page.tsx` for variables (`buildVariables`), metadata (`generateMetadataFn`), static params (with their own small query) when needed, and `generatePageComponent`.
- `Content.tsx` for regular rendering.
- `RealTime.tsx` for draft/live preview rendering (`generateRealtimeComponent`).

The generators live in `lib/datocms/`: `realtime/generatePageComponent.tsx` and `realtime/generateRealtimeComponent.tsx` render `Content` or `RealTime` depending on Draft Mode, `generateMetadataFn.ts` turns `_seoMetaTags` into metadata, `routeContext.ts` validates the locale and builds the query variables, and `executeQuery.ts` runs every query with caching under one tag that `/api/revalidateCache` invalidates.

Existing route examples:

- Generic pages: `app/[locale]/(common-layout)/[slug]/**`.
- Posts: `app/[locale]/(common-layout)/posts/[slug]/**`.
- Authors: `app/[locale]/(common-layout)/posts/author/[slug]/**`.
- Tags: `app/[locale]/(common-layout)/posts/tag/[slug]/**`.
- Legal pages: `app/[locale]/(common-layout)/legal/[slug]/**`.
- Changelog entries: `app/[locale]/(common-layout)/changelog/[slug]/**`.
- Docs pages: `app/[locale]/(docs-layout)/docs/[slug]/**`.

## Common workflows

### Add a record-backed route

1. Confirm the request needs a new route or route mapping, not only content or section edits.
2. Inspect the DatoCMS schema type through MCP and confirm slug, localization, draft status, and SEO fields.
3. Reuse the closest existing route pattern.
4. Add `meta.ts` with the route query, `page.tsx`, `Content.tsx`, and `RealTime.tsx`.
5. Add a static params query and `generateStaticParams` in `page.tsx` for slug-backed collection routes.
6. Add metadata support when the schema type has SEO fields (`seo: _seoMetaTags { ...TagFragment }`).
7. Query types are inferred by gql.tada; run `npm run generate-schema` only after DatoCMS schema changes.
8. Add preview-link mapping in `app/api/draft/preview-links/route.tsx`.
9. Add SEO-analysis mapping in `app/api/seoAnalysis/route.tsx` only when the record should support it.
10. Verify published route, draft preview URL, published preview URL, and metadata.

### Fix preview or SEO-analysis mapping

1. Inspect the record type, slug field, and route path before editing the mapping.
2. Keep unknown API keys returning no preview links instead of failing.
3. Preserve locale in generated URLs.
4. Preserve draft and published preview behavior.
5. For SEO analysis, return a clear unsupported response for unmapped types.
6. Verify with a real record when MCP is available.

## Guardrails

- Regular page body sections belong to `landing-page-demo-sections`.
- Shared header, footer, navigation, notification, logo, social links, and accent color belong to `landing-page-demo-layout`.
- Docs content and docs tree changes belong to `landing-page-demo-docs` unless route plumbing changes.
- Existing post, author, tag, testimonial, pricing, changelog, and legal record maintenance belongs to `landing-page-demo-content-records` unless route plumbing changes.
- Do not add generic routing tutorials; follow this starter's existing wrapper pattern.

## Acceptance criteria

- Published route works.
- Draft preview opens the correct localized URL.
- Published preview opens the correct localized URL.
- Unknown API keys remain safe in preview-link handling.
- SEO-analysis mapping supports only the intended record types.
- Metadata uses DatoCMS SEO fields when available.
- Static params include locales where required.
- `npm run lint` (including `gql.tada check`) and build pass after code changes.
