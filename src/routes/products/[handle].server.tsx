import {
  flattenConnection,
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useRouteParams,
  useServerAnalytics,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import groq from 'groq';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductEditorial from '../../components/product/Editorial.server';
import ProductGallery from '../../components/product/Gallery.client';
import RelatedProducts from '../../components/product/RelatedProducts.server';
import ProductWidget from '../../components/product/Widget.client';
import ProductOptionsWrapper from '../../components/ProductOptionsWrapper.client';
import {PRODUCT_PAGE} from '../../fragments/pages/product';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {SanityProductPage} from '../../types';

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
  let storefrontProduct;
  if (sanityProduct?.gid) {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
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

  const initialVariant = flattenConnection(
    storefrontProduct.variants,
  )[0] as ProductVariant;

  return (
    <Layout>
      <div className="relative w-full">
        <ProductOptionsWrapper
          data={storefrontProduct}
          initialVariantId={initialVariant?.id}
        >
          {/* Gallery */}
          <ProductGallery storefrontProduct={storefrontProduct} />

          {/* Widget (mobile) */}
          <div className="mb-8 lg:hidden">
            <ProductWidget
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
            />
          </div>

          {/* Widget (desktop) */}
          <div
            className={clsx(
              'pointer-events-none absolute top-0 right-0 z-10 hidden h-full w-[315px]',
              'lg:block',
            )}
          >
            <div className="sticky top-0 h-screen">
              <div className="absolute bottom-0 w-full p-4">
                <ProductWidget
                  sanityProduct={sanityProduct}
                  storefrontProduct={storefrontProduct}
                />
              </div>
            </div>
          </div>
        </ProductOptionsWrapper>

        <div
          className={clsx(
            'w-full', //
            'lg:w-[calc(100%-315px)]',
          )}
        >
          <ProductEditorial
            colorTheme={sanityProduct?.colorTheme}
            sanityProduct={sanityProduct}
          />
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
  query product($country: CountryCode, $id: ID!, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product: product(id: $id) {
      handle
      id
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
          ... on Video {
            id
            mediaContentType
            previewImage {
              url
            }
            sources {
              mimeType
              url
            }
          }
          ... on ExternalVideo {
            embedUrl
            host
            id
            mediaContentType
          }
          ... on Model3d {
            alt
            id
            mediaContentType
            previewImage {
              url
            }
            sources {
              url
            }
          }
        }
      }
      options {
        name
        values
      }
      title
      variants(first: 250) {
        nodes {
          availableForSale
          compareAtPriceV2 {
            amount
            currencyCode
          }
          id
          image {
            altText
            height
            id
            url
            width
          }
          priceV2 {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          title
        }
      }
      vendor
    }
  }
`;
