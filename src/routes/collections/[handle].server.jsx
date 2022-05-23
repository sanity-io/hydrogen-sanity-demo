import {
  flattenConnection,
  Seo,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import pluralize from 'pluralize';
import DebugWrapper from '../../components/DebugWrapper';
import Layout from '../../components/Layout.server';
import LoadMoreProducts from '../../components/LoadMoreProducts.client';
import NotFound from '../../components/NotFound.server';
import ProductCard from '../../components/ProductCard';

export default function CollectionRoute({collectionProductCount = 24, params}) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      country: countryCode,
      language: languageCode,
      numProducts: collectionProductCount,
    },
    preload: true,
  });

  if (data?.collection == null) {
    return <NotFound />;
  }

  const collection = data.collection;
  const products = flattenConnection(collection.products);
  const hasNextPage = data.collection.products.pageInfo.hasNextPage;

  return (
    <Layout>
      {/* the seo object will be expose in API version 2022-04 or later */}
      <Seo type="collection" data={collection} />

      <DebugWrapper name="Collection Details" shopify>
        {/* Title */}
        <h1 className="font-medium">{collection.title}</h1>
        {/* Description */}
        <div dangerouslySetInnerHTML={{__html: collection.descriptionHtml}} />
      </DebugWrapper>

      <p className="my-5 text-sm">
        {pluralize('product', products.length, true)}
      </p>

      <DebugWrapper name="Collection Products" shopify>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </DebugWrapper>

      {hasNextPage && (
        <LoadMoreProducts startingCount={collectionProductCount} />
      )}
    </Layout>
  );
}

const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $numProducts: Int!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      descriptionHtml
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $numProducts) {
        edges {
          node {
            title
            vendor
            handle
            descriptionHtml
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
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;
