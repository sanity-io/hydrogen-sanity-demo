import {flattenConnection} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import {useCallback} from 'react';
import type {SanityCollectionGroup} from '../types';
import CardCollection from './cards/CardCollection';
import IconClose from './icons/IconClose';
import PillProduct from './pills/PillProduct';

type Props = {
  collection: Collection;
  collectionGroup?: SanityCollectionGroup;
  onClose: () => void;
};

export default function CollectionGroupContent({
  collection,
  collectionGroup,
  onClose,
}: Props) {
  const products = collection?.products
    ? (flattenConnection(collection.products) as Product[])
    : null;

  const renderCollections = useCallback(
    () =>
      collectionGroup?.collectionLinks?.map((collectionGroupCollection) => {
        if (!collectionGroupCollection) {
          return null;
        }
        return (
          <CardCollection
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
          <PillProduct onClick={onClose} storefrontProduct={product} />
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
          <IconClose />
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
      <div className="mt-8 px-8">
        <div className="text-lg font-bold">{collection.title}</div>
        <ul className="mt-3 grid grid-cols-1 gap-2">
          {renderCollectionProducts()}
        </ul>
      </div>
    </div>
  );
}
