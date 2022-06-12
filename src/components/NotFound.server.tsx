import {
  gql,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import groq from 'groq';
import {NOT_FOUND_PAGE} from '../fragments/pages/notFound';
import useSanityQuery from '../hooks/useSanityQuery';
import type {
  CollectionWithNodes,
  ProductWithNodes,
  SanityNotFoundPage,
} from '../types';
import Layout from './Layout.server';
import ProductPill from './product/Pill';

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */

type Props = {
  response: any;
};

type ShopifyPayload = {
  collection: CollectionWithNodes;
};

export default function NotFound({response}: Props) {
  if (response) {
    response.doNotStream();
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
    const {countryCode = 'US'} = useSession();
    const {languageCode} = useShop();
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
        {sanityData?.title && (
          <h1 className="mx-auto px-12 text-center text-4xl sm:max-w-2xl">
            {sanityData.title}
          </h1>
        )}

        {sanityData?.body && (
          <p className="my-8 text-center">{sanityData.body}</p>
        )}

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
  query NotFoundCollectionProductDetails(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      products(first: 16) {
        nodes {
          handle
          id
          options {
            name
            values
          }
          title
          variants(first: 1) {
            nodes {
              id
              title
              availableForSale
              image {
                altText
                height
                id
                url
                width
              }
              priceV2 {
                currencyCode
                amount
              }
              compareAtPriceV2 {
                currencyCode
                amount
              }
            }
          }
          vendor
        }
      }
    }
  }
`;
