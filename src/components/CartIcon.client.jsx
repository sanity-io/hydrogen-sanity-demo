import {useCartLinesTotalQuantity} from '@shopify/hydrogen/client';

export default function CartIcon() {
  const itemCount = useCartLinesTotalQuantity();

  return (
    <div className="border-blue">
      Cart <span>{itemCount > 0 ? `(${itemCount})` : null}</span>
    </div>
  );
}
