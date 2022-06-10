import {
  flattenConnection,
  gql,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import groq from 'groq';
import {NOT_FOUND_PAGE} from '../fragments/pages/notFound';
import useSanityQuery from '../hooks/useSanityQuery';
import {SanityNotFoundPage} from '../types';
import Layout from './Layout.server';
import ProductPill from './product/Pill';

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
  if (response) {
    response.doNotStream();
    response.writeHead({status: 404, statusText: 'Not found'});
  }

  const {data: sanityData} = useSanityQuery<SanityNotFoundPage>({
    query: SANITY_QUERY,
  });

  // Conditionally fetch collection products
  let products;
  if (sanityData?.collectionGid) {
    const {countryCode = 'US'} = useSession();
    const {languageCode} = useShop();
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
              <ProductPill storefrontProduct={product} />
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
