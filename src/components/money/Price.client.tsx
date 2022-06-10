import {useMoney} from '@shopify/hydrogen';
import {MoneyV2} from '@shopify/hydrogen/dist/esnext/storefront-api-types';

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
