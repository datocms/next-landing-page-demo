---
name: landing-page-demo-content-records
description: >-
  Use for existing content collections in the DatoCMS landing page demo starter
  that feed current routes and sections but are not layout, docs, or section
  wiring: blog posts, authors, tags, testimonials, pricing tiers, changelog
  entries, and legal pages. Covers post, author, tag, testimonial, pricing_tier,
  change_log, and legal_page records; /posts, /posts/[slug], /posts/author/[slug],
  /posts/tag/[slug], /legal/[slug], /changelog/[slug], PostExcerpt, and section
  fragments that link these records. Do not use for shared layout, docs pages,
  new section components, new route-backed types, preview mapping, or generic
  DatoCMS imports unless the request is tied to these starter records.
---

# Landing Page Demo Content Records

Use this for existing record collections that power the landing page starter: posts, authors, tags, testimonials, pricing tiers, changelog entries, and legal pages.

## Prerequisites

Before schema or content operations:

- Confirm the shared DatoCMS `agent-skills` plugin is available. If it is missing, ask whether the user already has it installed; if not, request installation before continuing.
- Expect the DatoCMS MCP to be installed and running. If live schema or content facts are needed and MCP is unavailable, pause and ask the user to install or start it.
- Inspect live schema/content through MCP before assuming API keys, localized fields, validators, singleton records, or linked records.

## Existing content surfaces

- Posts: `post` records feed `/posts`, `/posts/[slug]`, featured posts sections, all-posts sections, author pages, and tag pages.
- Authors: `author` records feed `/posts/author/[slug]` and post bylines.
- Tags: `tag` records feed `/posts/tag/[slug]` and post grouping.
- Testimonials: `testimonial` records feed `review_section` blocks.
- Pricing tiers: `pricing_tier` records feed `pricing_section` blocks.
- Changelog entries: `change_log` records feed `changelog_section` blocks and `/changelog/[slug]`.
- Legal pages: `legal_page` records feed `/legal/[slug]` and `layout.footer_links`.

## Common workflows

### Add or edit an existing content record

1. Confirm the target record type is one of the existing content collections above.
2. Inspect the live schema and relevant current records through MCP.
3. Create or update records through the shared DatoCMS skills or MCP.
4. Preserve slugs unless the user requests a URL change.
5. Keep linked records valid: post author, post tags, featured posts, testimonials, pricing tiers, changelog featured versions, and footer legal links.
6. Publish records when the user expects the change to be public.
7. Verify the existing route or section that displays the record.

### Change how existing records render

1. Confirm the request changes an existing content surface, not a new section type or new route.
2. Update the closest existing query, fragment, or component.
3. Preserve current pagination and locale-aware links.
4. Regenerate GraphQL types after query changes.
5. Verify the route and any section that consumes the record.

### Add a content record to an existing section or layout field

1. For records shown inside page body sections, inspect and update the relevant `Page.sections` block.
2. For legal footer links, inspect and update `layout.footer_links`.
3. Preserve existing record order unless the user requests a reorder.
4. Publish parent records when their published output should change.

## Guardrails

- New or changed page body section types belong to `landing-page-demo-sections`.
- Shared header, footer, navigation, notification, logo, social links, and accent color belong to `landing-page-demo-layout`.
- Docs home, docs pages, and docs sidebar belong to `landing-page-demo-docs`.
- New route-backed types, preview links, static params, metadata, and SEO-analysis mapping belong to `landing-page-demo-routing-preview`.
- Generic schema design and bulk imports belong to the shared DatoCMS skills unless starter rendering is also requested.

## Acceptance criteria

- Existing routes resolve by slug.
- Linked records remain valid.
- Published records appear in the intended route or section.
- Draft/live preview keeps working for draft-enabled records.
- Pagination still works for post listing changes.
- GraphQL type generation and build pass after code changes.
