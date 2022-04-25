import {useCartUI} from '../contexts/CartUIProvider.client';
import CartIcon from './CartIcon.client';

export default function CartToggleButton() {
  const {toggleCart} = useCartUI();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="cursor-pointer flex space-x-2" onClick={() => toggleCart()}>
      <CartIcon />
    </div>
  );
}
