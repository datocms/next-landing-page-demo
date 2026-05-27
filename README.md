<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# A Company Website Demo using Next.js 16 and DatoCMS

This example showcases a TypeScript Next.js 16 website with App Router (app) — using [DatoCMS](https://www.datocms.com/) as the data source.

## Next.js 16 Features

This demo takes advantage of the latest Next.js 16 features.

It uses GraphQL CodeGen to type all of the requests coming from DatoCMS automatically: [See how it works here](https://www.datocms.com/blog/how-to-generate-typescript-types-from-graphql)

## DatoCMS Integration

This project uses the official [`@datocms/cda-client`](https://github.com/datocms/cda-client) package for querying the DatoCMS Content Delivery API. This lightweight TypeScript client provides:

- Full TypeScript support with `TypedDocumentNode`
- Automatic retry on rate limits
- Support for draft content previews
- Seamless integration with Next.js caching

Additionally, [`react-datocms`](https://github.com/datocms/react-datocms) is used for real-time updates, responsive images, and SEO metadata handling.

## Demo

Have a look at the end result live:

### [https://company-website-demo-preview.vercel.app/](https://company-website-demo-preview.vercel.app/)

## How to use

### Quick start

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Let DatoCMS set everything up for you clicking this button below:

[![Deploy with DatoCMS](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/deploy?repo=marcelofinamorvieira%2Fsaas-starter%3Amain)

### Local setup

Once the setup of the project and repo is done, clone the repo locally.

#### Set up environment variables

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Create three DatoCMS API tokens: `CDA Only (Published)`, `CDA Only (Draft)`, and `CMA Only (Read)`.

Next, copy the `.env.example` file in this directory to `.env` (which will be ignored by Git):

```bash
cp .env.example .env
```

and set `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`, `DATOCMS_DRAFT_CONTENT_CDA_TOKEN`, and `DATOCMS_CMA_TOKEN` with the matching token values.

Also then set a secret token that is being used for WebPreviews, SEO Previews and Cache invalidation:

```
URL=http://localhost:3000
SEO_SECRET_TOKEN=superSecretToken
DRAFT_SECRET_TOKEN=superSecretToken
CACHE_INVALIDATION_SECRET_TOKEN=superSecretToken
```

#### Run your project locally

```bash
pnpm install
pnpm dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)!

## VS Code

It's strongly suggested to install the [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) extension, to get autocomplete suggestions, validation against schema, and many more niceties when working with your GraphQL queries.

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
