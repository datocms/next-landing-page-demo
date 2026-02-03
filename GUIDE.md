# Adding Visual Editing to a DatoCMS Starter Project (Next.js)

This guide explains all the changes needed to add DatoCMS Visual Editing support to an existing Next.js starter project. Visual Editing allows content editors to click on elements in the frontend preview and be taken directly to the corresponding field in the DatoCMS editor.

## Overview of changes

1. **Update dependencies** to versions that support content linking
2. **Add a new environment variable** for the DatoCMS base editing URL
3. **Enable content link metadata** in CDA queries when in draft mode
4. **Create a `ContentLink` component** that wires up click-to-edit navigation
5. **Create a `DatoStructuredText` wrapper** that adds content-link boundary attributes
6. **Replace all `StructuredText` usages** with the new `DatoStructuredText` wrapper
7. **Update draft mode endpoints** to use a `redirect` query parameter (required by the Visual Editing iframe)
8. **Configure the Web Previews plugin** with Visual Editing settings
9. **Update the real-time updates hook** to use the new `includeDrafts` option
10. **Strip stega metadata** from string values used in logic (e.g., redirects)

---

## Step 1: Update dependencies

Update these packages to their latest versions:

```json
{
  "dependencies": {
    "@datocms/cda-client": "^0.2.10",
    "@datocms/cma-client-node": "^5.2.6",
    "datocms-structured-text-utils": "^5.1.7",
    "react-datocms": "^7.2.14"
  },
  "devDependencies": {
    "@datocms/cma-client": "^5.2.6"
  }
}
```

The key new transitive dependency is `@datocms/content-link`, which ships with `react-datocms` >= 7.2.x and provides:

- The `ContentLink` React component for handling click-to-edit behavior
- The `stripStega` utility for removing stega metadata from strings

## Step 2: Add the `DATOCMS_BASE_EDITING_URL` environment variable

### `.env` / `.env.example`

Add:

```
DATOCMS_BASE_EDITING_URL=http://<your-project>.admin.datocms.com
```

### `datocms.json` (if present)

Add the variable to the `buildTriggers` / environment config section:

```json
{
  "DATOCMS_BASE_EDITING_URL": {
    "type": "datocmsProjectUrl"
  }
}
```

The `"datocmsProjectUrl"` type tells DatoCMS project starters to automatically fill this value with the correct project URL during setup.

## Step 3: Enable content link metadata in CDA queries

In your central query function (e.g., `utils/queryDatoCMS.ts`), pass `contentLink` and `baseEditingUrl` options when in draft mode:

```typescript
export default async function queryDatoCMS<...>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  return executeQuery(document, {
    token: process.env.DATOCMS_READONLY_API_TOKEN!,
    excludeInvalid: true,
    includeDrafts: isDraft,
    // Add these options for Visual Editing:
    ...(isDraft
      ? {
          contentLink: 'v1' as const,
          baseEditingUrl: process.env.DATOCMS_BASE_EDITING_URL,
        }
      : {}),
    variables,
    // ...rest of options
  });
}
```

When `contentLink: 'v1'` is active, the CDA embeds invisible steganographic metadata into string field values. This metadata tells the frontend which DatoCMS record/field each piece of text belongs to.

## Step 4: Create the `ContentLink` component

Create `components/ContentLink/index.tsx`:

```tsx
'use client';

import { ContentLink as DatoContentLink } from 'react-datocms/content-link';
import { useRouter, usePathname } from 'next/navigation';

export default function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DatoContentLink
      onNavigateTo={(path) => router.push(path)}
      currentPath={pathname}
      enableClickToEdit
    />
  );
}
```

This component:

- Listens for click events on DOM elements that contain content-link metadata
- Sends a message to the parent DatoCMS iframe to navigate to the correct field in the editor
- Uses Next.js router for in-app navigation when the editor triggers page changes

### Mount it in your root layout

In your root layout (e.g., `app/[locale]/layout.tsx`), render `<ContentLink />` only in draft mode:

