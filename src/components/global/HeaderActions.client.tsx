import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import Cart from '../cart/Cart.client';
import CartToggle from '../cart/CartToggle.client';
import {UserIcon} from '../icons/User';
import CountrySelect from './CountrySelect.client';

export default function HeaderActions() {
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
          <CountrySelect />
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
          <CartToggle />
        </div>
      </div>

      <Cart />
    </>
  );
}
