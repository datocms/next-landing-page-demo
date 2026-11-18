---
name: landing-page-demo-sections
description: >-
  Use for regular marketing page section work in the DatoCMS landing page demo
  starter, especially requests to add, remove, reorder, restyle, or wire page
  sections in a Page record's sections field. Trigger on natural requests
  such as changing hero layouts like centered, split or minimal, moving a section on a page, or showing a changelog teaser. Covers
  Hero, Feature List, Brands, Video, Detail, Testimonials, Pricing, Pricing
  Comparison, Featured Posts, Team, FAQ, Stats, About Intro, All Posts, and
  Changelog section blocks plus their display layouts. Handles
  app/[locale]/(common-layout)/[slug]/meta.ts,
  app/[locale]/(common-layout)/[slug]/Content.tsx, and
  components/sections/** fragments/renderers. Do not use for shared
  header/footer/navigation/theme layout, docs pages/sidebar, existing content
  record maintenance, route/preview/SEO mapping, or generic DatoCMS schema work.
---

# Landing Page Demo Sections

Use this for marketing page body sections in the landing page starter. Keep generic DatoCMS schema design and record operations in the shared DatoCMS skills.

## Prerequisites

Before schema or content operations:

- Confirm the shared DatoCMS `agent-skills` plugin is available. If it is missing, ask whether the user already has it installed; if not, request installation before continuing.
- Expect the DatoCMS MCP to be installed and running. If live schema or content facts are needed and MCP is unavailable, pause and ask the user to install or start it.
- Inspect live schema/content through MCP before assuming API keys, localized fields, validators, singleton records, or allowed blocks.

## Existing section pattern

Marketing pages use this chain:

1. A DatoCMS block record appears inside localized `page.sections`.
2. The route query in `app/[locale]/(common-layout)/[slug]/meta.ts` spreads the block fragment inside `sections`.
3. The block fragment lives in `components/sections/<Block>/fragment.ts` (the folder is the model name, for example `HeroSection` for `HeroSectionRecord`) as a gql.tada `graphql()` document named `<Name>Fragment`, including the block's display options field (`displayOptions`). Every `...<Name>Fragment` spread must also be imported and listed in the fragment array passed to `graphql()`.
4. `components/sections/<Block>/index.tsx` is what the page renders. For a block with several layouts it reads `displayOptions` with `readFragment`, branches on its `stripStega` value (unknown or empty values fall back to the first layout) and renders the matching component from `variants/`; each layout takes a `fragment` prop typed `FragmentOf<typeof <Name>Fragment>` and unmasks it with `readFragment` (FeaturedPostsSection passes `posts` instead). Variants are named after what they render (`SplitHero`, `GridFeatures`, `ReviewSpotlight`, `PlanTabs`). Files at the block root are shared by several variants; a variant folder holds its private parts.
5. `app/[locale]/(common-layout)/[slug]/Content.tsx` switches on `section.__typename` only.

One block breaks the pattern: AllPostsSection has no fragment (`Content.tsx` passes it the route-level `allPosts` and `_allPostsMeta.count` of the `[slug]` query as `posts` and `postCount`).

Existing section blocks: HeroSection, FeatureListSection, BrandSection, VideoSection, DetailSection, ReviewSection, PricingSection, PricingComparisonSection, FeaturedPostsSection, TeamSection, FaqSection, StatsSection, AboutIntro, AllPostsSection, and ChangelogSection.

Display options values: hero `centered` | `split` | `minimal` | `statement` | `mosaic` | `cover` (a page whose hero is `statement` or `mosaic` takes that hero's shapes and colours down to its closing panel: `styles/page-tones.css`); brands `row` | `grid`; features `grid` | `list` | `cards`; reviews `cards` | `spotlight` | `list`; pricing `cards` | `table` | `tabs`; featured posts `featured` | `list` | `grid`; FAQ `columns` | `accordion`; team `cards` | `compact`.

## Workflow for section changes

1. Confirm the request is about a regular page body section, not layout, docs, content-record maintenance, or route plumbing.
2. Inspect the target `Page` record and the `sections` validator through MCP.
3. Reuse an existing block type and variant when it matches the request.
4. If a new block type or field is needed, route modeling decisions to `datocms-content-modeling` and schema implementation to the shared DatoCMS implementation skills or MCP.
5. For end-to-end requests, update the real target `Page.sections` value, not only the code:
   - preserve existing sections and ordering unless the user specifies placement;
   - for localized `sections`, update all existing locale values unless the user requested one locale;
   - reuse existing linked records where possible;
   - if the page was published and the change should be public, publish the updated record.
6. Add or update the fragment and renderer under `components/sections/**`. A new layout of an existing block needs its value added to the block's display options field (`display_options`) in DatoCMS (through MCP or the CMA), a new component in `variants/`, and a `case` for that value in the block's `index.tsx`.
7. For a new block type, spread its fragment in the route query and add its `__typename` to the `Content.tsx` switch.
8. Query types are inferred by gql.tada; run `npm run generate-schema` only after DatoCMS schema changes.
9. Verify the section in published rendering and draft/live preview.

## Styling sections

Sections share one design language, so new or restyled sections must reuse it instead of introducing their own colors, shadows or spacing:

- Tokens and primitives live in `styles/` (Tailwind v4, no config file): `theme.css` for the static design tokens (colors, radii, shadows, breakpoints), `tokens.css` for the runtime tokens (the accent, page measures, section rhythm), `base.css` for element defaults, `utilities.css` for the type tokens, container, grid and `card`, and `prose.css` for long-form text, all imported by `global.css`. The site is light only and uses no raw colors: no hex, no palette classes (`gray-*`, `blue-*`). Components use the role names from `theme.css`; the only accent is `--accent`, the Layout's main color written by `components/layout/CustomColor.tsx`, so any brand color re-tints every section and stays legible.
- Colors: `bg-surface` (page, cards), `bg-subtle` (bands, wells, icon tiles), `text-fg` (headings and text), `text-fg-muted` (secondary text), `text-fg-faint` (placeholders, decorative marks), `border-line` and `border-line-strong`, plus `text-star`, `text-success` and `text-danger` for their one job each. Keep `fg-muted` text on `surface` or `subtle`.
- Accent: `bg-accent` behind `text-on-accent`, `bg-accent-hover`, `text-accent-ink` for accent text, `bg-accent-soft` for tints and `border-accent-line`.
- Type: `text-display` (landing hero h1), `text-h1` (page titles), `text-h2` (section titles), `text-h3` (item titles), `text-lead` (subtitles), `text-body`, `text-small`, `text-ui` (badges, table notes) and `text-machine` (code-like strings). The long-title step-down (`data-long`) comes from `titleSize` in `@/utils/titleSize`, which `SectionHeader` applies.
- Layout and surfaces: `section` (or `section-tight` for a band) + `container-page` for every section; `grid-12` with `col-span-*` for the 12-column grid; `card`. Radii by role (`rounded-chip`, `rounded-control`, `rounded-card`, `rounded-frame`) and shadows only through `shadow-card` and `shadow-float`.
- Shared primitives are in `components/ui/`: `Button` (`variant` primary, secondary or ink; `size` sm, md or lg; never two primaries side by side), `CmsButtons` (the buttons a block's CMS field holds), `Chip`, `TextLink`, `AppLink`, `Avatar`, `Rating`, `Segmented`, `Photo` and the icons in `icons.tsx`. Small controls use `hit-44` to reach a 44px target on touch screens.
- Render section headers with `components/ui/SectionHeader` (`align` center or left). It owns the space to the content (`gap` prop), so the content after it has no top margin, and `id` lands on the heading for `aria-labelledby`. Section titles are `h2`; item titles sit one level below, through `itemHeadingLevel(as)` from `@/utils/headingLevel`.
- Accept an optional `as?: SectionHeadingLevel` prop (`@/utils/headingLevel`) and forward it to `SectionHeader`; `Content.tsx` passes `as="h1"` to the first section so a section that opens a page without a hero carries the page `h1`; a block's `index.tsx` forwards it to the variant. A promoted `h1` keeps the section title size unless the variant passes `size="h1"` to `SectionHeader`.
- Show CMS images with `Photo` (`frame` hero, detail, video, cover, portrait or square, plus the `sizes` of the frame), and guard optional images and empty arrays. A list whose emptiness hides the whole block (featured posts, reviews) is checked once in the block's `index.tsx`, not in each variant.
- Rich text fields (subtitles, leads, descriptions) are Structured Text: select `field { value }` in the fragment, render it with `DatoStructuredText`, and guard it with `hasStructuredText` from `@/utils/structuredText`. `SectionHeader`'s `subtitle` prop takes the field as is.
- Join classes with `cn` from `@/utils/cn`. It doesn't merge conflicting utilities, so `className` on shared components is for placement only; spacing and alignment go through props.
- Styles that utilities and primitives can't express go in `styles/base.css` or `styles/prose.css`, inside their `@layer`, with no raw colors.
- Section components also render inside the draft-mode client tree (`RealTime.tsx`): no `async` components and no server-only imports. Interactive parts are small `'use client'` islands that receive rendered nodes, never functions. Motion is CSS: `@starting-style` for anything that appears and `<PageTransition>` (`components/layout/PageTransition.tsx`) for route changes. Everything is static under reduced motion; no JS animation library. Nothing stays hidden waiting for JavaScript.
- Render raw CMS strings so Content Link overlays keep working; call `stripStega` on a string or text value before comparing, hashing or building hrefs, ids and aria text (slug, SEO, video and file fields never carry markers). Put `data-datocms-content-link-group` on a wrapper that renders several CMS strings, so the whole group opens the editor.
- Interface copy that has no CMS field (labels, counters, empty states, button fallbacks) comes from `uiString(locale, key, vars?)` in `@/lib/i18n/uiStrings`, never a hardcoded English string. Add new keys to `lib/i18n/uiStrings/en.ts` first, then to every other locale file. `uiString` is a plain synchronous lookup, so a client island that already receives `locale` may call it; islands that take a `label`/`labels` prop (SharePost, NewsletterForm, CopyButton) get the strings resolved by their server parent.
- Each display variant of a block should look clearly different from its siblings while using the same primitives.

## Guardrails

- Shared header, footer, navigation, notification, logo, social links, and theme color belong to `landing-page-demo-layout`.
- Docs home, docs pages, docs sidebar, and docs tree structure belong to `landing-page-demo-docs`.
- Blog, author, tag, testimonial, pricing tier, changelog, and legal records belong to `landing-page-demo-content-records` unless the renderer itself changes.
- New route-backed types, preview links, static params, metadata, and SEO-analysis mapping belong to `landing-page-demo-routing-preview`.
- Keep unknown section types safely ignored.

## Acceptance criteria

- The page query types include the section data.
- The target `Page.sections` contains the intended block when content work is requested.
- Localized sections keep the intended locale coverage.
- The section renders in published mode and draft/live preview.
- Existing sections still render unchanged.
- The section uses the shared tokens and primitives and looks right from 360px to 1536px wide.
- `npm run lint` (including `gql.tada check`) and build pass after code changes.
