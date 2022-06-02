import {Link} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Suspense} from 'react';
import {
  getProductOptionString,
  hasMultipleProductOptions,
} from '../../utils/productOptions';
import MoneyCompareAtPrice from '../MoneyCompareAtPrice.client';
import MoneyPrice from '../MoneyPrice.client';

type Props = {
  storefrontProduct: Pick<Product, 'handle' | 'options' | 'title' | 'vendor'>;
  storefrontProductVariant: Pick<
    ProductVariant,
    'availableForSale' | 'compareAtPriceV2' | 'priceV2'
  >;
};

export default function ProductHotspot({
  storefrontProduct,
  storefrontProductVariant,
}: Props) {
  if (storefrontProductVariant == null) {
    return null;
  }

  const {availableForSale, compareAtPriceV2, priceV2} =
    storefrontProductVariant;

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  return (
    <Link to={`/products/${storefrontProduct.handle}`}>
      <div
        className="group min-w-[12.5em] rounded-md bg-white p-5 transition-all duration-500 ease-out hover:rounded-xl"
        role="row"
      >
        {/* TODO: potentially DRY with product card */}
        <div className="overflow-hidden">
          {/* Sold out */}
          {!availableForSale && (
            <div className="mb-2 text-xs font-bold uppercase text-darkGray">
              Sold out
            </div>
          )}

          {/* Sale */}
          {availableForSale && compareAtPriceV2 && (
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
          {compareAtPriceV2 && (
            <span className="text-darkGray">
              <Suspense fallback={null}>
                <MoneyCompareAtPrice money={compareAtPriceV2} />
              </Suspense>
            </span>
          )}
          <Suspense fallback={null}>
            <MoneyPrice money={priceV2} />
          </Suspense>
        </div>
      </div>
    </Link>
  );
}
