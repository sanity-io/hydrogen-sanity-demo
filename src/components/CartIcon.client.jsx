import {useCart} from '@shopify/hydrogen/client';

export default function CartIcon() {
  const {totalQuantity} = useCart();

  return (
    <div>
      Cart <span>{totalQuantity > 0 ? `(${totalQuantity})` : null}</span>
    </div>
  );
}
