import {useCart} from '@shopify/hydrogen';
import CircleOutlineButton from '../buttons/CircleOutline';
import {useCartUI} from './CartUIProvider.client';

type Props = {
  handleClick?: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({handleClick}: Props) {
  const {totalQuantity} = useCart();
  const cartUI = useCartUI();

  if (cartUI == null) {
    throw new Error('CartToggle must be a descendent of a CartUIProvider');
  }

  const {isCartOpen, toggleCart} = cartUI;

  return (
    <CircleOutlineButton
      aria-expanded={isCartOpen}
      aria-controls="cart"
      onClick={() => {
        // @ts-expect-error cartUI shouldnt return null
        toggleCart();
        handleClick?.();
      }}
    >
      {totalQuantity}
    </CircleOutlineButton>
  );
}
