import {
  flattenConnection,
  useShop,
  useSession,
  useShopQuery,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import Button from './Button.client';
import DebugWrapper from './DebugWrapper';
import Layout from './Layout.server';
import ProductCard from './ProductCard';

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */
function NotFoundHero() {
  return (
    <DebugWrapper name="Not found hero">
      <div>
        <div>
          <h1 className="font-medium text-gray-900">
            We&#39;ve lost this page
          </h1>
          <p>
            We couldn’t find the page you’re looking for. Try checking the URL
            or heading back to the home page.
          </p>
          <Button
            className="mt-2 w-96"
            url="/"
            label="Take me to the home page"
          />
        </div>
      </div>
    </DebugWrapper>
  );
}

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
      <NotFoundHero />

      <DebugWrapper name="Related products" shopify>
        <div>
          <p className="font-medium">Products you might like</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </DebugWrapper>
    </Layout>
  );
}

const QUERY = gql`
  query NotFoundProductDetails($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 3) {
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
