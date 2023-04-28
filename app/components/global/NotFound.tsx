import {Await} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';

import ProductPill, {PillSkeleton} from '~/components/product/Pill';
import type {SanityNotFoundPage} from '~/lib/sanity';

/**
 * A component that defines the content to display when a page isn't found (404 error)
 */

export function NotFound({
  notFoundPage,
  notFoundCollection,
}: {
  notFoundPage: SanityNotFoundPage;
  notFoundCollection?: Promise<{collection: Collection}>;
}) {
  return (
    <div className="pt-34">
      <h1 className="mx-auto px-12 text-center text-4xl sm:max-w-2xl">
        {notFoundPage?.title || 'Page not found'}
      </h1>

      <p className="my-8 text-center">
        {notFoundPage?.body || "We couldn't find the page you're looking for."}
      </p>
      {notFoundCollection && (
        <div className="mx-4 mb-18 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Suspense
            fallback={
              <>
                {Array(16)
                  .fill(true)
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <PillSkeleton key={i} />
                  ))}
              </>
            }
          >
            <Await
              resolve={notFoundCollection}
              errorElement={<p>Error loading products!</p>}
            >
              {({collection}: {collection: Collection}) => {
                const products = flattenConnection(collection.products);

                return (
                  <>
                    {products?.map((product) => (
                      <div key={product.id}>
                        <ProductPill storefrontProduct={product} />
                      </div>
                    ))}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      )}
    </div>
  );
}