```tsx
import ContentLink from '@/components/ContentLink';

export default async function RootLayout({ children, params }: Params) {
  const isDraft = (await draftMode()).isEnabled;

  return (
    <>
      {/* ...existing components... */}
      {isDraft && <ContentLink />}
      {children}
    </>
  );
}
```

## Step 5: Create the `DatoStructuredText` wrapper

Structured Text fields need special handling because their rendered blocks/inline records are separate DOM subtrees that should be treated as content-link boundaries.

Create `components/DatoStructuredText/index.tsx`:

```tsx
import Highlighter from '@/components/Highlighter';
import { cloneElement, type ReactElement } from 'react';
import {
  StructuredText,
  type StructuredTextPropTypes,
  type CdaStructuredTextRecord,
} from 'react-datocms/structured-text';

function addBoundaryAttribute(
  result: ReactElement | null,
): ReactElement | null {
  if (!result) return null;
  return cloneElement(result, {
    'data-datocms-content-link-boundary': true,
  } as Record<string, unknown>);
}

export default function DatoStructuredText<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(props: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord>) {
  const {
    renderBlock,
    renderInlineRecord,
    renderLinkToRecord,
    renderNode,
    ...rest
  } = props;

  return (
    <div data-datocms-content-link-group>
      <StructuredText
        {...rest}
        renderNode={renderNode ?? Highlighter}
        renderBlock={
          renderBlock
            ? (ctx) => addBoundaryAttribute(renderBlock(ctx))
            : undefined
        }
        renderInlineRecord={
          renderInlineRecord
            ? (ctx) => addBoundaryAttribute(renderInlineRecord(ctx))
            : undefined
        }
        renderLinkToRecord={renderLinkToRecord}
      />
    </div>
  );
}
```

This wrapper does three things:

1. **Wraps output in a `data-datocms-content-link-group` div** -- tells the content-link system that this subtree contains content-link metadata from a Structured Text field, so clicks should resolve to the Structured Text field itself rather than individual text nodes.
2. **Adds `data-datocms-content-link-boundary` to rendered blocks and inline records** -- marks block/inline-record boundaries so the content-link system knows these sub-elements are separate records (and clicking them should navigate to that specific block record, not the parent Structured Text field).
3. **Applies a default `renderNode`** (e.g., `Highlighter`) so you don't need to pass it everywhere.

> **Note:** If your project doesn't use a custom `renderNode` like `Highlighter`, you can omit the `renderNode` default. The key parts are the `data-datocms-content-link-group` wrapper div and the boundary attributes on blocks/inline records.

## Step 6: Replace all `StructuredText` usages

Find every file that imports `StructuredText` from `react-datocms` or `react-datocms/structured-text` and:

1. Replace the import with `import DatoStructuredText from '@/components/DatoStructuredText'`
2. Replace `<StructuredText ... />` (or `<StructuredTextField ... />`) with `<DatoStructuredText ... />`
3. Remove the `renderNode={Highlighter}` prop (now handled by the wrapper)
4. Remove the now-unused `Highlighter` import
5. Keep any `customNodeRules`, `renderBlock`, `renderInlineRecord`, and `renderLinkToRecord` props as-is

**Before:**

```tsx
import Highlighter from '@/components/Highlighter';
import { StructuredText as StructuredTextField, renderNodeRule } from 'react-datocms/structured-text';

<StructuredTextField
  data={data.post.content}
  renderNode={Highlighter}
  renderBlock={({ record }) => { /* ... */ }}
  customNodeRules={[/* ... */]}
/>
```

**After:**

```tsx
import DatoStructuredText from '@/components/DatoStructuredText';
import { renderNodeRule } from 'react-datocms/structured-text';

<DatoStructuredText
  data={data.post.content}
  renderBlock={({ record }) => { /* ... */ }}
  customNodeRules={[/* ... */]}
/>
```

## Step 7: Update draft mode endpoints to use `redirect` parameter

The Visual Editing iframe communicates with your draft mode endpoints using a `redirect` query parameter (not `url`). Update both enable and disable routes.

