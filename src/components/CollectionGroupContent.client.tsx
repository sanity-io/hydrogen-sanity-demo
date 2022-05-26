import {flattenConnection, Link} from '@shopify/hydrogen';
import {
  Collection,
  Product,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityCollectionGroup} from '../types';
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

  return (
    <>
      {/* White header background (sticky) */}
      <div className="sticky top-0 left-0 z-30 h-24 w-full bg-white" />

      <div className="px-8">
        {/* Collections */}
        <div>
          <div className="text-lg font-bold">Collections</div>
          <div className="relative mt-3 grid grid-cols-2 gap-2">
            {/* TODO: make a separate collection card component */}
            {collectionGroup?.collectionLinks?.map(
              (collectionGroupCollection) => {
                if (!collectionGroupCollection) {
                  return null;
                }
                return (
                  <Link
                    className="text-lg font-bold"
                    key={collectionGroupCollection._id}
                    onClick={onClose}
                    to={collectionGroupCollection.slug}
                  >
                    <div
                      className="flex aspect-[4/3] items-center justify-center rounded text-center"
                      style={{
                        background:
                          collectionGroupCollection?.colorTheme?.background ||
                          'black',
                        color:
                          collectionGroupCollection?.colorTheme?.text ||
                          'white',
                      }}
                    >
                      {collectionGroupCollection.title}
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </div>

        {/* Collection products */}
        <div className="mt-8 ">
          <div className="text-lg font-bold">{collection.title}</div>
          <ul className="mt-3 grid grid-cols-1 gap-2">
            {products?.map((product) => (
              <li key={product.id}>
                <ProductPill onClick={onClose} storefrontProduct={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
