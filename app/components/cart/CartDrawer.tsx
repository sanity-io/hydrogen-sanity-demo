import {Dialog, Transition} from '@headlessui/react';
import {Await} from '@remix-run/react';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import {Fragment, Suspense, useState} from 'react';

import {CartActions, CartLineItems, CartSummary} from '~/components/cart/Cart';
import Button from '~/components/elements/Button';
import CloseIcon from '~/components/icons/Close';

/**
 * A Drawer component that opens on user click.
 * @param open - Boolean state. If `true`, then the drawer opens.
 * @param onClose - Function should set the open state.
 * @param children - React children node.
 */

function CartDrawer({
  open,
  onClose,
  cart,
}: {
  open: boolean;
  onClose: () => void;
  cart: Cart;
}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none fixed inset-0 z-40 bg-black bg-opacity-20"
                />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={clsx(
                    'rounded-l-none fixed bottom-0 left-0 right-0 top-0 z-40 flex h-full w-full flex-col overflow-y-auto bg-white md:bottom-auto md:left-auto md:w-[470px]',
                    'md:rounded-l-xl',
                  )}
                >
                  <CartHeader
                    numLines={data?.totalQuantity}
                    onClose={onClose}
                  />
                  {data?.totalQuantity > 0 ? (
                    <>
                      <CartLineItems linesObj={data.lines} />
                      <CartFooter cart={data} />
                    </>
                  ) : (
                    <CartEmpty onClose={onClose} />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </Dialog>
          </Transition>
        )}
      </Await>
    </Suspense>
  );
}

/* Use for associating arialabelledby with the title*/
CartDrawer.Title = Dialog.Title;

export {CartDrawer};

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}

function CartHeader({
  numLines,
  onClose,
}: {
  numLines: number;
  onClose: () => void;
}) {
  return (
    <header
      className={clsx(
        'sticky top-0 flex h-header-sm items-center justify-between px-8',
        'lg:h-header-lg',
      )}
    >
      <div className="text-xl font-bold leading-none">
        Cart {numLines > 0 && `(${numLines})`}
      </div>
      <button type="button" onClick={onClose}>
        <CloseIcon />
      </button>
    </header>
  );
}

function CartFooter({cart}: {cart: Cart}) {
  return (
    <footer className="sticky bottom-0">
      <div className="relative flex flex-col">
        <CartSummary cost={cart.cost} />

        <div className="border-t border-gray p-4">
          <CartActions cart={cart} />
        </div>
      </div>
    </footer>
  );
}

function CartEmpty({onClose}: {onClose: () => void}) {
  return (
    <div className="flex flex-col px-8 pt-6">
      <p className="mb-4 text-lg font-bold">
        There&rsquo;s nothing in here...yet.
      </p>
      <Button onClick={onClose} type="button">
        Continue Shopping
      </Button>
    </div>
  );
}
