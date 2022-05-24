import {
  flattenConnection,
  useShop,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import DebugWrapper from './DebugWrapper';
import Layout from './Layout.server';
import ProductPill from './ProductPill';

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */
export default function NotFound({response}) {
  const {countryCode = 'US'} = useSession();

  if (response) {
    response.doNotStream();
    response.writeHead({status: 404, statusText: 'Not found'});
  }

  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
    },
  });
  const products = data ? flattenConnection(data.products) : [];

  return (
    <Layout>
      <div className="bg-indigo-100">
        <DebugWrapper name="Not Found">
          <h1 className="font-medium">Well... you&#8216;re officially lost</h1>
          <button
            className="btn"
            disabled
            // url="/"
          >
            Home
          </button>
        </DebugWrapper>

        <DebugWrapper name="Related products" shopify>
          <div>
            <p className="font-medium">Products you might like</p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductPill storefrontProduct={product} />
                </div>
              ))}
            </div>
          </div>
        </DebugWrapper>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query NotFoundProductDetails($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 16) {
      edges {
        node {
          handle
          id
          title
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                image {
                  id
                  url
                  altText
                  width
                  height
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
        }
      }
    }
  }
`;
