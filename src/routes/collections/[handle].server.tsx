import {
  flattenConnection,
  Seo,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import gql from 'graphql-tag';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import pluralize from 'pluralize';
import clientConfig from '../../../sanity.config';
import DebugWrapper from '../../components/DebugWrapper';
import Layout from '../../components/Layout.server';
import LoadMoreProducts from '../../components/LoadMoreProducts.client';
import NotFound from '../../components/NotFound.server';
import ProductCard from '../../components/ProductCard';
import {COLLECTION_PAGE} from '../../fragments/collectionPage';
import {SanityCollection} from '../../types';

type Props = {
  collectionProductCount: number;
  params: any;
};

type SanityPayload = {
  sanityData: SanityCollection;
  // shopifyProducts: Record<string, Product>;
};

type ShopifyPayload = {
  collection: Collection;
};

export default function CollectionRoute({
  collectionProductCount = 24,
  params,
}: Props) {
  const {languageCode} = useShop();
  const {countryCode = 'US'} = useSession();

  const {handle} = params;
  const {data} = useShopQuery<ShopifyPayload>({
    query: QUERY,
    variables: {
      handle,
      country: countryCode,
      language: languageCode,
      numProducts: collectionProductCount,
    },
    preload: true,
  });

  // TODO: add collection support to `useSanityQuery`
  const {
    sanityData: sanityCollection,
    // shopifyProducts
  } = useSanityQuery({
    clientConfig,
    params: {
      slug: handle,
    },
    query: SANITY_QUERY,
    shopifyVariables: {
      country: countryCode,
    },
  }) as SanityPayload;

  if (data?.collection == null || !sanityCollection) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const collection = data.collection;
  const products = flattenConnection(collection.products) as Product[];
  const hasNextPage = data.collection.products.pageInfo.hasNextPage;

  return (
    <Layout colorTheme={sanityCollection?.colorTheme}>
      {/* the seo object will be expose in API version 2022-04 or later */}
      <Seo type="collection" data={collection} />

      {/* Collection hero */}
      <div className="bg-red-500">
        {/* Title */}
        <h1 className="text-7xl font-medium">{collection.title}</h1>
        {/* Description */}
        <div dangerouslySetInnerHTML={{__html: collection.descriptionHtml}} />
      </div>

      <p className="my-5 text-sm">
        {pluralize('product', products.length, true)}
      </p>

      <DebugWrapper name="Collection Products" shopify>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard storefrontProduct={product} />
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

const SANITY_QUERY = groq`
  *[
    _type == 'collection'
    && store.slug.current == $slug
  ][0]{
    ${COLLECTION_PAGE}
  }
`;

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
