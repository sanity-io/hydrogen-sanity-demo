import {
  flattenConnection,
  gql,
  Seo,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import {useMemo} from 'react';
import clientConfig from '../../../sanity.config';
import HeroCollection from '../../components/heroes/HeroCollection.server';
import Layout from '../../components/Layout.server';
import LoadMoreProducts from '../../components/LoadMoreProducts.client';
import NotFound from '../../components/NotFound.server';
import LayoutGrid from '../../components/LayoutGrid.server';
import SelectSortOrder from '../../components/selects/SelectSortOrder.client';
import {COLLECTION_PAGE_SIZE} from '../../constants';
import {COLLECTION_PAGE} from '../../fragments/collectionPage';
import type {SanityCollectionPage} from '../../types';
import {combineProductsAndModules} from '../../utils/combineProductsAndModules';

type Props = {
  collectionProductCount: number;
  params: any;
  productSort?: {
    key?: string;
    reverse?: boolean;
  };
};

type SanityPayload = {
  sanityData: SanityCollectionPage;
};

type ShopifyPayload = {
  collection: Collection;
};

export default function CollectionRoute({
  collectionProductCount = COLLECTION_PAGE_SIZE,
  params,
  productSort,
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
      productSortKey: productSort?.key,
      productSortReverse: productSort?.reverse,
    },
    preload: true,
  });

  // TODO: add collection support to `useSanityQuery`
  const {sanityData: sanityCollection} = useSanityQuery({
    clientConfig,
    getProductGraphQLFragment: () => false,
    params: {
      slug: handle,
    },
    query: SANITY_QUERY,
  }) as SanityPayload;

  const collection = data.collection;
  const products = flattenConnection(collection.products) as Product[];
  const hasNextPage = data.collection.products.pageInfo.hasNextPage;

  const items = useMemo(() => {
    // Create combined list of both products and modules, with modules inserted at regular intervals
    return combineProductsAndModules({
      modules: sanityCollection.modules,
      products,
    });
  }, []);

  if (data?.collection == null || !sanityCollection) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Hero */}
      <HeroCollection
        colorTheme={sanityCollection.colorTheme}
        fallbackTitle={sanityCollection.title}
        hero={sanityCollection.hero}
      />

      {/* HTML Description */}
      {/* <div dangerouslySetInnerHTML={{__html: collection.descriptionHtml}} /> */}

      <div className="mb-32 mt-8 px-8 pb-overlap">
        {products.length > 0 && (
          <div className="mb-8 flex justify-end">
            <SelectSortOrder
              key={sanityCollection._id}
              initialSortOrder={sanityCollection.store.sortOrder}
            />
          </div>
        )}
        {/* No results */}
        {products.length === 0 && (
          <div className="mt-16 text-center text-lg text-darkGray">
            No products.
          </div>
        )}

        <LayoutGrid colorTheme={sanityCollection.colorTheme} items={items} />

        {hasNextPage && (
          <LoadMoreProducts startingCount={collectionProductCount} />
        )}
      </div>

      {/* the seo object will be exposed in API version 2022-04 or later */}
      <Seo type="collection" data={collection} />
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
    $productSortKey: ProductCollectionSortKeys
    $productSortReverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
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
      products(
        first: $numProducts
        reverse: $productSortReverse
        sortKey: $productSortKey
      ) {
        edges {
          node {
            handle
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
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;
