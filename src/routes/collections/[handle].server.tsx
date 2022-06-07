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
import useSanityQuery from '../../hooks/useSanityQuery';
import {useMemo} from 'react';
import HeroCollection from '../../components/heroes/HeroCollection.server';
import Layout from '../../components/Layout.server';
import LoadMoreProducts from '../../components/LoadMoreProducts.client';
import NotFound from '../../components/NotFound.server';
import ModuleGrid from '../../components/ModuleGrid.server';
import SelectSortOrder from '../../components/selects/SelectSortOrder.client';
import {COLLECTION_PAGE_SIZE} from '../../constants';
import {COLLECTION_PAGE} from '../../fragments/collectionPage';
import type {SanityCollectionPage} from '../../types';
import {combineProductsAndModules} from '../../utils/combineProductsAndModules';
import clsx from 'clsx';

type Props = {
  collectionProductCount: number;
  params: any;
  productSort?: {
    key?: string;
    reverse?: boolean;
  };
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

  const {data: sanityCollection} = useSanityQuery<SanityCollectionPage>({
    params: {slug: handle},
    query: SANITY_QUERY,
  });

  if (data?.collection == null || !sanityCollection) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

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

  return (
    <Layout>
      {/* Hero */}
      <HeroCollection
        colorTheme={sanityCollection.colorTheme}
        fallbackTitle={sanityCollection.title}
        hero={sanityCollection.hero}
      />

      <div
        className={clsx(
          'mb-32 mt-8 px-4 pb-overlap', //
          'md:px-8',
        )}
      >
        {products.length > 0 && (
          <div
            className={clsx(
              'mb-8 flex justify-start', //
              'md:justify-end',
            )}
          >
            <SelectSortOrder
              key={sanityCollection._id}
              initialSortOrder={sanityCollection.sortOrder}
            />
          </div>
        )}
        {/* No results */}
        {products.length === 0 && (
          <div className="mt-16 text-center text-lg text-darkGray">
            No products.
          </div>
        )}

        <ModuleGrid colorTheme={sanityCollection.colorTheme} items={items} />

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
      image {
        altText
        height
        id
        url
        width
      }
      products(
        first: $numProducts
        reverse: $productSortReverse
        sortKey: $productSortKey
      ) {
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
                  availableForSale
                  compareAtPriceV2 {
                    currencyCode
                    amount
                  }
                  id
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
                  selectedOptions {
                    name
                    value
                  }
                  title
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
      seo {
        description
        title
      }
      title
    }
  }
`;
