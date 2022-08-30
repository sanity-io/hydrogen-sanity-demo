import {useCart} from '@shopify/hydrogen';
import CircleOutlineButton from '../elements/CircleOutlineButton';
import {useCartUI} from './CartUIProvider.client';

type Props = {
  onClick?: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({onClick}: Props) {
  const {totalQuantity} = useCart();
  const {isCartOpen, toggleCart} = useCartUI();

  return (
    <CircleOutlineButton
      aria-expanded={isCartOpen}
      aria-controls="cart"
      onClick={() => {
        toggleCart();
        onClick?.();
      }}
    >
      {totalQuantity}
    </CircleOutlineButton>
  );
}
