import {Image, Link} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import Badge from '../Badge';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: Pick<
    Product,
    'handle' | 'options' | 'title' | 'variants' | 'vendor'
  >;
  storefrontProductVariant?: Pick<
    ProductVariant,
    | 'availableForSale'
    | 'compareAtPriceV2'
    | 'id'
    | 'image'
    | 'priceV2'
    | 'selectedOptions'
    | 'title'
  >;
};

export default function CardProduct({
  imageAspectClassName = 'aspect-square',
  storefrontProduct,
  storefrontProductVariant,
}: Props) {
  const selectedVariant =
    storefrontProductVariant || storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <Link to={`/products/${storefrontProduct.handle}`}>
      <div className="group relative mb-4">
        <div
          className={clsx([
            imageAspectClassName,
            'relative flex items-center justify-center overflow-hidden rounded bg-lightGray object-cover transition-all duration-500 ease-out group-hover:rounded-xl',
          ])}
        >
          {selectedVariant.image && (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
              data={selectedVariant.image}
            />
          )}
          {/* Badges */}
          <div className="absolute top-4 left-4">
            {/* Sale */}
            {selectedVariant?.availableForSale &&
              selectedVariant?.compareAtPriceV2 && (
                <Badge label="Sale" tone="critical" />
              )}
            {/* Sold out */}
            {!selectedVariant?.availableForSale && <Badge label="Sold out" />}
          </div>
        </div>

        <div className="mt-3 text-md">
          <div className="space-y-1">
            {/* Title */}
            <div className="font-bold group-hover:underline">
              {storefrontProduct.title}
            </div>

            {/* Vendor */}
            {storefrontProduct.vendor && (
              <div className="text-darkGray">{storefrontProduct.vendor}</div>
            )}

            {/* Product options */}
            {multipleProductOptions && (
              <div className="text-darkGray">{productOptions}</div>
            )}
          </div>

          {/* Price / compare at price */}
          <div className="mt-3 flex font-bold">
            {selectedVariant.compareAtPriceV2 && (
              <span className="text-darkGray">
                <Suspense fallback={null}>
                  <MoneyCompareAtPrice
                    money={selectedVariant.compareAtPriceV2}
                  />
                </Suspense>
              </span>
            )}
            <Suspense fallback={null}>
              <MoneyPrice money={selectedVariant.priceV2} />
            </Suspense>
          </div>
        </div>
      </div>
    </Link>
  );
}
