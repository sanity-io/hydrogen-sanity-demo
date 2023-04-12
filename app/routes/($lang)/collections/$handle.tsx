import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import type {Collection as CollectionType} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';

import ProductGrid from '~/components/ProductGrid';
import {validateLocale} from '~/lib/utils';
import {COLLECTION_QUERY} from '~/queries/shopify/collection';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.collection?.title,
  description: data?.collection?.description,
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

  const {collection}: {collection: CollectionType} =
    await context.storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        cursor,
        count: count ? parseInt(count) : PAGINATION_SIZE,
      },
    });

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return json({
    collection,
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
  });
}

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <section
      className={clsx(
        'rounded-b-xl px-4 pb-4 pt-24', //
        'md:px-8 md:pb-8 md:pt-34',
      )}
    >
      <header className="grid w-full justify-items-start gap-8 py-8">
        <h1 className="inline-block whitespace-pre-wrap text-4xl font-bold">
          {collection.title}
        </h1>

        {collection.description && (
          <div className="flex w-full items-baseline justify-between">
            <div>
              <p className="inherit text-copy inline-block max-w-md whitespace-pre-wrap">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>
      <ProductGrid
        collection={collection}
        url={`/collections/${collection.handle}`}
      />
    </section>
  );
}
