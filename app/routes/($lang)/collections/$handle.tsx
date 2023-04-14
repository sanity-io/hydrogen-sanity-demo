import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import type {Collection as CollectionType} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import groq from 'groq';
import invariant from 'tiny-invariant';

import CollectionHero from '~/components/heroes/Collection';
import ProductGrid from '~/components/ProductGrid';
import {validateLocale} from '~/lib/utils';
import {COLLECTION_PAGE} from '~/queries/sanity/fragments/pages/collection';
import {COLLECTION_QUERY} from '~/queries/shopify/collection';
import {SanityCollectionPage} from '~/types/sanity';
import {getHeroData} from '~/utils/heroData';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
});

export const handle = {
  seo,
};

const PAGINATION_SIZE = 12;

export async function loader({params, context, request}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');
  const count = searchParams.get('count');

  invariant(params.handle, 'Missing collection handle');

  const page = await context.sanity.client.fetch<SanityCollectionPage>(
    QUERY_SANITY,
    {
      slug: params.handle,
    },
  );

  if (page.hero?.content) {
    page.hero.data = await getHeroData({content: page.hero?.content, context});
  }

  const {collection}: {collection: CollectionType} =
    await context.storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        cursor,
        count: count ? parseInt(count) : PAGINATION_SIZE,
      },
    });

  // Handle 404s
  if (!page || !collection) {
    throw new Response(null, {status: 404});
  }

  return json({
    page,
    collection,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const {
    collection: {products},
    page,
  } = useLoaderData();

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
            {/* <SortOrderSelect
              key={sanityCollection._id}
              initialSortOrder={sanityCollection.sortOrder}
            /> */}
          </div>
        )}
        {/* No results */}
        {products.length === 0 && (
          <div className="mt-16 text-center text-lg text-darkGray">
            No products.
          </div>
        )}

        {/* <ModuleGrid colorTheme={sanityCollection.colorTheme} items={items} /> */}

        {/* {hasNextPage && (
          <LoadMoreProducts startingCount={collectionProductCount} />
        )} */}
      </div>
    </>
    // <section
    //   className={clsx(
    //     'rounded-b-xl px-4 pb-4 pt-24', //
    //     'md:px-8 md:pb-8 md:pt-34',
    //   )}
    // >
    //   <header className="grid w-full justify-items-start gap-8 py-8">
    //     <h1 className="inline-block whitespace-pre-wrap text-4xl font-bold">
    //       {collection.title}
    //     </h1>

    //     {collection.description && (
    //       <div className="flex w-full items-baseline justify-between">
    //         <div>
    //           <p className="inherit text-copy inline-block max-w-md whitespace-pre-wrap">
    //             {collection.description}
    //           </p>
    //         </div>
    //       </div>
    //     )}
    //   </header>
    //   <ProductGrid
    //     collection={collection}
    //     url={`/collections/${collection.handle}`}
    //   />
    // </section>
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
