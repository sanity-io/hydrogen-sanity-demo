import {Dialog, Transition} from '@headlessui/react';
import {
  CartCheckoutButton,
  CartEstimatedCost,
  CartLineImage,
  CartLinePrice,
  CartLineProductTitle,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  CartLines,
  CartShopPayButton,
  Link,
  useCart,
  useCartLine,
} from '@shopify/hydrogen';
import {Fragment} from 'react';
import {useCartUI} from './CartUIProvider.client';

/**
 * A client component that contains the merchandise that a customer intends to purchase, and the estimated cost associated with the cart
 */
export default function Cart() {
  const {isCartOpen, closeCart} = useCartUI();
  const {totalQuantity} = useCart();

  return (
    <>
      <Transition show={isCartOpen}>
        <Dialog onClose={closeCart}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-40 bg-black bg-opacity-20"
            />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-[450ms]"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in-out duration-[400ms]"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              className={`fixed top-0 left-0 right-0 bottom-0 z-40 flex h-full w-full flex-col overflow-y-auto rounded-l-xl bg-white md:left-auto md:bottom-auto md:block md:w-[470px]`}
            >
              <CartHeader />
              {totalQuantity === 0 ? (
                <CartEmpty />
              ) : (
                <>
                  <CartItems />
                  <CartFooter />
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CartHeader() {
  const {closeCart} = useCartUI();
  return (
    <header className="sticky top-0 flex items-center justify-end p-4">
      <button type="button" onClick={closeCart}>
        <span>Close</span>
      </button>
    </header>
  );
}

function CartItems() {
  return (
    <div className="flex-grow px-4" role="table" aria-label="Shopping cart">
      <div role="row" className="sr-only">
        <div role="columnheader">Product image</div>
        <div role="columnheader">Product details</div>
        <div role="columnheader">Price</div>
      </div>
      <CartLines>
        <LineInCart />
      </CartLines>
    </div>
  );
}

function LineInCart() {
  const {merchandise} = useCartLine();
  return (
    <div
      role="row"
      className="flex border-b border-lightGray py-4 last:border-b-0"
    >
      <div role="cell" className="mr-7 flex-shrink-0">
        <Link to={`/products/${merchandise.product.handle}`}>
          <CartLineImage
            className="rounded"
            loaderOptions={{width: 98, height: 98, crop: 'center'}}
          />
        </Link>
      </div>
      <div
        role="cell"
        className="flex-grow-1 mr-4 flex w-full flex-col items-start justify-between"
      >
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="hover:underline"
        >
          <CartLineProductTitle className="font-medium" />
        </Link>
        <ul className="space-y-1 text-xs">
          {merchandise.selectedOptions.map(({name, value}) => (
            <li key={name}>
              {name}: {value}
            </li>
          ))}
        </ul>
        <CartItemQuantity />
      </div>
      <div role="cell" className="flex flex-col items-end justify-between">
        <CartLineQuantityAdjustButton
          adjust="remove"
          aria-label="Remove from cart"
          className="disabled:pointer-events-all disabled:cursor-wait"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </CartLineQuantityAdjustButton>
        <CartLinePrice />
      </div>
    </div>
  );
}

function CartItemQuantity() {
  return (
    <div className="mt-2 flex items-center overflow-auto rounded border border-gray">
      <CartLineQuantityAdjustButton
        adjust="decrease"
        aria-label="Decrease quantity"
        className="disabled:pointer-events-all p-2 disabled:cursor-wait"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </CartLineQuantityAdjustButton>
      <CartLineQuantity
        as="div"
        className="p-2 text-center text-xs text-black"
      />
      <CartLineQuantityAdjustButton
        adjust="increase"
        aria-label="Increase quantity"
        className="disabled:pointer-events-all p-2 text-black disabled:cursor-wait"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </CartLineQuantityAdjustButton>
    </div>
  );
}

function CartFooter() {
  return (
    <footer className="sticky bottom-0 border-t border-black border-opacity-5 pb-8">
      <div className="relative flex h-60 flex-col p-4 text-black">
        <div role="table" aria-label="Cost summary">
          <div role="row" className="flex justify-between">
            <span className="font-medium" role="rowheader">
              Subtotal
            </span>
            <CartEstimatedCost
              amountType="subtotal"
              role="cell"
              className="text-right "
            />
          </div>
          <div role="row" className="mt-2 flex justify-between">
            <span className="font-medium" role="rowheader">
              Shipping
            </span>
            <span role="cell" className="uppercase">
              Free
            </span>
          </div>
        </div>
        <CartShopPayButton className="btn my-4 flex w-full justify-center bg-[#5a31f4] py-2" />
        <CartCheckoutButton className="btn flex">Checkout</CartCheckoutButton>
      </div>
    </footer>
  );
}

function CartEmpty() {
  const {closeCart} = useCartUI();
  return (
    <div className="flex flex-col p-4">
      <p className="mb-4 text-center">Your cart is empty</p>
      <button className="btn" type="button" onClick={closeCart}>
        Continue Shopping
      </button>
    </div>
  );
}
