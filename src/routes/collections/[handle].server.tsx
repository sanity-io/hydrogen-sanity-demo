import {
  gql,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import groq from 'groq';
import {useMemo} from 'react';
import LoadMoreProducts from '../../components/collection/LoadMoreProducts.client';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import CollectionHero from '../../components/heroes/Collection.server';
import ModuleGrid from '../../components/modules/ModuleGrid.server';
import SortOrderSelect from '../../components/collection/SortOrderSelect.client';
import {COLLECTION_PAGE_SIZE} from '../../constants';
import {COLLECTION_PAGE} from '../../fragments/pages/collection';
import useSanityQuery from '../../hooks/useSanityQuery';
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
    query: QUERY_SHOPIFY,
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

  // Shopify analytics
  useServerAnalytics(
    data?.collection
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.collection,
            resourceId: data.collection.id,
          },
        }
      : null,
  );

  const {data: sanityCollection} = useSanityQuery<SanityCollectionPage>({
    params: {slug: handle},
    query: QUERY_SANITY,
  });

  if (data?.collection == null || !sanityCollection) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityCollection.seo;
  const collection = data.collection;
  const products = collection.products.nodes;
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
      <CollectionHero
        colorTheme={sanityCollection.colorTheme}
        fallbackTitle={sanityCollection.title}
        hero={sanityCollection.hero}
      />

      <div
        className={clsx(
          'mb-32 mt-8 px-4', //
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
            <SortOrderSelect
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

      <Seo
        data={{
          ...(sanitySeo.image
            ? {
                image: {
                  height: sanitySeo.image.height,
                  url: sanitySeo.image.url,
                  width: sanitySeo.image.width,
                },
              }
            : {}),
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="collection"
      />
    </Layout>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'collection'
    && store.slug.current == $slug
  ][0]{
    ${COLLECTION_PAGE}
  }
`;

const QUERY_SHOPIFY = gql`
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
        nodes {
          handle
          id
          options {
            name
            values
          }
          title
          variants(first: 1) {
            nodes {
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
          vendor
        }
        pageInfo {
          hasNextPage
        }
      }
      title
    }
  }
`;
