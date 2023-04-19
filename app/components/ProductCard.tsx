import {Image, Money} from '@shopify/hydrogen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '~/components/Link';

export default function ProductCard({product}: {product: Product}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice && compareAtPrice?.amount > price?.amount;

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="shadow-sm relative rounded">
          {isDiscounted && (
            <span className="text-notice text-red-600 absolute top-0 right-0 m-4 text-right text-xs subpixel-antialiased">
              Sale
            </span>
          )}
          {product.variants.nodes[0].image && (
            <Image data={product.variants.nodes[0].image} alt={product.title} />
          )}
        </div>
        <div className="grid gap-1">
          <h3 className="text-copy w-full max-w-prose overflow-hidden text-ellipsis whitespace-nowrap ">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="inherit text-copy flex max-w-prose gap-4 whitespace-pre-wrap">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
