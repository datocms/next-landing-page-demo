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
  section blocks plus their display variants. Handles app/[locale]/(common-layout)/[slug]/query.graphql,
  app/[locale]/(common-layout)/[slug]/Content.tsx, and
  components/blocksWithVariants/** fragments/renderers. Do not use for shared
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
2. The route query adds an inline fragment in `app/[locale]/(common-layout)/[slug]/query.graphql`.
3. The block fragment lives under `components/blocksWithVariants/<Typename>/fragment.graphql`.
4. A React renderer lives under `components/blocksWithVariants/<Typename>/<Variant>/`.
5. `app/[locale]/(common-layout)/[slug]/Content.tsx` switches on `section.__typename` and display option fields.
6. GraphQL types are regenerated after query or fragment changes.

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
6. Add or update the fragment and renderer under `components/blocksWithVariants/**`.
7. Update the route query and `Content.tsx` switch with the generated `__typename` and display option value.
8. Regenerate GraphQL types.
9. Verify the section in published rendering and draft/live preview.

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
- GraphQL type generation and build pass after code changes.
