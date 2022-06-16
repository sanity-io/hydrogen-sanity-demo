import {AddToCartButton, useProductOptions} from '@shopify/hydrogen';
import {DEFAULT_BUTTON_STYLES} from '../../../constants';

/**
 * Wrapper around Hydrogen's `<AddToCartButton />` which will
 * display a disabled 'sold out' button if variant is not available for sale
 */

type Props = {
  label?: string;
  quantity?: number;
  showSoldOut?: boolean;
};

export default function SelectedVariantAddToCartButton({
  label = 'Add to cart',
  quantity = 1,
  showSoldOut = true,
}: Props) {
  const {selectedVariant} = useProductOptions();

  if (!selectedVariant || (!showSoldOut && !selectedVariant.availableForSale)) {
    return null;
  }

  return (
    <AddToCartButton
      className={DEFAULT_BUTTON_STYLES}
      disabled={!selectedVariant.availableForSale}
      quantity={quantity}
      variantId={selectedVariant?.id}
    >
      {label}
    </AddToCartButton>
  );
}
