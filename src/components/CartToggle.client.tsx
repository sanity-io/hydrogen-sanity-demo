import {useCart} from '@shopify/hydrogen';
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
    <button
      aria-expanded={isCartOpen}
      aria-controls="cart"
      className="aspect-square w-[2.375rem] place-content-center rounded-full border border-lightGray bg-white text-sm font-bold"
      onClick={() => {
        // @ts-expect-error cartUI shouldnt return null
        toggleCart();
        handleClick?.();
      }}
      type="button"
    >
      {totalQuantity}
    </button>
  );
}
