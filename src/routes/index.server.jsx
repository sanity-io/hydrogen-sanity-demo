import {
  CacheDays,
  flattenConnection,
  Link,
  Seo,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import {Suspense} from 'react';
import FeaturedCollection from '../components/FeaturedCollection';
import Layout from '../components/Layout.server';
import ProductCard from '../components/ProductCard';

export default function IndexRoute() {
  const {countryCode = 'US'} = useSession();

  return (
    <Layout>
      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>
      <div className="relative">
        <h1 className="mx-auto max-w-[60rem] pb-8 pt-34 text-center text-4xl font-medium">
          (Home modules)
        </h1>
        {/*
        <Suspense fallback={<BoxFallback />}>
          <FeaturedProductsBox country={countryCode} />
        </Suspense>
        */}
        {/*
        <Suspense fallback={<BoxFallback />}>
          <FeaturedCollectionBox country={countryCode} />
        </Suspense>
        */}
      </div>
    </Layout>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: SEO_QUERY,
    cache: CacheDays(),
    preload: true,
  });

  return (
    <Seo
      type="homepage"
      data={{
        title,
        description,
      }}
    />
  );
}

function BoxFallback() {
  return <div className="mb-10 h-40 rounded-xl p-12"></div>;
}

/*
function FeaturedProductsBox({country}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const featuredProductsCollection = collections[0];
  const featuredProducts = featuredProductsCollection
    ? flattenConnection(featuredProductsCollection.products)
    : null;

  return (
    <div>
      {featuredProductsCollection ? (
        <div className="mb-8 flex items-center justify-between text-md font-medium">
          <span>{featuredProductsCollection.title}</span>

          <span className="hidden md:inline-flex">
            <Link
              to={`/collections/${featuredProductsCollection.handle}`}
              className="text-blue-600 hover:underline"
            >
              Shop all
            </Link>
          </span>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <div key={product.id}>
              <ProductCard storefrontProduct={product} />
            </div>
          ))}
        </div>
        <div className="text-center md:hidden">
          <Link
            to={`/collections/${featuredProductsCollection.handle}`}
            className="text-blue-600"
          >
            Shop all
          </Link>
        </div>
      ) : null}
    </div>
  );
}
*/

/*
function FeaturedCollectionBox({country}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const featuredCollection =
    collections && collections.length > 1 ? collections[1] : collections[0];

  return <FeaturedCollection collection={featuredCollection} />;
}
*/

const SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;

const QUERY = gql`
  query indexContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 2) {
      edges {
        node {
          handle
          id
          title
          image {
            id
            url
            altText
            width
            height
          }
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
      }
    }
  }
`;
