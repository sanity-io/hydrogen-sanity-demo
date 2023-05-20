import {Image, Money} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import Badge from '~/components/elements/Badge';
import {Skeleton} from '~/components/global/Skeleton';
import {Link} from '~/components/Link';
import {
  getProductOptionString,
  hasMultipleProductOptions,
  useGid,
} from '~/lib/utils';
import type {ProductWithNodes} from '~/types/shopify';

/**
 * A component that displays a (small) single product to allow buyers to quickly identify a particular item of interest
 */

type Props = {
  onClick?: () => void;
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductPill({
  onClick,
  storefrontProduct,
  variantGid,
}: Props) {
  const firstVariant =
    useGid<ProductVariant>(variantGid) ??
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ??
    storefrontProduct.variants.nodes[0];

  if (firstVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);
  const {availableForSale, compareAtPrice, image, price} = firstVariant;

  return (
    <Link onClick={onClick} to={`/products/${storefrontProduct.handle}`}>
      <div
        className={clsx(
          'group flex h-[108px] gap-4 rounded-md border border-lightGray bg-white p-3 text-sm duration-500 ease-out',
          'hover:rounded-lg hover:border-darkGray',
        )}
        role="row"
      >
        <div role="cell" className="relative flex-shrink-0">
          <div
            className={clsx(
              'relative h-full w-[110px] overflow-hidden rounded-sm bg-lightGray duration-500 ease-out',
              'group-hover:rounded-md',
            )}
          >
            {image && (
              <Image
                className={clsx(
                  'absolute inset-0 h-full w-full object-cover',
                  !availableForSale && 'opacity-50',
                )}
                data={image}
                crop="center"
                width="110px"
              />
            )}

            {/* Badges */}
            <div className="absolute left-2 top-2">
              {/* Sale */}
              {availableForSale && compareAtPrice && (
                <Badge label="Sale" small tone="critical" />
              )}

              {/* Sold out */}
              {!availableForSale && <Badge label="Sold out" small />}
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="mr-3 space-y-1">
            {/* Title */}
            <div className="truncate font-bold group-hover:underline">
              {storefrontProduct.title}
            </div>

            {/* Vendor */}
            {storefrontProduct.vendor && (
              <div className="truncate text-darkGray">
                {storefrontProduct.vendor}
              </div>
            )}

            {/* Product options */}
            {multipleProductOptions && (
              <div className="truncate text-darkGray">{productOptions}</div>
            )}
          </div>

          {/* Price */}
          <div className="mt-3 flex font-bold ">
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
      </div>
    </Link>
  );
}

export function PillSkeleton() {
  return (
    <Skeleton
      className={clsx(
        'group flex h-[108px] gap-4 rounded-md border border-lightGray bg-white p-3 text-sm duration-500 ease-out',
      )}
      role="row"
    >
      <div role="cell" className="relative flex-shrink-0">
        <div
          className={clsx(
            'relative h-full w-[110px] overflow-hidden rounded-sm bg-gray duration-500 ease-out',
            'group-hover:rounded-md',
          )}
        ></div>
      </div>

      <div className="overflow-hidden">
        <div className="mr-3 space-y-1">
          {/* Title */}
          <div className="mb-2 h-4 w-48 rounded-full bg-gray"></div>

          {/* Product options */}
          <div className="mb-2 h-3 w-30 rounded-full bg-gray"></div>
          <div className="mb-2 h-3 w-18 rounded-full bg-gray"></div>
        </div>

        {/* Price */}
        <div className="mt-4 flex">
          <div className="h-3 w-24 rounded-full bg-gray"></div>
        </div>
      </div>
    </Skeleton>
  );
}
