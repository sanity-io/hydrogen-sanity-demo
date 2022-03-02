import {useCartUI} from '../contexts/CartUIProvider.client';
import CartIcon from './CartIcon.client';

export default function CartToggleButton() {
  const {toggleCart} = useCartUI();

  return (
    <div className="cursor-pointer flex space-x-2" onClick={() => toggleCart()}>
      <CartIcon />
    </div>
  );
}
