import {Await, useLoaderData, useSearchParams} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import ProductGrid from '~/components/collection/ProductGrid';
import SortOrder from '~/components/collection/SortOrder';
import {SORT_OPTIONS} from '~/components/collection/SortOrder';
import CollectionHero from '~/components/heroes/Collection';
import type {SanityCollectionPage} from '~/lib/sanity';
import {ColorTheme} from '~/lib/theme';
import {fetchGids, notFound, validateLocale} from '~/lib/utils';
import {COLLECTION_PAGE_QUERY} from '~/queries/sanity/collection';
import {COLLECTION_QUERY} from '~/queries/shopify/collection';

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

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const [page, {collection}] = await Promise.all([
    context.sanity.query<SanityCollectionPage>({
      query: COLLECTION_PAGE_QUERY,
      params: {
        slug: params.handle,
      },
      cache,
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
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({page, context});

  return defer({
    page,
    collection,
    gids,
    sortKey,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const {collection, page, gids} = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const sort = params.get('sort');

  const products = collection.products.nodes;

  return (
    <ColorTheme value={page.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* Hero */}
          <CollectionHero fallbackTitle={page.title} hero={page.hero} />

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
        </Await>
      </Suspense>
    </ColorTheme>
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
