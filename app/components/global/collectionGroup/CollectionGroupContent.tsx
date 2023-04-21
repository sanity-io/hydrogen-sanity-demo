import {useFetcher} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import {useCallback, useEffect} from 'react';
import {useInView} from 'react-intersection-observer';

import CollectionCard from '~/components/collection/Card';
import CloseIcon from '~/components/icons/Close';
import ProductPill, {PillSkeleton} from '~/components/product/Pill';
import type {SanityCollection, SanityCollectionGroup} from '~/lib/sanity';

type Props = {
  collection?: SanityCollection;
  collectionGroup?: SanityCollectionGroup;
  onClose: () => void;
};

export default function CollectionGroupContent({
  collection,
  collectionGroup,
  onClose,
}: Props) {
  const fetcher = useFetcher();
  const {collection: collectionData} = (fetcher.data ?? {}) as {
    collection: Collection;
  };

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === 'loading') return;
    fetcher.load(`/api${collection?.slug}?count=4`);
  }, [inView, fetcher, collection?.slug]);

  const products = collectionData?.products.nodes;

  const renderCollections = useCallback(
    () =>
      collectionGroup?.collectionLinks?.map((collectionGroupCollection) => {
        if (!collectionGroupCollection) {
          return null;
        }
        return (
          <CollectionCard
            collection={collectionGroupCollection}
            key={collectionGroupCollection._id}
            onClick={onClose}
          />
        );
      }),
    [collectionGroup?.collectionLinks, onClose],
  );

  const renderCollectionProducts = useCallback(
    () =>
      products?.map((product) => (
        <li key={product.id}>
          <ProductPill onClick={onClose} storefrontProduct={product} />
        </li>
      )),
    [onClose, products],
  );

  return (
    <div className="pb-10">
      {/* Header */}
      <header
        className={clsx(
          'flex h-header-sm items-center justify-between px-8',
          'lg:h-header-lg',
        )}
      >
        <div className="text-xl font-bold leading-none">
          {collectionGroup?.title}
        </div>
        <button type="button" onClick={onClose}>
          <CloseIcon />
        </button>
      </header>

      {/* Collections */}
      <div className="px-8">
        <div className="text-lg font-bold">Collections</div>
        <div className="relative mt-3 grid grid-cols-2 gap-2">
          {renderCollections()}
        </div>
      </div>

      {/* Collection products */}
      {collection && (
        <div className="mt-8 px-8" ref={ref}>
          {products ? (
            <>
              <div className="text-lg font-bold">{collection.title}</div>
              <ul className="mt-3 grid grid-cols-1 gap-2">
                {renderCollectionProducts()}
              </ul>
            </>
          ) : (
            <>
              <div className="mb-2 h-4 w-48 rounded-full bg-gray"></div>
              <ul className="mt-3 grid grid-cols-1 gap-2">
                {Array(4)
                  .fill(true)
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={i}>
                      <PillSkeleton />
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
