import {useCart} from '@shopify/hydrogen/client';
import {useCartUI} from './CartUIProvider.client';

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({handleClick}) {
  const {totalQuantity} = useCart();
  const cartUI = useCartUI();

  if (cartUI == null) {
    throw new Error('CartToggle must be a descendent of a CartUIProvider');
  }

  const {isCartOpen, toggleCart} = cartUI;

  return (
    <button
      type="button"
      aria-expanded={isCartOpen}
      aria-controls="cart"
      onClick={() => {
        toggleCart();
        handleClick();
      }}
    >
      Cart ({totalQuantity})
    </button>
  );
}
