import {BuyNowButton, useProduct} from '@shopify/hydrogen/client';

/**
 * Wrapper around Hydrogen's `<BuyNowButton />` which will
 * display a disabled 'sold out' button if variant is not available for sale
 */

type Props = {
  quantity?: number;
  showSoldOut?: boolean;
};

export default function ButtonSelectedVariantBuyNow(props: Props) {
  const {quantity = 1, showSoldOut = true} = props;
  const {selectedVariant} = useProduct();

  const availableForSale = selectedVariant?.availableForSale;

  if ((!showSoldOut && !availableForSale) || !selectedVariant) {
    return null;
  }

  return (
    <BuyNowButton
      className="btn"
      disabled={!availableForSale}
      quantity={quantity}
      variantId={selectedVariant.id}
    >
      {availableForSale ? 'Buy it now' : 'Sold out'}
    </BuyNowButton>
  );
}