### `app/api/draft/enable/route.tsx`

Change `searchParams.get('url')` to `searchParams.get('redirect')`:

```typescript
const redirectPath = searchParams.get('redirect');
// ...
if (!redirectPath) return new Response('Draft mode is enabled');
// ...
redirect(redirectPath);
```

### `app/api/draft/disable/route.tsx`

Same change:

```typescript
const redirectPath = searchParams.get('redirect');
// ...
if (!redirectPath) return new Response('Draft mode is disabled');
// ...
redirect(redirectPath);
```

### `app/api/draft/preview-links/route.tsx`

Update the generated preview link URLs to use `redirect=` instead of `url=`:

```typescript
// Draft version
url: `${websiteBaseUrl}/api/draft/enable?token=${token}&redirect=${url}`,

// Published version
url: `${websiteBaseUrl}/api/draft/disable?redirect=${url}`,
```

## Step 8: Configure the Web Previews plugin with Visual Editing

If your project has a post-install route that auto-configures the Web Previews plugin, add the `visualEditing` configuration:

```typescript
await client.plugins.update(webPreviewsPlugin, {
  parameters: {
    frontends: [
      {
        name: 'Production',
        previewWebhook: new URL(
          `/api/draft/preview-links?token=${secretToken}`,
          baseUrl,
        ).toString(),
        // Add this block:
        visualEditing: {
          enableDraftModeUrl: new URL(
            `/api/draft/enable?token=${secretToken}`,
            baseUrl,
          ).toString(),
          initialPath: '/',
        },
      },
    ],
    startOpen: true,
  },
});
```

For existing projects (without a post-install route), configure this in the DatoCMS admin UI under **Settings > Plugins > Web Previews > Frontend configuration**.

## Step 9: Update real-time updates hook

If you use `useQuerySubscription` for real-time content updates, replace the deprecated `preview` option with `includeDrafts`:

**Before:**

```typescript
const { data } = useQuerySubscription({
  query,
  variables,
  token,
  initialData,
  preview: true,
});
```

**After:**

```typescript
const { data } = useQuerySubscription({
  query,
  variables,
  token,
  initialData,
  includeDrafts: true,
});
```

## Step 10: Strip stega metadata from strings used in logic

When `contentLink: 'v1'` is active, string field values contain invisible steganographic characters. This is fine for rendering in the DOM (the characters are invisible), but it **breaks string comparisons and programmatic usage** (e.g., redirects, URL construction, switch statements).

Use `stripStega` from `@datocms/content-link` whenever you use a CDA string value in logic:

```typescript
import { stripStega } from '@datocms/content-link';

// Example: redirect based on a slug field
redirect(`/${stripStega(record.slugToRedirectTo)}`);
```

Common places where you need `stripStega`:

- URL/path construction from slug fields
- `switch` statements on `__typename` or enum fields (these typically don't have stega, but be cautious with custom string fields)
- String comparisons or equality checks
- Values passed to APIs or external services

---

## Summary checklist

- [ ] Update `@datocms/cda-client`, `@datocms/cma-client-node`, `@datocms/cma-client`, `react-datocms`, and `datocms-structured-text-utils` to latest versions
- [ ] Add `DATOCMS_BASE_EDITING_URL` env variable (and to `datocms.json` if applicable)
- [ ] Pass `contentLink: 'v1'` and `baseEditingUrl` in CDA queries when in draft mode
- [ ] Create and mount `ContentLink` component (draft mode only)
- [ ] Create `DatoStructuredText` wrapper with content-link group/boundary attributes
- [ ] Replace all `StructuredText` component usages with `DatoStructuredText`
- [ ] Rename `url` query param to `redirect` in draft enable/disable endpoints and preview-links generation
- [ ] Add `visualEditing` config to Web Previews plugin
- [ ] Replace `preview: true` with `includeDrafts: true` in `useQuerySubscription`
- [ ] Use `stripStega()` on any CDA string values used in application logic
