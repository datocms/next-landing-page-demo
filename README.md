<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# A Company Website Demo using Next.js 16 and DatoCMS

This example showcases a TypeScript Next.js 16 website with App Router (app) — using [DatoCMS](https://www.datocms.com/) as the data source.

## Next.js 16 Features

This demo uses the App Router with route groups, `proxy.ts` to add the locale to every URL, Draft Mode, tag-based cache invalidation with `revalidateTag`, and React's `<ViewTransition>` for page fades.

## DatoCMS Integration

This project uses the official [`@datocms/cda-client`](https://github.com/datocms/cda-client) package for querying the DatoCMS Content Delivery API. This lightweight TypeScript client provides:

- Full TypeScript support with `TypedDocumentNode`
- Automatic retry on rate limits
- Support for draft content previews
- Seamless integration with Next.js caching

Additionally, [`react-datocms`](https://github.com/datocms/react-datocms) is used for real-time updates, responsive images, and SEO metadata handling.

Thanks to [gql.tada](https://gql-tada.0no.co/) every GraphQL query is fully typed: queries and fragments live next to the components that use them, and their types are inferred straight from your DatoCMS schema.

## How the code is organized

```
app/                      Routes (Next.js App Router)
  [locale]/               Every page lives under a locale: /en/…, /it/…
    (common-layout)/      The marketing site: header and footer around each page
      [slug]/             Pages built from section blocks
      posts/  changelog/  legal/
                          Posts, authors, tags, changelog entries and legal pages
    (docs-layout)/        The documentation area, with its own sidebar shell
  api/                    Endpoints for DatoCMS and Draft Mode: draft enable and
                          disable, preview links, SEO analysis, cache
                          invalidation, post-install setup
components/
  sections/               One folder per block of the Page model's "Sections" field
  blocks/                 Blocks embedded in Structured Text (blog posts)
  posts/                  Post cards, covers, bylines and pagination
  docs/                   The docs shell, sidebar items and featured page cards
  layout/                 Header, footer, 404 page, page transition and the accent color
  datocms/                react-datocms wrappers (images, Structured Text,
                          Content Link) and the Draft Mode toggle
  ui/                     Shared building blocks: section titles, code blocks, ornaments
lib/
  datocms/                Data layer: executeQuery, gql.tada setup, page generators,
                          the website URL of each record (recordInfo.ts)
  i18n/                   The project's locales and the translated interface strings
  websiteBaseUrl.ts       The site's public origin, for absolute URLs
utils/                    Small helpers: route URLs (routes.ts), the page props every
                          route passes down (globalPageProps.ts), class names, dates,
                          color tones, Structured Text
styles/                   Tailwind CSS 4 setup, design tokens, component styles and
                          the styles of each site area (areas/)
skills/                   Agent skills that explain how to extend this demo
proxy.ts                  Adds the visitor's locale to URLs without one (/ → /en/home)
```

### How a page is rendered

Every route backed by DatoCMS is made of the same four files:

- `meta.ts` holds the route's GraphQL query. It is composed from the fragments that components declare next to themselves (`fragment.ts`), so each component asks for exactly the data it renders, and gql.tada infers every type from `schema.graphql`.
- `page.tsx` turns the URL params into query variables (`buildVariables`) and wires the route with `generatePageComponent` and `generateMetadataFn` from `lib/datocms`: they validate the locale, run the query through `executeQuery` and turn the record's SEO fields into metadata.
- `Content.tsx` renders the query result.
- `RealTime.tsx` is the client version of `Content.tsx`, used in Draft Mode: it subscribes to DatoCMS's Real-time Updates API, so the page changes while editors type.

The two route-group layouts, `(common-layout)` and `(docs-layout)`, use the same files with `layout.tsx` in place of `page.tsx`, so the header, footer and docs sidebar also update live in Draft Mode. `app/[locale]/layout.tsx` is the exception: it runs its small favicon and accent color query directly. Pieces that only make sense inside one route's markup sit next to its files (`posts/[slug]/PostBody.tsx`, `changelog/[slug]/ReleaseRail.tsx`); components that belong to a content area live in `components/<area>` (posts, docs) even when one route uses them.

Pages (`app/[locale]/(common-layout)/[slug]`) are a stack of section blocks. `Content.tsx` maps each block type to its folder in `components/sections` (the Redirect block is handled right in `Content.tsx`). Blocks with several layouts (the folders with a `variants/` directory) switch on their display option field in `index.tsx` and render the matching component from `variants/`, named after what it renders (`SplitImageHero`, `CardGridPosts`). To add a layout: add the new value to that field's options in DatoCMS, add a component to `variants/`, and add a `case` for the value in the block's `index.tsx`. The blog index is a page too: `/posts` is the `posts` Page, whose All posts block shows the first page of posts, and `posts/page/[page]` serves the others.

Published content is cached in the Next.js Data Cache under one tag. When content changes, DatoCMS calls `/api/revalidateCache`, which invalidates it (see `lib/datocms/executeQuery.ts`). In Draft Mode, text fields carry Content Link markers: hold Alt/Option (or turn on Visual Editing in the Web Previews plugin) and click any text to open the matching field in DatoCMS.

## Demo

Have a look at the end result live:

### [https://company-website-demo-preview.vercel.app/](https://company-website-demo-preview.vercel.app/)

## How to use

### Quick start

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Let DatoCMS set everything up for you clicking this button below:

[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/deploy?repo=datocms%2Fnext-landing-page-demo%3Amain)

### Local setup

Once the setup of the project and repo is done, clone the repo locally.

#### Set up environment variables

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Create three DatoCMS API tokens: `CDA Only (Published)`, `CDA Only (Draft)`, and `CMA Only (Read)`.

Next, copy the `.env.example` file in this directory to `.env` (which will be ignored by Git):

```bash
cp .env.example .env
```

and set `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`, `DATOCMS_DRAFT_CONTENT_CDA_TOKEN`, and `DATOCMS_CMA_TOKEN` with the matching token values. Set `DATOCMS_BASE_EDITING_URL` to your project's admin URL (`https://<your-project>.admin.datocms.com`): Content Link uses it to open the clicked field in DatoCMS.

Then set the three secret tokens that guard the endpoints used for Web Previews, SEO/Readability Analysis and cache invalidation. Generate a different, cryptographically-secure random string for each of them (`openssl rand -hex 32` is a good way to do it) — never reuse the same value across projects:

```
URL=http://localhost:3000
SEO_SECRET_TOKEN=<random string>
DRAFT_SECRET_TOKEN=<random string>
CACHE_INVALIDATION_SECRET_TOKEN=<random string>
```

`DRAFT_SECRET_TOKEN` is also the password the site's Draft Mode toggle asks for.

> If you deployed this demo with the "Deploy with DatoCMS" button, these three secrets were generated randomly for you and shown on the last step of the setup wizard. If you no longer have them, set new ones from your hosting provider's environment variable settings.

#### Run your project locally

```bash
npm install
npm run dev
```

Your website should be up and running on [http://localhost:3000](http://localhost:3000)!

#### Update the GraphQL schema

Whenever you change your DatoCMS models, refresh `schema.graphql` and the types gql.tada generates from it (`lib/datocms/graphql-env.d.ts`):

```bash
npm run generate-schema
```

## VS Code

It is highly recommended to follow [these instructions](https://gql-tada.0no.co/get-started/installation#vscode-setup) for an optimal experience with Visual Studio Code, including features like diagnostics, auto-completions, and type hovers for GraphQL.

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
