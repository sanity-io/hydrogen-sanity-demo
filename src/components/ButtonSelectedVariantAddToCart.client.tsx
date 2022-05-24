import {AddToCartButton, useProduct} from '@shopify/hydrogen/client';

/**
 * Wrapper around Hydrogen's `<AddToCartButton />` which will
 * display a disabled 'sold out' button if variant is not available for sale
 */

type Props = {
  showSoldOut?: boolean;
};

export default function ButtonSelectedVariantAddToCart(props: Props) {
  const {showSoldOut = true} = props;
  const {selectedVariant} = useProduct();

  const availableForSale = selectedVariant?.availableForSale;

  if (!showSoldOut && !availableForSale) {
    return null;
  }

  return (
    <AddToCartButton
      className="btn"
      disabled={!availableForSale}
      variantId={selectedVariant?.id}
    >
      {availableForSale ? 'Add to cart' : 'Sold out'}
    </AddToCartButton>
  );
}
