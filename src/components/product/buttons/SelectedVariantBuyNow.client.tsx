import {BuyNowButton, useProductOptions} from '@shopify/hydrogen';
import {DEFAULT_BUTTON_STYLES} from '../../../constants';

/**
 * Wrapper around Hydrogen's `<BuyNowButton />` which will
 * display a disabled 'sold out' button if variant is not available for sale
 */

type Props = {
  quantity?: number;
  showSoldOut?: boolean;
};

export default function SelectedVariantBuyNowButton({
  quantity = 1,
  showSoldOut = true,
}: Props) {
  const {selectedVariant} = useProductOptions();
  const availableForSale = selectedVariant?.availableForSale;

  if ((!showSoldOut && !availableForSale) || !selectedVariant?.id) {
    return null;
  }

  return (
    <BuyNowButton
      className={DEFAULT_BUTTON_STYLES}
      disabled={!availableForSale}
      quantity={quantity}
      variantId={selectedVariant.id}
    >
      Buy now
    </BuyNowButton>
  );
}
