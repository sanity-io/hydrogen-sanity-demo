import {useFetcher} from '@remix-run/react';
import type {Collection, Product} from '@shopify/hydrogen/storefront-api-types';
import {useEffect, useState} from 'react';

import ProductCard from './ProductCard';

export default function ProductGrid({
  collection,
  url,
}: {
  collection: Collection;
  url: string;
}) {
  const [initialProducts, setInitialProducts] = useState(
    collection?.products?.nodes || [],
  );

  const [nextPage, setNextPage] = useState(
    collection?.products?.pageInfo?.hasNextPage,
  );

  const [endCursor, setEndCursor] = useState(
    collection?.products?.pageInfo?.endCursor,
  );

  const [products, setProducts] = useState(initialProducts);

  // props have changes, reset component state
  const productProps = collection?.products?.nodes || [];
  if (initialProducts !== productProps) {
    setInitialProducts(productProps);
    setProducts(productProps);
    setNextPage(collection?.products?.pageInfo?.hasNextPage);
    setEndCursor(collection?.products?.pageInfo?.endCursor);
  }

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    fetcher.load(`${url}?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;

    const {collection} = fetcher.data;

    setProducts((prev: Product[]) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
  }, [fetcher.data]);

  return (
    <section className="grid w-full gap-4 md:gap-8">
      <div className="grid grid-flow-row grid-cols-2 gap-2 gap-y-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {nextPage && (
        <div className="mt-6 flex items-center justify-center">
          <button
            className="inline-block w-full cursor-pointer rounded border py-3 px-6 text-center font-medium"
            disabled={fetcher.state !== 'idle'}
            onClick={fetchMoreProducts}
          >
            {fetcher.state !== 'idle' ? 'Loading...' : 'Load more products'}
          </button>
        </div>
      )}
    </section>
  );
}
