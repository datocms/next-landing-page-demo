---
name: landing-page-demo-sections
description: >-
  Use for regular marketing page section work in the DatoCMS landing page demo
  starter, especially requests to add, remove, reorder, restyle, or wire page
  sections on Page.records through Page.sections. Trigger on natural requests
  such as changing hero variants like split image, right image, background image,
  or gradient, moving a section on a page, or showing a changelog teaser. Covers
  Hero, Feature List, Brands, Video, Detail, Testimonials, Pricing, Featured
  Posts, Team, FAQ, Stats, About Intro, All Posts, Redirect, and Changelog
  section blocks plus their display variants. Handles app/[locale]/(common-layout)/[slug]/meta.ts,
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
3. The block fragment lives in `components/sections/<Block>/fragment.ts` (the folder is the model name, for example `HeroSection` for `HeroSectionRecord`) as a gql.tada `graphql()` document named `<Name>Fragment`, including the block's display option field. Every `...<Name>Fragment` spread must also be imported and listed in the fragment array passed to `graphql()`.
4. `components/sections/<Block>/index.tsx` is what the page renders. For a block with several layouts it reads the display option with `readFragment` and renders the matching component from `variants/`; each layout takes a `fragment` prop typed `FragmentOf<typeof <Name>Fragment>` and unmasks it with `readFragment`. Files at the block root are shared by several variants; a variant folder holds its private parts.
5. `app/[locale]/(common-layout)/[slug]/Content.tsx` switches on `section.__typename` only.

Two blocks break the pattern: RedirectSection has no folder (its `slugToRedirectTo` is selected inline in `[slug]/meta.ts`, and `Content.tsx` calls `redirect()`), and AllPostsSection has no fragment (it reads the route-level `allPosts` and `_allPostsMeta` from the `[slug]` query through its `data` prop).
6. Query types are inferred by gql.tada; run `npm run generate-schema` only after DatoCMS schema changes.

Existing section blocks: HeroSection, FeatureListSection, BrandSection, VideoSection, DetailSection, ReviewSection, PricingSection, FeaturedPostsSection, TeamSection, FaqSection, StatsSection, AboutIntro, AllPostsSection, RedirectSection, and ChangelogSection.

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
6. Add or update the fragment and renderer under `components/sections/**`. A new layout of an existing block needs its value added to the block's display option field in DatoCMS (through MCP or the CMA), a new component in `variants/`, and a `case` for that value in the block's `index.tsx`.
7. For a new block type, spread its fragment in the route query and add its `__typename` to the `Content.tsx` switch.
8. Query types are inferred by gql.tada; run `npm run generate-schema` only after DatoCMS schema changes.
9. Verify the section in published rendering and draft/live preview.

## Styling sections

Sections share one design language, so new or restyled sections must reuse it instead of introducing their own colors, shadows or spacing:

