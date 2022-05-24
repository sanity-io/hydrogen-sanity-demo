import {Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import type {SanityCollectionGroup} from '../types';
import ProductPill from './ProductPill';

type Props = {
  collectionGroup?: SanityCollectionGroup;
  onClose: () => void;
  products: Product[] | null;
};

export default function CollectionGroupContent({
  collectionGroup,
  onClose,
  products,
}: Props) {
  return (
    <div className="mt-24 p-2">
      <div className="relative grid grid-cols-2 gap-2">
        {collectionGroup?.collectionLinks?.map((collection) => (
          <Link
            className="font-bold"
            key={collection._id}
            onClick={onClose}
            to={collection.slug}
          >
            <div className="flex aspect-[4/3] items-center justify-center rounded border border-black">
              {collection.title}
            </div>
          </Link>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2">
        {products?.map((product) => (
          <li key={product.id}>
            <ProductPill storefrontProduct={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
