import {Await, useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  type SeoConfig,
  type SeoHandleFunction,
  ShopifyAnalyticsProduct,
} from '@shopify/hydrogen';
import type {
  MediaConnection,
  MediaImage,
  Product,
  ProductVariant,
  SelectedOptionInput,
} from '@shopify/hydrogen/storefront-api-types';
import {AnalyticsPageType} from '@shopify/hydrogen-react';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import groq from 'groq';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import {Skeleton} from '~/components/global/Skeleton';
import PortableText from '~/components/portableText/PortableText';
import ProductDetails from '~/components/product/Details';
import RelatedProducts from '~/components/product/RelatedProducts';
import {getStorefrontData} from '~/lib/storefrontData';
import {validateLocale} from '~/lib/utils';
import {PRODUCT_PAGE} from '~/queries/sanity/fragments/pages/product';
import {
  PRODUCT_FIELDS,
  PRODUCT_VARIANT_FIELDS,
} from '~/queries/shopify/product';
import {SanityProductPage} from '~/types/sanity';

const seo: SeoHandleFunction = ({data}) => {
  const media = flattenConnection<MediaConnection>(data.product?.media).find(
    (media) => media.mediaContentType === 'IMAGE',
  ) as MediaImage | undefined;

  return {
    title:
      data?.page?.seo?.title ??
      data?.product?.seo?.title ??
      data?.product?.title,
    media: data?.page?.seo?.image ?? media?.image,
    description:
      data?.page?.seo?.description ??
      data?.product?.seo?.description ??
      data?.product?.description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: data?.product?.vendor,
      name: data?.product?.title,
    },
  } satisfies SeoConfig<Product>;
};

export const handle = {
  seo,
};

export async function loader({params, context, request}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  invariant(handle, 'Missing handle param, check route filename');

  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: SelectedOptionInput[] = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const [page, {product}] = await Promise.all([
    context.sanity.client.fetch<SanityProductPage>(QUERY_SANITY, {
      slug: params.handle,
    }),
    context.storefront.query<{
      product: Product & {selectedVariant?: ProductVariant};
    }>(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
      },
    }),
  ]);

  if (!page || !product?.id) {
    throw new Response(null, {status: 404});
  }

  // Resolve any references to products on the Storefront API
  const storefrontData = await getStorefrontData({page, context});

  // Get recommended products from Shopify
  const recommended = context.storefront.query<{
    product: Product & {selectedVariant?: ProductVariant};
  }>(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {
      productId: product.id,
    },
  });

  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  return defer({
    page,
    product,
    storefrontData,
    selectedVariant,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
  });
}

export default function ProductHandle() {
  const {page, product, selectedVariant, analytics, recommended} =
    useLoaderData();

  return (
    <>
      <div className="relative w-full">
        <ProductDetails
          selectedVariant={selectedVariant}
          sanityProduct={page}
          storefrontProduct={product}
          analytics={analytics}
        />

        <div
          className={clsx(
            'w-full', //
            'lg:w-[calc(100%-315px)]',
          )}
        >
          {/* Body */}
          {page?.body && (
            <PortableText
              blocks={page.body}
              className={clsx(
                'max-w-[660px] px-4 pb-24 pt-8', //
                'md:px-8',
              )}
              colorTheme={page?.colorTheme}
            />
          )}
        </div>
      </div>

      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <RelatedProducts
              relatedProducts={products.productRecommendations}
              colorTheme={page?.colorTheme}
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ][0]{
    ${PRODUCT_PAGE}
  }
`;

const PRODUCT_QUERY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product($country: CountryCode, $language: LanguageCode, $handle: String!, $selectedOptions: [SelectedOptionInput!]!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductFields
      media(first: 20) {
        nodes {
          ... on MediaImage {
            id
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            sources {
              mimeType
              url
            }
          }
        }
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFields
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query productRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductFields
      variants(first: 1) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
