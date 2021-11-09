# Hydrogen starter

[Live demo](https://hydrogen-sanity-demo.com/)

![hydrogen-demo](https://user-images.githubusercontent.com/209129/140816218-3743b0fd-1443-4f46-9d95-6a0d4d6d923d.png)

## Table of contents

- [About](#about)
  - [Approach](#approach)
  - [Opinions](#opinions)
- [Features](#features)
- [Getting started](#getting-started)
- [Fetching data](#fetching-data-with-usesanityquery)

## About

This is a customised [Hydrogen](https://github.com/Shopify/hydrogen) starter that demonstrates how Sanity and Structured Content can be used to elevate your custom Shopify storefronts.

It is designed to be used alongside our [pre-configured Studio](https://github.com/sanity-io/sanity-shopify-studio) and [Sanity Connect for Shopify](https://www.sanity.io/docs/sanity-connect-for-shopify).

In addition to traditional PLP + PDPs, it also showcases pages that make extensive use of [Portable Text](https://www.sanity.io/guides/introduction-to-portable-text), allowing for rich editorial that can easily reference your Shopify products in a multitude of ways.

Hydrogen is currently in developer preview. _Please note that this starter is not production ready_ and will be updated as Hydrogen continues to mature.

### Approach

<img width="2116" alt="Sanity Hydrogen flow" src="https://user-images.githubusercontent.com/209129/140815830-4eed3299-eee7-41f9-bd26-a720ece870a9.png">

Beyond improved performance and modern tooling – the true power of custom storefronts lies in having the flexibility to augment your products with data relevant to you.

For some, this could mean associating a particular product to a list of related ingredients, each with their own dedicated page. For others, it could involve creating custom pages that reference multiple products in a rich editorial layout.

Bringing your product data into your Sanity dataset will allow you to wrangle your product data as you see fit, and Sanity Connect for Shopify can handle this process for you without having to write a single line of code.

This starter also comes pre-packaged with a [`useSanityQuery`](#fetching-data) hook that streamlines the process of fetching any Shopify products you may have referenced in your Sanity queries. With it, you can fetch both Sanity and Shopify product data in one convenient call and ensure that you're always fetching the latest product data from Shopify. This is especially important for products with high volatility.

### Opinions

No two custom storefronts are the same, and we've taken a few strong opinions with how we've approached this starter.

Most significantly, it's been designed to work specifically with the document schema defined in our [pre-configured Studio](https://github.com/sanity-io/sanity-shopify-studio).

It also makes the following key assumptions:

- Shopify is the source of truth for product titles, slugs (handles) and thumbnail images
- Sanity is used as an additional presentational layer to add custom metadata to products.
  - In this demo, this includes a portable text field, a product-level gallery and re-organisable text sections
- Product inventory is not stored in Sanity, and is always fetched at run time directly from Shopify
- Some images (such as product and cart line item thumbnails) are served by Shopify's CDN whilst other images (such as product-level image galleries) are handled by Sanity's Image API.
- This demo only handles products from Shopify. Other documents specific to Shopify – such as _collections_, _pages_ and _blog posts_ – are managed entirely in Sanity.

We believe these rules work well for simpler use cases, and keeping product titles, images and slugs handled by Shopify helps keep content consistent as you navigate from product views, to the cart and ultimately checkout.

Ensuring that product data (including inventory / availability) is fetched at run-time plays into Hydrogen's SSR-first philosophy.

It's possible that you have differing opinions on how content best be modelled to fit your particular needs – this is normal and encouraged! Fortunately, Sanity was built for this flexibility in mind, and we've written [a guide on structured content patterns of ecommerce](https://www.sanity.io/guides/structured-content-patterns-for-e-commerce) which may help inform how tackle this challenge.

## Features

This is a customised Hydrogen starter which adopts many of their [framework conventions and third party libraries](https://shopify.dev/api/hydrogen/framework). If you've used the Hydrogen framework before, then you'll feel fairly at home with this starter.

Beyond Hydrogen-specific features, this starter includes:

- Home page customisable gallery, featured collections and products
- Collection PLPs
- Basic PDPs
- Support for variant URLs
- Editorial pages that support inline, block and margin-level product listing

## Getting started

**Requirements:**

- Node.js 14.0 or higher

**Installation:**

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

**Deployment:**

Please see [Hydrogen's documentation on deployment](https://shopify.dev/custom-storefronts/hydrogen/deployment)

## Fetching data with useSanityQuery

TODO:

## License

This repository is published under the [MIT](LICENSE) license.
