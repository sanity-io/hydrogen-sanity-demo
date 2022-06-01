import {
  gql,
  flattenConnection,
  useShop,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';
import Layout from './Layout.server';
import PillProduct from './pills/PillProduct';

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

  // TODO: bring in text and color theme from sanity

  return (
    <Layout>
      <div className="pt-34">
        <h1 className="mx-auto px-12 text-center text-4xl sm:max-w-2xl">
          Well... you&#8216;re officially lost
        </h1>

        <p className="my-8 text-center">
          But that’s okay, because we’ve brought everything to you instead.
        </p>

        <div className="mx-4 mb-18 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id}>
              <PillProduct storefrontProduct={product} />
            </div>
          ))}
        </div>
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
          vendor
        }
      }
    }
  }
`;
