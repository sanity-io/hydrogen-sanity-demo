# AKVA - An example storefront powered by Sanity + Hydrogen

This demo is compatible with `@shopify/hydrogen >= 2023.1.0` built on Remix.

> For the legacy Hydrogen v1 template, please refer to the [hydrogen-v1 branch](https://github.com/sanity-io/hydrogen-sanity-demo/tree/hydrogen-v1).

<img src="https://user-images.githubusercontent.com/209129/173065853-77b26be2-dd15-4b4d-8164-850e70247b88.png" width="1000" />

[Demo][hydrogen-sanity-demo] | [Sanity Studio][sanity-shopify-studio] | [Sanity Connect for Shopify][sanity-connect]

# About

AKVA is our customized [Hydrogen][hydrogen-github] starter that presents a real-world example of how Sanity and Structured Content can elevate your custom Shopify storefronts.

It's designed to be used alongside our [pre-configured Studio][sanity-shopify-studio] and [Sanity Connect for Shopify][sanity-connect], which syncs products and collections from your Shopify storefront to your Sanity dataset.

This starter showcases a few patterns you can adopt when creating your own custom storefronts. Use Sanity and Hydrogen to delight customers with rich, shoppable editorial experiences that best tell your story.

# Features

**[View the feature gallery][about]**

This TypeScript demo adopts many of Hydrogen's [framework conventions and third-party libraries][hydrogen-framework]. If you've used Hydrogen then you should hopefully feel at home here.

# Fetching Sanity data

This demo comes preconfigured to use [`hydrogen-sanity`](hydrogen-sanity), which adds a Sanity client to the Remix context. This enables you to fetch content from Sanity in Remix loaders and actions.

In addition to this, we've created a `query` utility, which uses [Hydrogen's caching strategies](https://shopify.dev/docs/custom-storefronts/hydrogen/data-fetching/cache#caching-strategies) to reduce the number of calls to Sanity's API. If no strategy is provided to the `cache` option, then the Hydrogen `CacheLong()` strategy will be used by default.

It's possible to make calls to the Sanity API either with `query`:

```tsx
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import type {SanityProductPage} from '~/lib/sanity';

const QUERY = `*[_type == 'product' && slug.current == $slug]`;

export async function loader({params, context}: LoaderArgs) {
  const cache = context.storefront.CacheLong();

  const sanityContent = await context.sanity.query<SanityProductPage>({
    query: QUERY,
    params: {
      slug: params.handle,
    },
    cache,
  });

  return json({sanityContent});
}
```

or directly with the Sanity client:

```tsx
// <root>/app/routes/($lang).products.$handle.tsx
import {useLoaderData} from '@remix-run/react';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import type {SanityProductPage} from '~/lib/sanity';

const QUERY = `*[_type == 'product' && slug.current == $slug]`;

export async function loader({params, context}: LoaderArgs) {
  const sanityContent = await context.sanity.client.fetch<SanityProductPage>(
    QUERY,
    {
      slug: params.handle,
    },
  );

  return json({sanityContent});
}
export default function Product() {
  const {sanityContent} = useLoaderData<typeof loader>();

  // ...
}
```

This uses our official [`@sanity/client`][sanity-js-client] library, so it supports all the methods you would expect to interact with Sanity API's

You can also use the [`defer` and `Await` utilities](https://remix.run/docs/en/1.15.0/guides/streaming#using-defer) from Remix to prioritize critical data:

```tsx
// <root>/app/routes/($lang).products.$handle.tsx
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import type {SanityProductPage, LessImportant} from '~/lib/sanity';

const QUERY = `*[_type == 'product' && slug.current == $slug]`;
const ANOTHER_QUERY = `*[references($id)]`;

export async function loader({params, context}: LoaderArgs) {
  /* Await the important content here */
  const sanityContent = await context.sanity.query<SanityProductPage>({
    query: QUERY,
    params: {
      slug: params.handle,
    },
  });

  /* This can wait - so don't await it - keep it as a promise */
  const moreSanityContent = context.sanity.query<LessImportant>({
    query: ANOTHER_QUERY,
    params: {
      id: sanityContent._id,
    },
  });

  return defer({sanityContent});
}
export default function Product() {
  const {sanityContent, moreSanityContent} = useLoaderData<typeof loader>();

  return (
    <div>
      <Content value={sanityContent} />
      {/* Wrap promises in a Suspense fallback and await them */}
      <Suspense fallback={<Spinner />}>
        <Await resolve={moreSanityContent}>
          {(content) => <MoreContent value={content} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

# Live Preview

In addition to providing a Sanity Client, `hydrogen-sanity` can utilize Sanity's realtime content platform to give editors live-as-you-type previewing of their content. That way they can see, in context, how their changes will appear directly in the storefront.

You can read more about configuration in the `hydrogen-sanity` [documentation](hydrogen-sanity).

This demo is set up with an example of live preview on the `($lang)._index.tsx` route.

# Opinions

We've taken the following opinions on how we've approached this demo.

<details>
<summary><strong>Shopify is the source of truth for non-editorial content</strong></summary>

- For products, this includes titles, handles, variant images and product options.
- For collections, this includes titles and collection images.

</details>

<details>
<summary><strong>Shopify data stored in our Sanity dataset is used to improve the editor experience</strong></summary>

- This allows us to display things like product status, prices and even inventory levels right in our Sanity Studio.
- Our application always fetches from Shopify's Storefront API at runtime to ensure we have the freshest data possible, especially important when dealing with fast-moving inventory.

</details>

<details>
<summary><strong>Collections are managed entirely by Shopify</strong></summary>

- Shopify is used to handle collection rules and sort orders.

</details>

<details>
<summary><strong>Product options are customized in Sanity</strong></summary>

- Data added to specific product options (for example, associating a hex value with the color 'Red', or a string value with the Poster size 'A2') is done in Sanity.
- We treat this quite simply and manage these in a dedicated field within the `Settings` section of our studio. We also make sure to query this field whenever querying products in our Sanity dataset.
- This could alternatively be managed with Shopify's metatags.

</details>

<details>
<summary><strong>We don't surface Shopify HTML descriptions and metatags</strong></summary>

- For this demo, Shopify tags are used purely as a non-visual organizational tool (to drive automated collections) and we use Portable Text over Shopify's description HTML field. However, Hydrogen makes it very easy to surface these in your application if needed.

</details>

<details>
<summary><strong>Non-product (regular) pages are managed entirely by Sanity</strong></summary>

- Shopify pages and blog posts (associated with the Online Store) channel aren't used in this demo. A dedicated `page` document type in Sanity has been created for this purpose.

</details>

<details>
<summary><strong>We query our Sanity dataset when building sitemap.xml entries</strong></summary>

- We use Sanity as the source of truth when determining whether a product or collection page is _visible_.
- This gives us the flexibility to add custom logic to control whether certain pages should be visible or not. For example, if you wanted to hide product pages within a specific date range, or hide collections that didn't have any editorial modules assigned to them.

</details>

# Analytics

We've set up basic [Shopify Analytics][shopify-analytics] on this demo. The `hasUserConsent` boolean in `<root>/app/root.tsx` is set to `true` - you'll likely need to set up user consent based on the relevant regulations for your storefront.

# Getting started

## Requirements:

- Node.js version 16.14.0 or higher
- `npm` (or your package manager of choice, such as `yarn` or `pnpm`)

## Getting Started

1.  Create a `.env` file, based on the `.env.template` file.

2.  Install dependencies and start the development server

    ```bash
    npm i
    npm run dev
    ```

3.  Visit the development environment running at http://localhost:3000.

For information on running production builds and deployment, see the [Hydrogen documentation][hydrogen-framework].

# License

This repository is published under the [MIT][license] license.

[about]: https://hydrogen-sanity-demo.com/pages/about
[hydrogen-sanity-demo]: https://hydrogen-sanity-demo.com
[hydrogen-github]: https://github.com/Shopify/hydrogen
[hydrogen-framework]: https://shopify.dev/docs/custom-storefronts/hydrogen
[license]: https://github.com/sanity-io/sanity/blob/next/LICENSE
[sanity-connect]: https://www.sanity.io/docs/sanity-connect-for-shopify
[sanity-js-client]: https://www.sanity.io/docs/js-client
[sanity-shopify-studio]: https://github.com/sanity-io/sanity-shopify-studio
[shopify-analytics]: https://shopify.dev/docs/custom-storefronts/hydrogen/analytics
[preview-kit]: https://github.com/sanity-io/preview-kit
[hydrogen-sanity]: https://github.com/sanity-io/hydrogen-sanity
