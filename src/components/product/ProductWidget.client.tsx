import {ProductPrice, useProduct} from '@shopify/hydrogen';
import {useState} from 'react';
import {SanityProductPage} from '../../types';
import {hasMultipleProductOptions} from '../../utils/productOptions';
import ButtonSelectedVariantAddToCart from '../buttons/ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../buttons/ButtonSelectedVariantBuyNow.client';
// import MinusIcon from './MinusIcon.client';
// import PlusIcon from './PlusIcon.client';
import ProductOptions from './options/ProductOptions.client';

type Props = {
  sanityProduct: SanityProductPage;
};

function ProductActions() {
  const {selectedVariant} = useProduct();

  const [quantity, setQuantity] = useState(1);
  /*
  const isOutOfStock = !selectedVariant?.availableForSale;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  */

  return (
    <div className="mt-4 flex flex-col space-y-2">
      {/* Quantity picker */}
      {/*!isOutOfStock && (
        <div className="inline-flex items-center gap-2 overflow-auto">
          <button
            aria-label="Decrease quantity"
            className="disabled:pointer-events-all disabled:opacity-50"
            disabled={quantity === 1}
            onClick={handleDecreaseQuantity}
          >
            <MinusIcon />
          </button>
          <div className="min-w-[1rem] text-center text-sm font-bold text-black">
            {quantity}
          </div>
          <button
            aria-label="Increase quantity"
            className="disabled:pointer-events-all disabled:opacity-50"
            onClick={handleIncreaseQuantity}
          >
            <PlusIcon />
          </button>
        </div>
      )*/}
      <ButtonSelectedVariantAddToCart quantity={quantity} />
      <ButtonSelectedVariantBuyNow quantity={quantity} />
    </div>
  );
}

function ProductPrices() {
  const storefrontProduct = useProduct();

  if (!storefrontProduct?.selectedVariant) {
    return null;
  }

  return (
    <div className="mt-2 flex text-md font-bold">
      <ProductPrice
        className="mr-3 text-darkGray line-through decoration-red"
        priceType="compareAt"
        variantId={storefrontProduct.selectedVariant.id}
      />
      <ProductPrice variantId={storefrontProduct.selectedVariant.id} />
    </div>
  );
}

export default function ProductWidget({sanityProduct}: Props) {
  const storefrontProduct = useProduct();

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );

  return (
    <div className="pointer-events-auto sticky top-30 mb-8 w-[315px] rounded bg-white p-6 shadow">
      {/* Title */}
      {storefrontProduct?.title && (
        <h1 className="text-md font-bold uppercase">
          {storefrontProduct.title}
        </h1>
      )}

      {/* Vendor */}
      {storefrontProduct?.vendor && (
        <div className="mt-1 text-md text-darkGray">
          {storefrontProduct.vendor}
        </div>
      )}

      {/* Prices */}
      <ProductPrices />

      {/* Divider */}
      <div className="my-4 w-full border-b border-gray" />

      {/* Product options */}
      {multipleProductOptions && (
        <ProductOptions
          customProductOptions={sanityProduct.customProductOptions}
        />
      )}

      {/* Product actions */}
      {storefrontProduct.selectedVariant?.availableForSale ? (
        <ProductActions />
      ) : (
        <div className="text-md uppercase text-darkGray">Sold out</div>
      )}
    </div>
  );
}
