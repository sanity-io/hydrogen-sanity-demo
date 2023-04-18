import {useLoaderData, useSearchParams} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import type {Collection as CollectionType} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import groq from 'groq';
import {useMemo} from 'react';
import invariant from 'tiny-invariant';

import ProductGrid from '~/components/collection/ProductGrid';
import SortOrder from '~/components/collection/SortOrder';
import {SORT_OPTIONS} from '~/components/collection/SortOrder';
import CollectionHero from '~/components/heroes/Collection';
import {getStorefrontData} from '~/lib/storefrontData';
import {validateLocale} from '~/lib/utils';
import {COLLECTION_PAGE} from '~/queries/sanity/fragments/pages/collection';
import {COLLECTION_QUERY} from '~/queries/shopify/collection';
import {SanityCollectionPage} from '~/types/sanity';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title ?? data?.collection?.title,
  description: data?.page?.seo?.description ?? data?.collection?.description,
  media: data?.page?.seo?.image ?? data?.collection?.image,
});

export const handle = {
  seo,
};

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured'
  | 'title-a-z'
  | 'title-z-a';

const PAGINATION_SIZE = 12;

export async function loader({params, context, request}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const cursor = searchParams.get('cursor');
  const count = searchParams.get('count');

  invariant(params.handle, 'Missing collection handle');

  const [page, {collection}] = await Promise.all([
    context.sanity.client.fetch<SanityCollectionPage>(QUERY_SANITY, {
      slug: params.handle,
    }),
    context.storefront.query<{collection: any}>(COLLECTION_QUERY, {
      variables: {
        handle,
        cursor,
        sortKey,
        reverse,
        count: count ? parseInt(count) : PAGINATION_SIZE,
      },
    }),
  ]);

  // Handle 404s
  if (!page || !collection) {
    throw new Response(null, {status: 404});
  }

  // Resolve any references to products on the Storefront API
  const storefrontData = await getStorefrontData({page, context});

  return json({
    page,
    collection,
    storefrontData,
    sortKey,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const {collection, page} = useLoaderData();
  const [params] = useSearchParams();
  const sort = params.get('sort');

  const products = collection.products.nodes;

  return (
    <>
      {/* Hero */}
      <CollectionHero
        colorTheme={page.colorTheme}
        fallbackTitle={page.title}
        hero={page.hero}
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
            <SortOrder key={page._id} initialSortOrder={page.sortOrder} />
          </div>
        )}

        {/* No results */}
        {products.length === 0 && (
          <div className="mt-16 text-center text-lg text-darkGray">
            No products.
          </div>
        )}

        <ProductGrid
          collection={collection}
          modules={page.modules}
          url={`/collections/${collection.handle}`}
          key={`${collection.handle}-${sort}`}
        />
      </div>
    </>
  );
}

function getSortValuesFromParam(sortParam: SortParam | null) {
  const productSort = SORT_OPTIONS.find((option) => option.key === sortParam);

  return (
    productSort || {
      sortKey: null,
      reverse: false,
    }
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
