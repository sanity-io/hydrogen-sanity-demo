import {Money} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {Link} from '~/components/Link';
import {
  getProductOptionString,
  hasMultipleProductOptions,
  useGid,
} from '~/lib/utils';
import {ProductWithNodes} from '~/types/shopify';

type Props = {
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductTile({storefrontProduct, variantGid}: Props) {
  const firstVariant =
    useGid<ProductVariant>(variantGid) ??
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ??
    storefrontProduct.variants.nodes[0];

  if (!(storefrontProduct && firstVariant)) {
    return null;
  }

  const {availableForSale, compareAtPrice, price} = firstVariant;

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <Link to={`/products/${storefrontProduct.handle}`}>
      <div
        className={clsx(
          'group min-w-[12.5em] rounded-md bg-white p-5 transition-[border-radius] duration-500 ease-out',
          'hover:rounded-xl',
        )}
        role="row"
      >
        <div className="overflow-hidden">
          {/* Sold out */}
          {!availableForSale && (
            <div className="mb-2 text-xs font-bold uppercase text-darkGray">
              Sold out
            </div>
          )}

          {/* Sale */}
          {availableForSale && compareAtPrice && (
            <div className="mb-2 text-xs font-bold uppercase text-red">
              Sale
            </div>
          )}

          {/* Title */}
          <div className="truncate text-lg font-bold group-hover:underline">
            {storefrontProduct.title}
          </div>

          {/* Vendor */}
          {storefrontProduct.vendor && (
            <div className="mt-1 truncate text-sm text-darkGray">
              {storefrontProduct.vendor}
            </div>
          )}

          {/* Product options */}
          {multipleProductOptions && (
            <div className="mt-1 truncate text-sm text-darkGray">
              {productOptions}
            </div>
          )}
        </div>

        {/* Price / sold out */}
        <div className="mt-2 flex text-sm font-bold">
          {compareAtPrice && (
            <span className="text-darkGray">
              <Money
                data={compareAtPrice}
                className="mr-2.5 line-through decoration-red"
              />
            </span>
          )}
          {price && <Money data={price} />}
        </div>
      </div>
    </Link>
  );
}
