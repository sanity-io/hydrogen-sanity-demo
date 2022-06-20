import {useMoney} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

/**
 * A client component that defines the localized value of a product
 */
type Props = {
  money: MoneyV2;
};

export default function MoneyPrice({money}: Props) {
  const {localizedString} = useMoney(money);
  return <span>{localizedString}</span>;
}
