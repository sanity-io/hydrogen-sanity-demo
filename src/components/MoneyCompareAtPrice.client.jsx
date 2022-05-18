import {useMoney} from '@shopify/hydrogen/client';

/**
 * A client component that renders a product's compare at price
 */
export default function MoneyCompareAtPrice({money}) {
  const {amount, currencyNarrowSymbol} = useMoney(money);
  return (
    <span className="line-through mr-2.5">
      {currencyNarrowSymbol}
      {amount}
    </span>
  );
}
