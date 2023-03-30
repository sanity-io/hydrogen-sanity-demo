import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {CollectionConnection} from '@shopify/hydrogen/storefront-api-types';
import {defer, LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';

import {Link} from '~/components/Link';
import {validateLocale} from '~/lib/utils';

const seo: SeoHandleFunction = ({data}) => ({
  title: 'Sanity x Hydrogen',
  description: 'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

export async function loader({context, params}: LoaderArgs) {
  validateLocale({context, params});

  const collections = await context.storefront.query<{
    collections: CollectionConnection;
  }>(COLLECTIONS_QUERY);

  return defer({
    featuredCollections: collections,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const {featuredCollections} = useLoaderData<typeof loader>();

  return (
    <section
      className={clsx(
        'rounded-b-xl px-4 pb-4 pt-24', //
        'md:px-8 md:pb-8 md:pt-34',
      )}
    >
      <h2 className="mb-5 max-w-prose whitespace-pre-wrap text-2xl font-bold">
        Collections
      </h2>
      <div className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 sm:grid-cols-3 md:gap-4 lg:gap-6">
        <Suspense>
          <Await resolve={featuredCollections}>
            {({collections}) => {
              if (!collections?.nodes) return <></>;
              return (
                <>
                  {collections?.nodes.map((collection) => {
                    return (
                      <Link
                        to={`/collections/${collection.handle}`}
                        key={collection.id}
                      >
                        {collection.title}
                      </Link>
                    );
                  })}
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 3, query: "collection_type:smart") {
      nodes {
        id
        title
        handle
      }
    }
  }
`;
