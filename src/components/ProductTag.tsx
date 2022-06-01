import {Link} from '@shopify/hydrogen';
import {SanityProductWithVariant} from '../types';

export default function ProductTag({
  product,
}: {
  product: SanityProductWithVariant;
}) {
  // TODO: add popover
  return (
    <Link to={`/products/${product.slug}`}>
      <div
        className={
          'place-content-center rounded-xs bg-lightGray px-1.5 py-1 text-sm leading-none text-darkGray duration-300 ease-out hover:bg-gray'
        }
      >
        {product.store?.title}
      </div>
    </Link>
  );
}
