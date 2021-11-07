import {Link} from '@shopify/hydrogen/client';

import {useCartUI} from '../contexts/CartUIProvider.client';

import CartIcon from './CartIcon.client';

export default function Header() {
  const {toggleCart} = useCartUI();

  return (
    <header
      className="border-b border-black flex justify-between h-20 p-4 w-full"
      role="banner"
    >
      <div className="">
        <Link className="font-medium" to="/">
          Sanity + Hydrogen demo store
        </Link>
      </div>
      <div onClick={() => toggleCart()} style={{cursor: 'pointer'}}>
        <CartIcon />
      </div>
    </header>
  );
}
