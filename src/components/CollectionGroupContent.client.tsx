import {flattenConnection} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityCollectionGroup} from '../types';
import CollectionCard from './CollectionCard.client';
import ProductPill from './ProductPill';

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

  const renderCollections = () =>
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
    });

  const renderCollectionProducts = () =>
    products?.map((product) => (
      <li key={product.id}>
        <ProductPill onClick={onClose} storefrontProduct={product} />
      </li>
    ));

  return (
    <div className="px-8 py-10">
      {/* Collections */}
      <div>
        <div className="text-lg font-bold">Collections</div>
        <div className="relative mt-3 grid grid-cols-2 gap-2">
          {renderCollections()}
        </div>
      </div>

      {/* Collection products */}
      <div className="mt-8 ">
        <div className="text-lg font-bold">{collection.title}</div>
        <ul className="mt-3 grid grid-cols-1 gap-2">
          {renderCollectionProducts()}
        </ul>
      </div>
    </div>
  );
}
