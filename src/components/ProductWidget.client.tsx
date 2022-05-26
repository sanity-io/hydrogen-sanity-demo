import {ProductPrice, useProduct} from '@shopify/hydrogen';
import {useState} from 'react';
import {SanityProductPage} from '../types';
import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from './ButtonSelectedVariantBuyNow.client';
import MinusIcon from './MinusIcon.client';
import PlusIcon from './PlusIcon.client';
import ProductOptions from './ProductOptions.client';

type Props = {
  sanityProduct: SanityProductPage;
};

function ProductActions() {
  const {selectedVariant} = useProduct();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = !selectedVariant?.availableForSale;

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="mt-5 flex flex-col space-y-2">
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
      {!isOutOfStock && <ButtonSelectedVariantBuyNow quantity={quantity} />}
    </div>
  );
}

function ProductPrices() {
  const storefrontProduct = useProduct();

  if (!storefrontProduct?.selectedVariant) {
    return null;
  }

  return (
    <div className="my-4">
      <ProductPrice
        className="text-xl font-bold line-through decoration-red"
        priceType="compareAt"
        variantId={storefrontProduct.selectedVariant.id}
      />
      <ProductPrice
        className="text-xl font-bold"
        variantId={storefrontProduct.selectedVariant.id}
      />
    </div>
  );
}

export default function ProductWidget({sanityProduct}: Props) {
  const storefrontProduct = useProduct();

  return (
    <div className="pointer-events-auto sticky top-26 w-[315px] rounded bg-white p-6 shadow">
      {/* Title */}
      {storefrontProduct?.title && (
        <h1 className="text-xl font-bold uppercase">
          {storefrontProduct.title}
        </h1>
      )}

      {/* Vendor */}
      {storefrontProduct?.vendor && (
        <div className="mt-1 text-xs text-gray">{storefrontProduct.vendor}</div>
      )}

      {/* Prices */}
      <ProductPrices />

      {/* Product options */}
      <ProductOptions
        customProductOptions={sanityProduct.customProductOptions}
      />

      {/* Product actions */}
      <ProductActions />
    </div>
  );
}
