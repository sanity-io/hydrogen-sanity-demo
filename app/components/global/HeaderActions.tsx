import {useMatches} from '@remix-run/react';
import clsx from 'clsx';
import {useEffect} from 'react';

import {CartDrawer, useDrawer} from '~/components/cart/CartDrawer';
import CartToggle from '~/components/cart/CartToggle';
import {CountrySelector} from '~/components/global/CountrySelector';
import {UserIcon} from '~/components/icons/User';
import {Link} from '~/components/Link';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export default function HeaderActions() {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const [root] = useMatches();
  const cart = root.data?.cart;

  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (
      isOpen ||
      addToCartFetchers.length === 0 ||
      addToCartFetchers[0].state === 'submitting'
    )
      return;
    openDrawer();
  }, [addToCartFetchers, isOpen, openDrawer]);

  return (
    <>
      <div
        className={clsx(
          'absolute right-0 flex h-full items-center', //
          'md:mr-4',
        )}
      >
        {/* Country select */}
        <div
          className={clsx(
            'hidden', //
            'lg:block',
          )}
        >
          <CountrySelector />
        </div>
        {/* Account */}
        <Link
          className={clsx([
            'hidden h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 p-2',
            'lg:flex',
            'hover:bg-opacity-10',
          ])}
          to="/account"
        >
          <UserIcon />
        </Link>
        {/* Cart */}
        <div className="ml-2 mr-4 flex h-full items-center justify-center py-4">
          <CartToggle cart={cart} isOpen openDrawer={openDrawer} />
        </div>
      </div>

      <CartDrawer cart={cart} open={isOpen} onClose={closeDrawer} />
    </>
  );
}
