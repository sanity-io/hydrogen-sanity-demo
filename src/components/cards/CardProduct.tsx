import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

type Props = {
  storefrontProduct: Pick<
    Product,
    'handle' | 'options' | 'title' | 'variants' | 'vendor'
  >;
};

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */
export default function CardProduct({storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

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
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded bg-lightGray object-cover transition-all duration-500 ease-out group-hover:rounded-xl">
          {selectedVariant.image && (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
              data={selectedVariant.image}
            />
          )}
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

          {/* Sale badge */}
          {selectedVariant?.availableForSale &&
            selectedVariant?.compareAtPriceV2 && (
              <div className="absolute top-6 left-6 flex place-content-center rounded-sm bg-white px-1.5 py-1 text-sm font-bold uppercase leading-none text-red">
                Sale
              </div>
            )}

          {/* Sold out badge */}
          {!selectedVariant?.availableForSale && (
            <div className="absolute top-6 left-6 flex place-content-center rounded-sm bg-white px-1.5 py-1 text-sm font-bold uppercase leading-none text-darkGray">
              Sold out
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
