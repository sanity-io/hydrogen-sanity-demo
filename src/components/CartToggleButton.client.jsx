import {useCartUI} from '../contexts/CartUIProvider.client';
import CartIcon from './CartIcon.client';

export default function CartToggleButton() {
  const {toggleCart} = useCartUI();

  return (
    <div className="cursor-pointer" onClick={() => toggleCart()}>
      <CartIcon />
    </div>
  );
}
