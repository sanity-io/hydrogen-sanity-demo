import {useMoney} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

/**
 * A client component that renders a product's compare at price
 */
type Props = {
  money: MoneyV2;
};

export default function MoneyCompareAtPrice({money}: Props) {
  const {localizedString} = useMoney(money);
  return (
    <span className="mr-2.5 line-through decoration-red">
      {localizedString}
    </span>
  );
}
