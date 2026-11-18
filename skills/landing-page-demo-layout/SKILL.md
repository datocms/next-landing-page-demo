---
name: landing-page-demo-layout
description: >-
  Use when changing shared site layout behavior in the DatoCMS landing page demo
  starter, even if the user does not say layout: header, navigation bar, menu
  items, dropdown menus, logo, accent color, theme color, top notification bar,
  footer logo, footer subtitle, footer legal links, social media links, language
  selector, and fields on the Layout singleton that affect shared shell
  surfaces. Handles app/[locale]/(common-layout)/meta.ts,
  app/[locale]/layout.tsx, components/layout/Header/**,
  components/layout/Footer/**, and components/layout/CustomColor.tsx. Do not use for page body sections, docs pages or
  docs sidebar, blog/content records, new route-backed pages, preview links, SEO
  route mapping, or generic DatoCMS schema work.
---

# Landing Page Demo Layout

Use this for shared site shell behavior in the landing page starter: header, navigation, top notification, logo, accent color, footer, social links, legal footer links, and language selector.

## Prerequisites

Before schema or content operations:

- Confirm the shared DatoCMS `agent-skills` plugin is available. If it is missing, ask whether the user already has it installed; if not, request installation before continuing.
- Expect the DatoCMS MCP to be installed and running. If live schema or content facts are needed and MCP is unavailable, pause and ask the user to install or start it.
- Inspect live schema/content through MCP before assuming API keys, localized fields, validators, singleton records, or allowed blocks.

## Existing layout structure

- Shared shell query: `app/[locale]/(common-layout)/meta.ts`, which spreads `HeaderFragment` (`components/layout/Header/fragment.ts`) and `FooterFragment` (`components/layout/Footer/fragment.ts`) on the `layout` singleton and adds the project locales.
- Global color and favicon query: `app/[locale]/layout.tsx`.
- `<html>` is rendered by `app/[locale]/layout.tsx`, with `lang` from the locale and the fonts from `styles/fonts.ts`. `app/layout.tsx` only passes children through, and `app/not-found.tsx` renders its own `<html>` for URLs no route matches. Switching locale swaps the root layout, so it is a full page load.
- Header components: `components/layout/Header/**` (`index.tsx` with `DesktopNav`, `MobileNav` and its `MobileLanguageList`, `NotificationStrip` and `LanguageSelector`; the menu items are built in `navItems.ts`).
- Footer components: `components/layout/Footer/**` (the footer and its language list, `FooterLanguages`). Header and footer share the language links from `components/layout/useLanguageLinks.ts`.
- Accent color component: `components/layout/CustomColor.tsx`. It renders `--accent` on the server, and every accent color derives from it through the runtime tokens in `styles/tokens.css` (tokens and rules: "Styling sections" in `landing-page-demo-sections`). Components never use the raw color, hex values or palette classes, so any brand color re-tints the whole shell.
- Design tokens and shared primitives: `styles/theme.css`, `styles/tokens.css`, `styles/utilities.css` and `styles/base.css`, all imported by `styles/global.css`, plus the `components/ui/` primitives (`Button`, `AppLink`, `TextLink`, icons). The shell is styled with utilities in its own components. The site is light only: the announcement is a `subtle` strip under a hairline border. Section-level styling rules (tokens, primitives, motion) are in the `landing-page-demo-sections` skill and apply to the shell too.
- Shell copy that has no CMS field (footer column headings such as Legal, Social and Language, the 404 page) comes from `uiString(locale, key)` in `@/lib/i18n/uiStrings` (rules in `landing-page-demo-sections`).
- DatoCMS singleton: `layout`.
- Layout fields include `logo`, `main_color`, `notification`, `menu`, `footer_logo`, `footer_subtitle`, `social_media_links`, and `footer_links`.
- Menu blocks are `menu_item` and `menu_dropdown`; a `menu_item` links (`link`) to a Page or to the Documentation Home. Social link blocks are `social_media_icon`.

## Common workflows

### Change existing layout content

1. Confirm the request affects a shared shell surface, not one page section or docs content.
2. Inspect the current `layout` singleton through MCP.
3. Preserve existing field values and localized values unless the user requested a replacement.
4. Update the singleton field or nested block shape through the shared DatoCMS skills or MCP.
5. If the singleton is published and the change should be public, publish it.
6. Verify a home page and at least one non-home page when practical.

### Add or change layout rendering

1. Inspect the live field shape before changing a query or component.
2. When more data is needed, add the fields to `components/layout/Header/fragment.ts` or `components/layout/Footer/fragment.ts` (or to the query in `app/[locale]/layout.tsx`).
3. Update the relevant shared component under `components/layout/Header/**`, `components/layout/Footer/**`, or `components/layout/CustomColor.tsx`.
4. Keep absent or empty optional fields safe.
5. Query types are inferred by gql.tada; run `npm run generate-schema` only after DatoCMS schema changes.
6. Verify desktop and mobile navigation when changing menus.

### Adjust navigation or footer

1. For navigation, inspect `layout.menu`, `menu_item`, and `menu_dropdown` records.
2. Keep menu links route-aware through `utils/routes.ts`: `pageUrl` for a Page, `docsHomeUrl` for the Documentation Home (see `navItems.ts`).
3. For footer work, inspect `footer_logo`, `footer_subtitle`, `social_media_links`, and `footer_links`.
4. Keep legal footer links pointed at `/legal/[slug]` (`legalPageUrl`) unless route behavior changes too.
5. Preserve item order unless the user requests a reorder.

## Guardrails

- Page body sections belong to `landing-page-demo-sections`.
- Docs home, docs pages, and docs sidebar belong to `landing-page-demo-docs`.
- Blog, author, tag, testimonial, pricing tier, changelog, and legal record maintenance belongs to `landing-page-demo-content-records` unless it changes a shared shell surface.
- New route-backed types, preview links, metadata, and SEO-analysis mapping belong to `landing-page-demo-routing-preview`.
- Generic schema design belongs to the shared DatoCMS skills.

## Acceptance criteria

- Header, footer, notification, logo, social links, language selector, and color rendering remain safe with optional empty fields.
- Menu dropdowns still work on desktop and mobile.
- Footer links remain locale-aware.
- `npm run lint` (including `gql.tada check`) and build pass after code changes.