- Tokens and primitives live in `styles/` (Tailwind v4, no config file): `tokens.css` and `theme.css` for the design tokens, `utilities.css` for custom utilities and `components/*.css` for the primitives, all imported by `global.css`. The site is light only and uses no raw colors: no hex, no palette classes (`gray-*`, `blue-*`), no dark bands. The only exceptions are white and scrims: `bg-white` surfaces, white text or glyphs on `accent-solid`, `ink` or video, `#fff` rings that separate overlapping avatars, and translucent scrims over photos and video (`bg-white/80`, `to-black/50`). Everything else derives from `--color-primary`, the Layout's main color written by `components/layout/CustomColor.tsx`, so any brand color re-tints every section and stays legible.
- Neutrals: `text-ink` (headings), `text-ink-2` (body), `text-ink-3` (meta), `border-line`, `bg-white` (cards), `bg-well` (tinted wells and zones), `bg-surface` (tracks, placeholders, skeletons). Keep `ink-2`/`ink-3` text on white or `well`.
- Accent: `bg-accent-solid` behind white glyphs, `text-accent-text` for accent text, `bg-accent-wash` for tints, the `g-50`…`g-900` ramp (`bg-g-200`, `fill-g-300`…) and the gradients `bg-grad`, `bg-grad-line` and `hairline`.
- Tones: `tone-0`…`tone-5` are six stops of the same hue that drive `bg-tone`, `text-tone-text`, `bg-tone-grad`, `text-tone-grad`, `dot` and `chip`. Pick them with `TONES`, `toneClass(i)`, `toneRamp(i, n)` or `toneIndex(text)` from `@/utils/tones`, never with a template string like `` `tone-${i}` `` (Tailwind can't see it).
- Type: `text-h1` (page openers), `text-title` (reading pages), `text-h2`, `text-quote`, `text-h3-lg`, `text-h3`, `text-h4`, `text-lead`, `text-body`, `text-small`, `text-meta`, `text-caption`, `text-stat` and `text-price`, plus `mono` (dates, counters) and `label` (column heads).
- Layout and surfaces: `section` + `container-page` for every section; `card` (+ `card-hover`), `float` (a white card on a well), `well` (the tinted, clipped canvas), `zone`, `cells` (hairline cell grid), `photo`, `bezel`, `window` and `icon-tile`. Shadows only through the shadow utilities: `shadow-xs` (resting cards), `shadow-card` (floats), `shadow-pop` (popovers, dialogs), `shadow-thumb` (a selected segment or pill), `shadow-feature` (the highlighted plan), and `shadow-window` / `shadow-window-sm` for product-window frames; the `lift` filter for cut-out shapes.
- Controls: `btn` plus `btn-primary`, `btn-secondary`, `btn-ink` or `btn-ghost` (sizes `btn-sm`, `btn-lg`, `btn-icon`), never two primaries side by side; `chip` (+ `tone-N`), `chip-neutral`, `badge`, `link`, `segmented`, `capture`, and `disclosure` for `<details>`. Primitives already give 44px targets on touch screens; use `hit-44` for anything smaller.
- Render section headers with `components/ui/SectionTitle` (`align` left, center or split). It owns the space to the content (`gap` prop), so the content after it has no top margin, and `id` lands on the heading for `aria-labelledby`. Section titles are `h2`, item titles `h3`.
- Accept an optional `as?: 'h1' | 'h2'` prop and forward it to `SectionTitle`; `Content.tsx` passes `as="h1"` to the first section so a section that opens a page without a hero carries the page `h1`; a block's `index.tsx` forwards it to the variant.
- Ornaments come from `@/components/ui/Ornaments`: `<Threads shape="plinth" />` (also `loop`, `ribbon`, `converge`, `convergeTop`) inside a `well` or clipped tile, at most one per section and never under text; `Squiggle`, `PresencePill` and the `MINI_UIS` drawings. `Segments` (progress segments for carousels) is imported from `@/components/ui/Ornaments/Segments`.
- Show CMS images in a `photo` (plus an `aspect-*` class) with `DatoImage layout="fill"`, and guard optional images and empty arrays.
- Join classes with `cn` from `@/utils/cn`. It doesn't merge conflicting utilities, so `className` on shared components is for placement only; spacing and alignment go through props.
- Styles that utilities and primitives can't express go in the matching `styles/sections/*.css` file, inside `@layer groups { … }`, with no colors or `:root` variables.
- Section components also render inside the draft-mode client tree (`RealTime.tsx`): no `async` components and no server-only imports. Interactive parts are small `'use client'` islands that receive rendered nodes, never functions. Motion is CSS: `reveal` / `reveal-stagger` / `draw-in` / `media-zoom` / `pop-in` / `pop-icon` in `styles/components/motion.css`, `@starting-style` for anything that appears, and `<ViewTransition>` in `lib/datocms/realtime/generatePageComponent.tsx` for route changes. Never put a reveal inside a scroll container. Everything is static under reduced motion; no JS animation library. Nothing stays hidden waiting for JavaScript.
- Render raw CMS strings so Content Link overlays keep working; call `stripStega` before comparing, hashing or building hrefs, ids and aria text. Put `data-datocms-content-link-group` on a heading that renders `TwoTone`, so the whole heading opens the editor.
- Interface copy that has no CMS field (labels, counters, empty states, button fallbacks) comes from `uiString(locale, key, vars?)` in `@/lib/i18n/uiStrings`, never a hardcoded English string. Add new keys to `en` first, then to every other locale; server parents resolve the string and pass it to client islands as a prop.
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
