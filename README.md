# A Company Website Demo using Next.js 13 and DatoCMS

This example showcases a TypeScript Next.js 13 website with App Router (app) — using [DatoCMS](https://www.datocms.com/) as the data source.

It uses GraphQL CodeGen to type all of the requests comming from Dato automatically: [See how it works here](https://www.datocms.com/blog/how-to-generate-typescript-types-from-graphql)

## Demo

Have a look at the end result live:

### [https://company-website-demo.vercel.app/](https://company-website-demo.vercel.app/)

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

Then click **Read-only API token** and copy the token.

Next, copy the `.env.example` file in this directory to `.env` (which will be ignored by Git):

```bash
cp .env.local.sample .env.local
```

and set the `DATOCMS_READONLY_API_TOKEN` variable as the API token you just copied.

Also then set a secret token that is being used for WebPreviews, SEO Previews and Cache invalidation:

```
URL=http://localhost:3000
SEO_SECRET_TOKEN=superSecretToken
DRAFT_SECRET_TOKEN=superSecretToken
CACHE_INVALIDATION_SECRET_TOKEN=superSecretToken
```

#### Run your project locally

```bash
npm install
npm run dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)!

## VS Code

It's strongly suggested to install the [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) extension, to get autocomplete suggestions, validation against schema, and many more niceties when working with your GraphQL queries.
