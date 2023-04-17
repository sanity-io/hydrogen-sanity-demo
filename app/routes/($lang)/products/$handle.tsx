import {useLoaderData} from '@remix-run/react';
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
import clsx from 'clsx';
import groq from 'groq';
import {json} from 'react-router';
import invariant from 'tiny-invariant';

import PortableText from '~/components/portableText/PortableText';
import ProductDetails from '~/components/product/Details';
import ProductForm from '~/components/product/Form';
import ProductGallery from '~/components/ProductGallery';
import {getStorefrontData} from '~/lib/storefrontData';
import {validateLocale} from '~/lib/utils';
import {PRODUCT_PAGE} from '~/queries/sanity/fragments/pages/product';
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

  return json({
    page,
    product,
    selectedVariant,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
  });
}

export default function ProductHandle() {
  const {page, product, selectedVariant, analytics} = useLoaderData();

  return (
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
    // <section className="grid w-full gap-4 px-6 md:gap-8 md:px-8 lg:px-12">
    //   <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-20">
    //     <div className="grid md:w-full  md:grid-flow-row md:grid-cols-2 md:overflow-x-hidden md:p-0 lg:col-span-2">
    //       <div className="card-image aspect-square w-[80vw] snap-center rounded shadow md:col-span-2 md:w-full">
    //         <ProductGallery media={product.media.nodes} />
    //       </div>
    //     </div>
    //     <div className="top-[6rem] grid max-w-xl gap-8 p-0 md:sticky md:mx-auto md:max-w-[24rem] md:p-6 md:px-0 lg:top-[8rem] xl:top-[10rem]">
    //       <div className="grid gap-2">
    //         <h1 className="leading-10 whitespace-normal text-4xl font-bold">
    //           {product.title}
    //         </h1>
    //         <span className="inherit text-copy max-w-prose whitespace-pre-wrap font-medium opacity-50">
    //           {product.vendor}
    //         </span>
    //       </div>
    //       <ProductForm
    //         product={product}
    //         selectedVariant={selectedVariant}
    //         analytics={analytics}
    //       />
    //       <div
    //         className="prose border-gray-200 border-t pt-6 text-md text-black"
    //         dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
    //       />
    //     </div>
    //   </div>
    // </section>
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
  query product($country: CountryCode, $language: LanguageCode, $handle: String!, $selectedOptions: [SelectedOptionInput!]!)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      media(first: 10) {
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
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
