import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import groq from 'groq';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PortableText from '../../components/portableText/PortableText.server';
import ProductDetails from '../../components/product/Details.client';
import RelatedProducts from '../../components/product/RelatedProducts.server';
import {PRODUCT_PAGE} from '../../fragments/sanity/pages/product';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {ProductWithNodes, SanityProductPage} from '../../types';

type ShopifyPayload = {
  product: Pick<
    Product,
    | 'handle'
    | 'id'
    | 'media'
    | 'options'
    | 'seo'
    | 'title'
    | 'variants'
    | 'vendor'
  >;
};

export default function ProductRoute() {
  const {handle} = useRouteParams();

  // Fetch Sanity document
  const {data: sanityProduct} = useSanityQuery<SanityProductPage>({
    params: {slug: handle},
    query: QUERY_SANITY,
  });

  // Conditionally fetch Shopify document
  let storefrontProduct: ProductWithNodes | null = null;
  if (sanityProduct?.gid) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();

    const {
      data: {product},
    } = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: sanityProduct.gid,
        language: languageCode,
      },
    });
    storefrontProduct = product;
  }

  // Shopify analytics
  useServerAnalytics(
    storefrontProduct
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.product,
            resourceId: storefrontProduct.id,
          },
        }
      : null,
  );

  if (!sanityProduct || !storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityProduct.seo;

  const initialVariant = storefrontProduct.variants.nodes[0];

  return (
    <Layout>
      <div className="relative w-full">
        <ProductDetails
          initialVariantId={initialVariant?.id}
          sanityProduct={sanityProduct}
          storefrontProduct={storefrontProduct}
        />

        <div
          className={clsx(
            'w-full', //
            'lg:w-[calc(100%-315px)]',
          )}
        >
          {/* Body */}
          {sanityProduct?.body && (
            <PortableText
              blocks={sanityProduct.body}
              className={clsx(
                'max-w-[660px] px-4 pb-24 pt-8', //
                'md:px-8',
              )}
              colorTheme={sanityProduct?.colorTheme}
            />
          )}
        </div>
      </div>

      <RelatedProducts
        colorTheme={sanityProduct?.colorTheme}
        storefrontProduct={storefrontProduct}
      />

      <Seo
        data={{
          ...(sanitySeo.image
            ? {
                featuredImage: {
                  height: sanitySeo.image.height,
                  url: sanitySeo.image.url,
                  width: sanitySeo.image.width,
                },
              }
            : {}),
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="product"
      />
    </Layout>
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

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query product($country: CountryCode, $id: ID!, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      ...ProductFields
      media(first: 20) {
        nodes {
          ... on MediaImage {
            id
            image {
              altText
              height
              id
              url
              width
            }
            mediaContentType
          }
        }
      }
      variants(first: 250) {
        nodes {
          ...ProductVariantFields
        }
      }
    }
  }
`;
