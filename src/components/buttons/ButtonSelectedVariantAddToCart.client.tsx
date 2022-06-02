import {AddToCartButton, useProduct} from '@shopify/hydrogen';
import {DEFAULT_BUTTON_STYLES} from '../../constants';

/**
 * Wrapper around Hydrogen's `<AddToCartButton />` which will
 * display a disabled 'sold out' button if variant is not available for sale
 */

type Props = {
  quantity?: number;
  showSoldOut?: boolean;
};

export default function ButtonSelectedVariantAddToCart(props: Props) {
  const {quantity = 1, showSoldOut = true} = props;
  const {selectedVariant} = useProduct();

  if (!selectedVariant) {
    return null;
  }

  const {availableForSale} = selectedVariant;

  if (!showSoldOut && !availableForSale) {
    return null;
  }

  return (
    <AddToCartButton
      className={DEFAULT_BUTTON_STYLES}
      disabled={!availableForSale}
      quantity={quantity}
      variantId={selectedVariant?.id}
    >
      Add to cart
    </AddToCartButton>
  );
}
