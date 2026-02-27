# Company Website Demo — explicit API token variant

This branch is a variant of the `main` branch of this repo. On `main`, the site reads its DatoCMS API tokens from environment variables. On this branch, the token is the first segment of every URL:

```
https://<your-deployment>/<datocms-api-token>/<locale>/<path>
```

This lets a single deployment serve content from any DatoCMS project that has the same schema. Just change the token in the URL.

> [!WARNING]
> The token ends up in browser history, server logs, and referrer headers. Only use a **read-only API token** that you are happy to expose.

## Used by try.datocms.com

This branch is the frontend of the [try.datocms.com](https://try.datocms.com) experience. That service lives in the private `datocms/try.datocms.com` repo.

The `try-datocms-frontend` Vercel project, in the DatoCMS team, deploys this branch to `https://try-datocms-frontend.vercel.app`. When a visitor opens try.datocms.com, a Cloudflare Worker does the following:

1. It creates a throwaway DatoCMS project from the starter template.
2. It creates the "Demo website" API token. The token reads content (drafts included) with both APIs. Its role can also manage shared filters: only such a role can read the admin domain that Content Link needs.
3. It installs the Web Previews plugin:
   - The preview webhook is `/api/draft/preview-links?datocmsApiToken=<Demo website token>`. The shared secret goes in the `Authorization: Bearer …` header.
   - The Visual Editing draft-mode URL is `/api/draft/enable?token=…`. A browser opens it, so the secret stays in the query string.
   - The Visual Editing initial path is `/<Demo website token>/en/`.
4. It installs the SEO/Readability Analysis plugin. Its HTML generator URL is `/api/seoAnalysis?datocmsApiToken=<Demo website token>`, with the same `Authorization` header.
5. It sends the visitor into the new project.

Every throwaway project uses this same deployment, so nothing gets deployed per visitor. The token in the URL decides which content the site shows.

Because of this, **treat changes on this branch as changes to try.datocms.com**:

- Keep the URL shape `/<token>/<locale>/…` stable.
- Keep the `datocmsApiToken` query parameter on both webhooks.
- Keep the shared secret check compatible with what the Worker sends. The secret lives in `src/worker/routes/createProject.ts` in that repo. It must match `DRAFT_SECRET_TOKEN` and `SEO_SECRET_TOKEN` on the Vercel project.
- Deploy both sides together when you change this contract.

## What changes compared to `main`

- All routes live under `app/[apiToken]/[locale]/` instead of `app/[locale]/`.
- `proxy.ts` reads the token from the path and uses it to fetch the available locales. It then redirects to `/<token>/<locale>/home` when needed.
- `queryDatoCMS()`, `getAvailableLocales()` and `getFallbackLocale()` take the token as their first argument.
- In draft mode, the real-time updates use the token from the URL.
- Content Link gets the admin URL of each project from the token (see `utils/getBaseEditingUrl.ts`). The Next.js Data Cache keeps it for one day.
- `buildUrl()` in `utils/globalPageProps.ts` puts the token in front of every internal link.
- The Web Previews and SEO Analysis webhooks expect a `datocmsApiToken` query parameter. The shared secret still travels in the `Authorization: Bearer …` header.
- `generateStaticParams()` is gone from the page and post routes, because the token is only known at request time.
- The one-click deploy setup is gone: `datocms.json` and `app/api/post-install` are deleted.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

Fill in `.env`:

| Variable | Purpose |
| --- | --- |
| `URL` | Public base URL, used to build preview links |
| `DRAFT_SECRET_TOKEN` | Secret for `/api/draft/enable` and the Web Previews webhook |
| `SEO_SECRET_TOKEN` | Secret for the SEO Analysis webhook |
| `CACHE_INVALIDATION_SECRET_TOKEN` | Secret for the cache revalidation webhook |
| `DATOCMS_BASE_EDITING_URL` | Optional. Admin URL for Content Link when the token cannot read the project, for example a Content Delivery API-only token. Without it, Content Link is off for such tokens |

Then open `http://localhost:3000/<datocms-api-token>`.

### Plugins and webhooks

There is no post-install step. For try.datocms.com projects, the Worker configures the plugins (see above). For any other project, you must configure these by hand:

- **Web Previews:** set the preview webhook to `<URL>/api/draft/preview-links?datocmsApiToken=<token>`, and add the header `Authorization: Bearer <DRAFT_SECRET_TOKEN>`.
- **SEO/Readability Analysis:** set the HTML generator URL to `<URL>/api/seoAnalysis?datocmsApiToken=<token>`, and add the header `Authorization: Bearer <SEO_SECRET_TOKEN>`. The SEO route uses this token with the Content Management API, so it needs read access to records.
- **Cache revalidation webhook:** point it to `<URL>/api/revalidateCache`, with the header `Authorization: Bearer <CACHE_INVALIDATION_SECRET_TOKEN>`.

## Keeping this branch in sync with `main`

This branch is always **a single commit** on top of `main`. The commit moves `app/[locale]` to `app/[apiToken]/[locale]`. If you rebase that move as it is, git reports a conflict for every route file that changed on `main`.

To avoid that, move the routes back before the rebase and move them again after it. The two npm scripts do this for you:

```bash
git switch explicit-api-token

# 1. Move the routes back to app/[locale] and fold that into the commit
npm run beforeRebase
git add -A
git commit --amend --no-edit

# 2. Rebase. Now only real content changes can conflict.
git rebase main
# ...fix the conflicts, then `git add` the files you fixed (do not continue yet)

# 3. Move the routes back under app/[apiToken] and finish the rebase
npm run afterRebase
git add -A
git rebase --continue

# 4. Publish the rewritten branch
git push --force-with-lease origin explicit-api-token
```

When you resolve conflicts:

- **Environment tokens:** if `main` reads a DatoCMS token from `process.env`, replace it with the token from the route params or from the `datocmsApiToken` query parameter.
- **Deleted files:** `main` can change `datocms.json` or `app/api/post-install`. Keep these files deleted with `git rm`.
- **New helpers and routes:** check them for new `queryDatoCMS()` calls or URLs built by hand. Such calls must pass the token, and such URLs must go through `buildUrl()`.
- **Type check:** run `npx tsc --noEmit` before `git rebase --continue`. You can ignore errors from `.next/`, because they come from old generated route paths.

## Known gaps

- `proxy.ts` redirects to `/no-api-token` when the URL has no token, but no page exists for that path yet.
- `utils/cachedQueryDatoCMS.ts` and `graphql.config.ts` still read `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`. No page uses the cached helper. For type generation, set the variable to any token for a project with the same schema.
