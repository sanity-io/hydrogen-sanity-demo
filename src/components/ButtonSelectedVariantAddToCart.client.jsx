import {AddToCartButton, useProduct} from '@shopify/hydrogen/client';

/**
 * Wrapper around Hydrogen's `<AddToCartButton />` which will
 * display a disabled 'sold out' button if variant is not available for sale
 */
export default function ButtonSelectedVariantAddToCart(props) {
  const {showSoldOut = true, small} = props;
  const {selectedVariant} = useProduct();

  const availableForSale = selectedVariant?.availableForSale;

  if (!showSoldOut && !availableForSale) {
    return null;
  }

  return (
    <AddToCartButton
      className={`bg-gray-900 disabled:opacity-20 text-white text-center ${
        small ? 'p-3 text-xs' : 'p-4 text-sm'
      } w-full`}
      disabled={!availableForSale}
      variantId={selectedVariant.id}
    >
      {availableForSale ? 'Add to cart' : 'Sold out'}
    </AddToCartButton>
  );
}
