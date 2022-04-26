# Hydrogen starter with Sanity

:warning: **Hydrogen is in developer preview and undergoing frequent changes. This demo is compatible with `@shopify/hydrogen ~= 0.13.x`.** :warning:

[Live demo][hydrogen-sanity-demo]

<p><img src="https://user-images.githubusercontent.com/209129/141310942-c7ed2c08-599b-431b-896d-ceadac46012a.png" width="800" /></p>

- [About](#about)
  - [Approach](#approach)
- [Features](#features)
  - [Fetching data with useSanityQuery](#fetching-data-with-usesanityquery)
- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Deployment](#deployment)
- [Caveats](#caveats)

# About

This is a customised [Hydrogen][hydrogen-github] starter that demonstrates how Sanity and Structured Content can be used to elevate your custom Shopify storefronts.

It is designed to be used alongside our [pre-configured Studio][sanity-shopify-studio] and [Sanity Connect for Shopify][sanity-connect]

In addition to traditional PLP + PDPs, it also showcases pages that make extensive use of [Portable Text][sanity-portable-text], allowing for rich editorial that can easily reference your Shopify products in a multitude of ways.

This demo has been designed to work specifically with the document schema defined in our [pre-configured Studio][sanity-shopify-studio]. There you can find more information about general assumptions we've made around the content models driving this demo.

Hydrogen is currently in developer preview. Please note that this starter is not production ready and will be updated as Hydrogen continues to mature.

## Approach

<p>
<img width="580" alt="Sanity Hydrogen flow" src="https://user-images.githubusercontent.com/209129/141320691-381776dc-87ff-41ac-ad21-21c817cf8d86.jpg" />
</p>

Beyond improved performance and modern tooling – the true power of custom storefronts lies in having the flexibility to augment your products with data relevant to you.

For some, this could mean associating a particular product to a list of related ingredients, each with their own dedicated page. For others, it could involve creating custom pages that reference multiple products in a rich editorial layout.

Bringing your product data into your Sanity dataset will allow you to wrangle your product data as you see fit, and Sanity Connect for Shopify can handle this process for you without having to write a single line of code.

This starter comes pre-packaged with a [`useSanityQuery`][sanity-hydrogen-plugin] hook that streamlines the process of fetching any Shopify products you may have referenced in your Sanity queries. With it, you can fetch both Sanity and Shopify product data in one convenient call and ensure that you're always fetching the latest product data from Shopify.

# Features

This is a customised Hydrogen starter which adopts many of their [framework conventions and third party libraries][hydrogen-framework]. If you've used the Hydrogen framework before, then you'll feel fairly at home with this starter.

Beyond Hydrogen-specific features, this starter includes:

- Home page customisable gallery, featured collections and products
- Collection PLPs
- Basic PDPs
- Simple support for variant URLs (A [`<LinkProduct>`](src/components/LinkProduct.client.jsx) component takes care of setting Hydrogen server state and formatting variant query params)
- Editorial pages that support inline, block and margin-level product listing

## Fetching data with useSanityQuery

Hydrogen provides the [`useShopQuery`][hydrogen-use-shop-query] hook which you can use to fetch any information about your shop or products via the [Storefront API][shopify-storefront-api]

On top of this, you have the flexibility to additionally query your Sanity dataset using our [HTTP API][sanity-http-api] or [JavaScript client library][sanity-js-client].

However, if you're using Sanity and Shopify together it's highly likely that you want to surface relationships between data across both platforms. E.g.

- You want to display a promotional page which references any number of Shopify products.
- You want to display a product detail page which also references a number of custom document types, tags and other rich media you've defined in Sanity.

In these instances, trying to determine what Shopify products your Sanity content may be referring to (especially with deeply nested data structures) and crafting two separate queries to grab data from both platforms can be laborious and error prone.

For this reason, we provide a [`useSanityQuery`][sanity-hydrogen-plugin] hook (for GROQ) and `useSanityGraphQLQuery` to help streamline this process.

### Usage

**In your Hydrogen server component:**

```javascript
// Import the hook
import useSanityQuery from '../utils/query/useSanityQuery';

// Point to your Sanity project and dataset
const clientConfig = {
  projectId: 'yourSanityProjectId',
  dataset: 'production',
  apiVersion: 'v2022-01-01',
};

// Query your data from Sanity as you would normally, making sure this query returns any
// referenced Shopify product IDs (keyed to either `_ref` or `_id`).
const {sanityData, shopifyProducts} = useSanityQuery({
  query: `
    *[_id == $homeId][0]{
      ..., 
      featuredProducts[] {
        _id,
        images
      },
      hero,
    }
  `,
  params: {homeId: 'homepage'},
  clientConfig,
});

// And if prefer to use GraphQL:
const {sanityData, shopifyProducts} = useSanityGraphQLQuery({
  query: gql`
    query homepage($homeId: String!) {
      home: Home(id: $homeId) {
        featuredProducts {
          _id
          images[] {
            asset
          }
        },
        hero {
          title
        }
      }
    }
  `,
  variables: {homeId: 'homepage'},
  clientConfig,
});
```

`useSanityQuery` will then return an object with two values:

- `sanityData` - the payload of your original Sanity query
- `shopifyProducts` - the payload of all Products fetched from the Storefront API in a normalized object (by ID)

```javascript
// sanityData
{
  _type: "homepage",
  hero: {
    title: "Fresh out the oven",
  },
  featuredProducts: [
    {
      _id: "shopifyProduct-7349334187288",
      images: ...
    },
    {
      _id: "shopifyProduct-7342335787245",
      images: ...
    },
  ]
}

// shopifyProducts
{
  'shopifyProduct-7349334187288': {
    compareAtPriceRange: { maxVariantPrice: [Object], minVariantPrice: [Object] },
    descriptionHtml: '',
    handle: 'red-tshirt',
    id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY2Mzk2Mjk5MjY0ODc=',
    media: { edges: [Array] },
    metafields: { edges: [] },
    priceRange: { maxVariantPrice: [Object], minVariantPrice: [Object] },
    title: 'Red T-shirt',
    variants: { edges: [Array] },
    sellingPlanGroups: { edges: [] }
  },
  'shopifyProduct-7342335787245': {
    compareAtPriceRange: { maxVariantPrice: [Object], minVariantPrice: [Object] },
    descriptionHtml: '',
    handle: 'baseball-cap',
    id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY2NDAwNTMyNTYyNzk=',
    media: { edges: [Array] },
    metafields: { edges: [] },
    priceRange: { maxVariantPrice: [Object], minVariantPrice: [Object] },
    title: 'Baseball cap',
    variants: { edges: [Array] },
    sellingPlanGroups: { edges: [] }
  },
}
```

At this point, you now have both your data from Sanity and fresh product data from Storefront API that you can inject right into your Hydrogen [`<ProductProvider>`][hydrogen-product-provider] components to take advantage of their various [Product helper components][hydrogen-product-components].

How you choose to combine these two sources of data in your app is a matter of personal preference.

In this demo, we store the result of all `shopifyProducts` in a page-level [`<ProductsProvider>`](src/contexts/ProductsProvider.client.jsx). A [`useProductsContext`](src/contexts/ProductsContext.client.jsx) hook is then used to easily retrieve these products in deeply nested components, such as within Portable Text blocks and annotations.

### Customising product queries within `useSanityQuery`

By default `useSanityQuery` will assume you want fetch products on the Storefront API with [`ProductProviderFragment`][hydrogen-product-provider-fragment] - this will ensure that you get all the product information you need.

However, there may be cases where you don't need to fetch this much product data. For instance, you may have a promotional page featuring dozens (or hundreds) of products and simply just need to obtain the product title and first variant of each.

In these cases, you can customise `useSanityQuery` by providing a custom callback for `getProductGraphQLFragment`.

`getProductGraphQLFragment` receives an object with:

- `shopifyId`
- `sanityId`
- `occurrences` - where in the data structure this product has been found

And it must return either:

- `true` - fetching default product data (using [ProductProviderFragment][hydrogen-product-provider-fragment])
- `false` - avoiding fetching data for this product
- A string with the GraphQL fragment for that product

### Using `useSanityQuery` to fetch Sanity data only

`useSanityQuery` won't make any requests to the Storefront API for products if it can't find any valid references. However, you can specifically opt-out of this behaviour by providing a custom `getProductGraphQLFragment` function which always returns false.

```javascript
const {sanityData} = useSanityQuery({
  query: `
    *[_type == "page.legal"][0] {
      slug.current == $handle
    }
  `,
  params: {handle},
  // No need to query Shopify product data
  getProductGraphQLFragment: () => false,
});
```

# Getting started

## Requirements:

- Node.js 14.0 or higher

## Installation

1. Update the following configuration files (optional)

   - **`sanity.config.js`**: point to your Sanity project's `dataset` and `projectId`
   - **`shopify.config.js`**: point to your Shopify storefront's `storeDomain` and `storefrontToken`

   You can skip this step if you'd like to run the starter with our test data.

2. Install dependencies and start the development server

```sh
yarn install
yarn dev
```

3. Visit the development environment running at http://localhost:3000.

## Deployment

Please see [Hydrogen's documentation on deployment][hydrogen-framework-deployment]

# Caveats

This starter is a work in progress and is not production ready. We aim to build on this example as Hydrogen continues to mature.

Some points to be mindful of:

- This doesn't provide any [custom caching][hydrogen-framework-cache] rules, and client-side caching is currently disabled on the demo site
- This doesn't yet come with a [dynamic sitemap][hydrogen-framework-sitemap]
- Affordances for screen readers are currently absent

# License

This repository is published under the [MIT](LICENSE) license.

[hydrogen-sanity-demo]: https://hydrogen-sanity-demo.com
[hydrogen-github]: https://github.com/Shopify/hydrogen
[hydrogen-framework]: https://shopify.dev/api/hydrogen/framework
[hydrogen-framework-cache]: https://shopify.dev/api/hydrogen/framework/cache
[hydrogen-framework-deployment]: https://shopify.dev/custom-storefronts/hydrogen/deployment
[hydrogen-framework-sitemap]: https://shopify.dev/api/hydrogen/framework/pages#create-a-custom-sitemap
[hydrogen-product-components]: https://shopify.dev/api/hydrogen/components/product-variant
[hydrogen-product-provider]: https://shopify.dev/api/hydrogen/components/product-variant/productprovider
[hydrogen-product-provider-fragment]: https://shopify.dev/api/hydrogen/components/product-variant/productprovider#graphql-fragment
[hydrogen-use-shop-query]: https://shopify.dev/api/hydrogen/hooks/global/useshopquery
[sanity-connect]: https://www.sanity.io/docs/sanity-connect-for-shopify
[sanity-http-api]: https://www.sanity.io/docs/http-api
[sanity-hydrogen-plugin]: https://github.com/sanity-io/hydrogen-plugin-sanity
[sanity-js-client]: https://www.sanity.io/docs/js-client
[sanity-portable-text]: https://www.sanity.io/guides/introduction-to-portable-text
[sanity-shopify-studio]: https://github.com/sanity-io/sanity-shopify-studio
[sanity-structured-content-patterns]: https://www.sanity.io/guides/structured-content-patterns-for-e-commerce
[shopify-storefront-api]: https://shopify.dev/api/storefront
