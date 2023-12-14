import {Await, useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  getSelectedProductOptions,
  type SeoConfig,
  type SeoHandleFunction,
  ShopifyAnalyticsProduct,
} from '@shopify/hydrogen';
import type {
  MediaConnection,
  MediaImage,
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {AnalyticsPageType} from '@shopify/hydrogen-react';
import {defer, type LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import PortableText from '~/components/portableText/PortableText';
import ProductDetails from '~/components/product/Details';
import RelatedProducts from '~/components/product/RelatedProducts';
import type {SanityProductPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {PRODUCT_PAGE_QUERY} from '~/queries/sanity/product';
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from '~/queries/shopify/product';

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

export async function loader({params, context, request}: LoaderFunctionArgs) {
  validateLocale({context, params});

  const {handle} = params;
  invariant(handle, 'Missing handle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, {product}] = await Promise.all([
    context.sanity.query<SanityProductPage>({
      query: PRODUCT_PAGE_QUERY,
      params: {
        slug: params.handle,
      },
      cache,
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
    throw notFound();
  }

  if (!product.selectedVariant) {
    return redirectToFirstVariant({product, request});
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  // In order to show which variants are available in the UI, we need to query
  // all of them. We defer this query so that it doesn't block the page.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle,
    },
  });

  // Get recommended products from Shopify
  const recommended = context.storefront.query<{
    product: Product & {selectedVariant?: ProductVariant};
  }>(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {
      productId: product.id,
    },
  });

  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

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
    variants,
    gids,
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

function redirectToFirstVariant({
  product,
  request,
}: {
  product: Product;
  request: Request;
}) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  throw redirect(
    `/products/${product!.handle}?${searchParams.toString()}`,
    302,
  );
}

export default function ProductHandle() {
  const {
    page,
    product,
    variants,
    selectedVariant,
    analytics,
    recommended,
    gids,
  } = useLoaderData();
  return (
    <ColorTheme value={page.colorTheme}>
      <div className="relative w-full">
        <Suspense
          fallback={
            <ProductDetails
              selectedVariant={selectedVariant}
              sanityProduct={page}
              storefrontProduct={product}
              storefrontVariants={[]}
              analytics={analytics}
            />
          }
        >
          <Await
            errorElement="There was a problem loading related products"
            resolve={variants}
          >
            {(resp) => (
              <ProductDetails
                selectedVariant={selectedVariant}
                sanityProduct={page}
                storefrontProduct={product}
                storefrontVariants={resp.product?.variants.nodes || []}
                analytics={analytics}
              />
            )}
          </Await>
        </Suspense>

        <div
          className={clsx(
            'w-full', //
            'lg:w-[calc(100%-315px)]',
          )}
        >
          {/* Body */}
          {page?.body && (
            <Suspense>
              <Await resolve={gids}>
                <PortableText
                  blocks={page.body}
                  className={clsx(
                    'max-w-[660px] px-4 pb-24 pt-8', //
                    'md:px-8',
                  )}
                />
              </Await>
            </Suspense>
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
            />
          )}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
