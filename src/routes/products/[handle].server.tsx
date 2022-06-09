import {
  flattenConnection,
  gql,
  ProductProvider,
  Seo,
  useRouteParams,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import groq from 'groq';
import Gallery from '../../components/Gallery.client';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/product/ProductDetails.client';
import ProductEditorial from '../../components/product/ProductEditorial.server';
import ProductWidget from '../../components/product/ProductWidget.client';
import RelatedProducts from '../../components/RelatedProducts.server';
import {PRODUCT_PAGE} from '../../fragments/productPage';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {SanityProductPage} from '../../types';

type ShopifyPayload = {
  product: Pick<
    Product,
    'handle' | 'id' | 'media' | 'seo' | 'title' | 'variants' | 'vendor'
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

  if (!sanityProduct || !storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityProduct.seo;

  const initialVariant = flattenConnection(
    storefrontProduct.variants,
  )[0] as ProductVariant;

  return (
    <ProductProvider
      data={storefrontProduct}
      initialVariantId={initialVariant.id}
    >
      <Layout>
        <div className="relative w-full">
          <Gallery />

          {/* Mobile widget layout */}
          <div className="mb-8 lg:hidden">
            <ProductWidget sanityProduct={sanityProduct} />
          </div>

          <div
            className={clsx(
              'w-full', //
              'lg:w-[calc(100%-315px)]',
            )}
          >
            <ProductDetails />
            <ProductEditorial
              colorTheme={sanityProduct?.colorTheme}
              sanityProduct={sanityProduct}
            />
          </div>

          {/* Desktop */}
          <div
            className={clsx(
              'pointer-events-none absolute top-0 right-0 z-10 hidden h-full w-[315px]',
              'lg:block',
            )}
          >
            <div className="sticky top-0 h-screen">
              <div className="absolute bottom-0 w-full p-4">
                <ProductWidget sanityProduct={sanityProduct} />
              </div>
            </div>
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
    </ProductProvider>
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
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                altText
                height
                id
                url
                width
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
            ... on Model3d {
              mediaContentType
              id
              alt
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
      }
      title
      variants(first: 250) {
        edges {
          node {
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
            sku
            title
          }
        }
      }
      vendor
    }
  }
`;
