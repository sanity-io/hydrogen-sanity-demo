import {
  flattenConnection,
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
import gql from 'graphql-tag';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import Gallery from '../../components/Gallery.client';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import ProductEditorial from '../../components/ProductEditorial.server';
import ProductWidget from '../../components/ProductWidget.client';
import RelatedProducts from '../../components/RelatedProducts.server';
import {PRODUCT_PAGE} from '../../fragments/productPage';
import type {SanityProductPage} from '../../types';

type SanityPayload = {
  sanityData: SanityProductPage;
};

type ShopifyPayload = {
  data: {
    product: Pick<
      Product,
      | 'compareAtPriceRange'
      | 'featuredImage'
      | 'handle'
      | 'id'
      | 'media'
      | 'priceRange'
      | 'seo'
      | 'title'
      | 'variants'
      | 'vendor'
    >;
  };
};

export default function ProductRoute() {
  const {languageCode} = useShop();
  const {handle} = useRouteParams();
  const {countryCode = 'US'} = useSession();

  // Fetch Sanity document
  const {sanityData: sanityProduct} = useSanityQuery({
    clientConfig,
    getProductGraphQLFragment: () => false,
    params: {slug: handle},
    query: QUERY,
  }) as SanityPayload;

  // Fetch Shopify document
  const {
    data: {product: storefrontProduct},
  } = useShopQuery({
    query: QUERY_SHOPIFY,
    variables: {
      country: countryCode,
      id: sanityProduct.store.gid,
      language: languageCode,
    },
  }) as ShopifyPayload;

  if (!sanityProduct || !storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const initialVariant = flattenConnection(
    storefrontProduct.variants,
  )[0] as ProductVariant;

  return (
    <ProductProvider
      data={storefrontProduct}
      initialVariantId={initialVariant.id}
    >
      <Layout>
        <div className="relative min-h-screen w-full">
          <div className="w-50 pointer-events-none absolute right-8 z-10 h-full">
            <ProductWidget sanityProduct={sanityProduct} />
          </div>
          <Gallery />
          <ProductDetails />
          <ProductEditorial sanityProduct={sanityProduct} />
        </div>

        <RelatedProducts
          colorTheme={sanityProduct?.colorTheme}
          storefrontProduct={storefrontProduct}
        />

        <Seo type="product" data={storefrontProduct} />
      </Layout>
    </ProductProvider>
  );
}

const QUERY = groq`
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
      compareAtPriceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      featuredImage {
        url
        width
        height
        altText
      }
      handle
      id
      media(first: 6) {
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
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
      priceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      seo {
        description
        title
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
              id
              url
              altText
              width
              height
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
            unitPrice {
              amount
              currencyCode
            }
            unitPriceMeasurement {
              measuredType
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }
          }
        }
      }
      vendor
    }
  }
`;
