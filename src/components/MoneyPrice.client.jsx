import {useMoney} from '@shopify/hydrogen';

/**
 * A client component that defines the localized value of a product
 */
export default function MoneyPrice({money}) {
  const {localizedString} = useMoney(money);
  return <span>{localizedString}</span>;
}
