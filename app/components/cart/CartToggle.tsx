import {Await} from '@remix-run/react';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';

import CircleOutlineButton from '~/components/elements/CircleOutlineButton';

type Props = {
  cart: Cart;
  isOpen: boolean;
  openDrawer: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({cart, isOpen, openDrawer}: Props) {
  return (
    <Suspense fallback={<CircleOutlineButton>0</CircleOutlineButton>}>
      <Await resolve={cart}>
        {(data) => (
          <CircleOutlineButton
            aria-expanded={isOpen}
            aria-controls="cart"
            onClick={() => {
              openDrawer();
            }}
          >
            {data?.totalQuantity || 0}
          </CircleOutlineButton>
        )}
      </Await>
    </Suspense>
  );
}
