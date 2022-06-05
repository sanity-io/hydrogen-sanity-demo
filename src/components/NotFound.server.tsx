import {
  gql,
  flattenConnection,
  useShop,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {NOT_FOUND_PAGE} from '../fragments/notFoundPage';
import {SanityNotFoundPage} from '../types';
import Layout from './Layout.server';
import PillProduct from './pills/PillProduct';

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */

type Props = {
  response: any;
};

type ShopifyPayload = {
  collection: Collection;
};

export default function NotFound({response}: Props) {
  const {countryCode = 'US'} = useSession();

  if (response) {
    response.doNotStream();
    response.writeHead({status: 404, statusText: 'Not found'});
  }

  const {languageCode} = useShop();

  const {sanityData} = useSanityQuery<SanityNotFoundPage>({
    query: SANITY_QUERY,
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
  });

  // Conditionally fetch collection products
  let products;
  if (sanityData?.collectionGid) {
    const {data} = useShopQuery<ShopifyPayload>({
      query: SHOPIFY_QUERY,
      variables: {
        country: countryCode,
        id: sanityData?.collectionGid,
        language: languageCode,
      },
    });

    products = data
      ? (flattenConnection(data.collection.products) as Pick<
          Product,
          'handle' | 'id' | 'options' | 'title' | 'variants' | 'vendor'
        >[])
      : [];
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
              <PillProduct storefrontProduct={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const SANITY_QUERY = groq`
  *[_type == 'settings'][0] {
    ...notFoundPage {
      ${NOT_FOUND_PAGE}
    }
  }
`;

const SHOPIFY_QUERY = gql`
  query NotFoundCollectionProductDetails(
    $country: CountryCode
    $id: ID!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      products(first: 16) {
        edges {
          node {
            handle
            id
            options {
              name
              values
            }
            title
            variants(first: 1) {
              edges {
                node {
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
            }
            vendor
          }
        }
      }
    }
  }
`;
