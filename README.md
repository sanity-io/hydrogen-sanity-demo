# Hydrogen starter

[Live demo](https://hydrogen-sanity-demo.com/)

![hydrogen-demo](https://user-images.githubusercontent.com/209129/140816218-3743b0fd-1443-4f46-9d95-6a0d4d6d923d.png)

## Table of contents

- [About](#about)
  - [Approach](#approach)
  - [Opinions](#opinions)
- [Features](#features)
- [Fetching data with useSanityQuery](#fetching-data-with-usesanityquery)
  - [How it works](#how-it-works)
  - [Assumptions](#assumptions)
- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Deployment](#deployment)

## About

This is a customised [Hydrogen](https://github.com/Shopify/hydrogen) starter that demonstrates how Sanity and Structured Content can be used to elevate your custom Shopify storefronts.

It is designed to be used alongside our [pre-configured Studio](https://github.com/sanity-io/sanity-shopify-studio) and [Sanity Connect for Shopify](https://www.sanity.io/docs/sanity-connect-for-shopify).

In addition to traditional PLP + PDPs, it also showcases pages that make extensive use of [Portable Text](https://www.sanity.io/guides/introduction-to-portable-text), allowing for rich editorial that can easily reference your Shopify products in a multitude of ways.

Hydrogen is currently in developer preview. Please note that this starter is not production ready and will be updated as Hydrogen continues to mature.

### Approach

<img width="2116" alt="Sanity Hydrogen flow" src="https://user-images.githubusercontent.com/209129/140815830-4eed3299-eee7-41f9-bd26-a720ece870a9.png">

Beyond improved performance and modern tooling – the true power of custom storefronts lies in having the flexibility to augment your products with data relevant to you.

For some, this could mean associating a particular product to a list of related ingredients, each with their own dedicated page. For others, it could involve creating custom pages that reference multiple products in a rich editorial layout.

Bringing your product data into your Sanity dataset will allow you to wrangle your product data as you see fit, and Sanity Connect for Shopify can handle this process for you without having to write a single line of code.

This starter also comes pre-packaged with a [`useSanityQuery`](#fetching-data) hook that streamlines the process of fetching any Shopify products you may have referenced in your Sanity queries. With it, you can fetch both Sanity and Shopify product data in one convenient call and ensure that you're always fetching the latest product data from Shopify. This is especially important for products with high volatility.

### Opinions

No two custom storefronts are the same, and we've taken a few strong opinions with how we've approached this starter.

Most significantly, it's been designed to work specifically with the document schema defined in our [pre-configured Studio](https://github.com/sanity-io/sanity-shopify-studio).

It also makes the following assumptions:

- Shopify is the source of truth for product titles, slugs (handles) and thumbnail images
- Sanity is used as an additional presentational layer to add custom metadata to products.
  - This includes a portable text field, a product-level gallery and re-organisable text sections
- Product inventory is not stored in Sanity, and is always fetched at run time directly from Shopify
  - However, we do store product status (whether a product is a draft, active or archived) and surface this in Sanity studio
- Some images (such as product and cart line item thumbnails) are served by Shopify's CDN whilst other images (such as product-level image galleries) are handled by Sanity's Image API.
- We only concern ourselves with Shopify _products_. Other Shopify document types – such as _collections_, _pages_ and _blog posts_ – are managed entirely in Sanity.

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

### Fetching data with useSanityQuery

Hydrogen provides the [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery) hook which you can use to fetch any information about your shop or products via the [Storefront API](https://shopify.dev/api/storefront).

On top of this, you have the flexibility to additionally query your Sanity dataset using our [HTTP API](https://www.sanity.io/docs/http-api) or [JavaScript client library](https://www.sanity.io/docs/js-client).

However if you're using Sanity and Shopify together, it's highly likely that you're referencing content between both your Sanity documents and Shopify products.

To illustrate two examples:

- You want to display a promotional page which references any number of Shopify products.
- You want to display a product detail page which also references a number of custom document types, tags and other rich media you've defined in Sanity.

Having to manually fetch from both your Sanity dataset and Shopify's Storefront API, and then stitch together that data is laborious and error prone – especially if you want to reference products in deeply nested data structures, such as Portable Text.

To help streamline the process of fetching from both sources and reconciling these references, we provide a `useSanityQuery` hook.

#### How it works

<img width="1272" alt="useSanityQuery-flow-diagram" src="https://user-images.githubusercontent.com/209129/141044556-6fbcfaf4-226e-4749-aa0e-6428c5f46850.png">

TODO: code snippets

#### Assumptions

TODO: fixed IDs, required responses

## Getting started

### Requirements:

- Node.js 14.0 or higher

### Installation

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

### Deployment

Please see [Hydrogen's documentation on deployment](https://shopify.dev/custom-storefronts/hydrogen/deployment)

## License

This repository is published under the [MIT](LICENSE) license.
