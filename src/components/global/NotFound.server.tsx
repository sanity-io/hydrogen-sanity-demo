import {
  gql,
  ShopifyAnalyticsConstants,
  useLocalization,
  useServerAnalytics,
  useShopQuery,
  type HydrogenResponse,
} from '@shopify/hydrogen';
import groq from 'groq';
import {NOT_FOUND_PAGE} from '../../fragments/sanity/pages/notFound';
import {PRODUCT_FIELDS} from '../../fragments/shopify/product';
import {PRODUCT_VARIANT_FIELDS} from '../../fragments/shopify/productVariant';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {
  CollectionWithNodes,
  ProductWithNodes,
  SanityNotFoundPage,
} from '../../types';
import ProductPill from '../product/Pill';
import Layout from './Layout.server';

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */

type Props = {
  response: HydrogenResponse;
};

type ShopifyPayload = {
  collection: CollectionWithNodes;
};

export default function NotFound({response}: Props) {
  if (response) {
    response.status = 404;
    response.statusText = 'Not found';
  }

  // Shopify analytics
  useServerAnalytics({
    shopify: {pageType: ShopifyAnalyticsConstants.pageType.notFound},
  });

  const {data: sanityData} = useSanityQuery<SanityNotFoundPage>({
    query: QUERY_SANITY,
  });

  // Conditionally fetch collection products
  let products: ProductWithNodes[] = [];
  if (sanityData?.collectionGid) {
    const {
      language: {isoCode: languageCode},
      country: {isoCode: countryCode},
    } = useLocalization();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        id: sanityData?.collectionGid,
        language: languageCode,
      },
    });

    products = data.collection.products.nodes;
  }

  return (
    <Layout backgroundColor={sanityData?.colorTheme?.background}>
      <div className="pt-34">
        <h1 className="mx-auto px-12 text-center text-4xl sm:max-w-2xl">
          {sanityData?.title || 'Page not found'}
        </h1>

        <p className="my-8 text-center">
          {sanityData?.body || "We couldn't find the page you're looking for."}
        </p>

        <div className="mx-4 mb-18 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <div key={product.id}>
              <ProductPill storefrontProduct={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0] {
    ...notFoundPage {
      ${NOT_FOUND_PAGE}
    }
  }
`;

const QUERY_SHOPIFY = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query NotFoundCollectionProductDetails(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      products(first: 16) {
        nodes {
          ...ProductFields
          variants(first: 1) {
            nodes {
              ...ProductVariantFields
            }
          }
        }
      }
    }
  }
`;
