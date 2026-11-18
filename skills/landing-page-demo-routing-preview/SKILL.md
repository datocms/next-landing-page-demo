---
name: landing-page-demo-routing-preview
description: >-
  Use for route-level infrastructure in the DatoCMS landing page demo starter:
  adding or changing record-backed routes, static params, metadata, draft/live
  preview wrappers, Web Previews URL mapping, SEO-analysis route mapping, and
  route-aware cache/draft behavior. Covers the route
  meta.ts/page.tsx/Content.tsx/RealTime.tsx plumbing under app/[locale]/,
  lib/datocms/** (record URLs in lib/datocms/recordInfo.ts), utils/routes.ts,
  app/api/** (draft enable/disable, preview links, SEO analysis,
  revalidateCache, post-install), components/datocms/ContentLink.tsx,
  components/datocms/DraftModeToggle/**, proxy.ts, and lib/i18n/locales.ts.
  Do not use for ordinary page section edits, shared layout content, docs
  content edits, existing content record changes, or generic Next.js routing
  outside this starter.
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
- `page.tsx` for variables (`buildVariables`), metadata (`generateMetadataFn` with `pickSeoMetaTags`), static params (with their own small query) for routes prerendered at build time, and `generatePageComponent`.
- `Content.tsx` for regular rendering.
- `RealTime.tsx` for draft/live preview rendering (`generateRealtimeComponent`).

The generators live in `lib/datocms/`: `realtime/generatePageComponent.tsx` builds the page or layout component, which renders `Content` (published) or `RealTime` (Draft Mode); `realtime/generateRealtimeComponent.tsx` builds `RealTime.tsx`, which subscribes to the Real-time Updates API; `realtime/types.ts` holds the `ContentComponent` and `RealtimeComponent` types. `generateMetadataFn.ts` turns `_seoMetaTags` into metadata, `routeContext.ts` validates the locale (`requireSiteLocale` in `lib/i18n/locales.ts`) and builds the query variables, and `executeQuery.ts` runs every query with caching under one tag that `/api/revalidateCache` invalidates. The URL of each routable model is built in `utils/routes.ts`, and `lib/datocms/recordInfo.ts` (`recordToWebsiteRoute`) maps a record to its URL for the Web Previews and SEO/Readability Analysis plugins. The endpoints in `app/api/` share `hasBearerToken` (the secret check) and `withCORS` from `app/api/utils.ts`.

Existing route examples:

- Generic pages: `app/[locale]/(common-layout)/[slug]/**`.
- Posts index: `/posts` is the `posts` Page record rendered by `[slug]` (its All posts block lists page 1); pages 2+ are `app/[locale]/(common-layout)/posts/page/[page]/**`.
- Posts: `app/[locale]/(common-layout)/posts/[slug]/**`.
- Authors: `app/[locale]/(common-layout)/posts/author/[slug]/**`.
- Tags: `app/[locale]/(common-layout)/posts/tag/[slug]/**`.
- Legal pages: `app/[locale]/(common-layout)/legal/[slug]/**`.
- Changelog entries: `app/[locale]/(common-layout)/changelog/[slug]/**`.
- Docs home: `app/[locale]/(docs-layout)/docs/`.
- Docs pages: `app/[locale]/(docs-layout)/docs/[slug]/**`.

## Common workflows

### Add a record-backed route

1. Confirm the request needs a new route or route mapping, not only content or section edits.
2. Inspect the DatoCMS schema type through MCP and confirm slug, localization, draft status, and SEO fields.
3. Reuse the closest existing route pattern.
4. Add `meta.ts` with the route query, `page.tsx`, `Content.tsx`, and `RealTime.tsx`.
5. Add `generateStaticParams` (with its own small query in `page.tsx`, as in `[slug]/page.tsx`) only when the collection should be prerendered at build time; today only `[slug]` and `posts/[slug]` are.
6. Add metadata support when the schema type has SEO fields (`seo: _seoMetaTags { ...TagFragment }`).
7. Query types are inferred by gql.tada; run `npm run generate-schema` only after DatoCMS schema changes.
8. Add the route's URL builder to `utils/routes.ts` and the model to `recordToWebsiteRoute` in `lib/datocms/recordInfo.ts`, which feeds both preview links and SEO analysis.
9. Verify published route, draft preview URL, published preview URL, and metadata.

### Fix preview or SEO-analysis mapping

1. Inspect the record type, slug field, and route path before editing `recordToWebsiteRoute` in `lib/datocms/recordInfo.ts`.
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
