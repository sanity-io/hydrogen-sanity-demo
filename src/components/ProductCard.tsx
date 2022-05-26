import {Image, Link} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import pluralize from 'pluralize';
import {Suspense} from 'react';
import MoneyCompareAtPrice from './MoneyCompareAtPrice.client';
import MoneyPrice from './MoneyPrice.client';

type Props = {
  storefrontProduct: Pick<
    Product,
    'handle' | 'options' | 'title' | 'variants' | 'vendor'
  >;
};

/**
 * A shared component that displays a single product to allow buyers to quickly identify a particular item of interest
 */
export default function ProductCard({storefrontProduct}: Props) {
  const selectedVariant = storefrontProduct.variants.edges[0].node;

  if (selectedVariant == null) {
    return null;
  }

  // TODO: DRY with product pill
  const firstOption = storefrontProduct.options[0];
  const hasDefaultVariantOnly =
    firstOption.name === 'Title' && firstOption.values[0] === 'Default Title';
  const productOptions = storefrontProduct.options
    ?.map(({name, values}) => pluralize(name, values.length, true))
    .join(' / ');

  return (
    <div className="relative mb-4">
      <Link to={`/products/${storefrontProduct.handle}`}>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded bg-lightGray object-cover">
          {selectedVariant.image && (
            <Image
              className="absolute h-full w-full transform bg-cover bg-center object-cover object-center transition-all duration-500 ease-in-out"
              data={selectedVariant.image}
            />
          )}

          {/* Sale badge */}
          {selectedVariant?.availableForSale &&
            selectedVariant?.compareAtPriceV2 && (
              <div className="absolute top-6 left-6 flex place-content-center rounded-sm bg-white px-1.5 py-1 text-sm font-bold uppercase leading-none text-red">
                Sale
              </div>
            )}
        </div>

        <div className="mt-3 text-md">
          <div className="space-y-1">
            {/* Title */}
            <div className="font-bold">{storefrontProduct.title}</div>

            {/* Vendor */}
            {storefrontProduct.vendor && (
              <div className="text-gray">{storefrontProduct.vendor}</div>
            )}

            {/* Product options */}
            {!hasDefaultVariantOnly && (
              <div className="text-gray">{productOptions}</div>
            )}
          </div>

          {/* Price / sold out */}
          {selectedVariant?.availableForSale ? (
            <div className="mt-3 flex font-bold">
              {selectedVariant.compareAtPriceV2 && (
                <span className="text-gray">
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
          ) : (
            <div className="mt-3 font-bold uppercase text-gray">Sold out</div>
          )}
        </div>
      </Link>
    </div>
  );
}
