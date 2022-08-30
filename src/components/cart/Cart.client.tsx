// @ts-expect-error incompatibility with node16 resolution
import {Dialog, Transition} from '@headlessui/react';
import {
  CartCheckoutButton,
  CartCost,
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
import MinusCircleIcon from '../icons/MinusCircle';
import PlusCircleIcon from '../icons/PlusCircle';
import clsx from 'clsx';
import CloseIcon from '../icons/Close';
import Button, {defaultButtonStyles} from '../elements/Button';
import {useCartUI} from './CartUIProvider.client';

/**
 * A client component that contains the merchandise that a customer intends to purchase, and the estimated cost associated with the cart
 */

export default function Cart() {
  const {isCartOpen, closeCart} = useCartUI();
  const {lines, totalQuantity} = useCart();

  return (
    <Transition show={isCartOpen}>
      <Dialog onClose={closeCart}>
        {/* Overlay */}
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

        {/* Panel */}
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
              'rounded-l-none fixed top-0 left-0 right-0 bottom-0 z-40 flex h-full w-full flex-col overflow-y-auto bg-white md:left-auto md:bottom-auto md:w-[470px]',
              'md:rounded-l-xl',
            )}
          >
            <CartHeader numLines={lines.length} />
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
  );
}

function CartHeader({numLines}: {numLines: number}) {
  const {closeCart} = useCartUI();
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
      <button type="button" onClick={closeCart}>
        <CloseIcon />
      </button>
    </header>
  );
}

function CartItems() {
  return (
    <div className="flex-grow px-8" role="table" aria-label="Shopping cart">
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

  const firstVariant = merchandise.selectedOptions[0];
  const hasDefaultVariantOnly =
    firstVariant.name === 'Title' && firstVariant.value === 'Default Title';

  return (
    <div
      role="row"
      className="flex items-center border-b border-lightGray py-3 last:border-b-0"
    >
      {/* Image */}
      <div role="cell" className="mr-3 aspect-square w-[66px] flex-shrink-0">
        <Link to={`/products/${merchandise.product.handle}`}>
          <CartLineImage
            className="rounded"
            loaderOptions={{width: 100, height: 100, crop: 'center'}}
          />
        </Link>
      </div>

      <div
        role="cell"
        className="flex-grow-1 mr-4 flex w-full flex-col items-start"
      >
        {/* Title */}
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="hover:underline"
        >
          <CartLineProductTitle className="text-sm font-bold" />
        </Link>

        {/* Options */}
        {!hasDefaultVariantOnly && (
          <ul className="mt-1 space-y-1 text-xs text-darkGray">
            {merchandise.selectedOptions.map(({name, value}) => (
              <li key={name}>
                {name}: {value}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quantity */}
      <div className="flex-shrink-0">
        <CartItemQuantity />
      </div>

      {/* Price */}
      <CartLinePrice className="ml-4 mr-6 min-w-[4rem] text-right text-sm font-bold leading-none" />

      {/* Remove */}
      <div role="cell" className="flex flex-col items-end justify-between">
        <CartLineQuantityAdjustButton
          adjust="remove"
          aria-label="Remove from cart"
          className="disabled:pointer-events-all disabled:cursor-wait"
        >
          <svg
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.6443 4.375H3.88477"
              stroke="#757575"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.25195 8.125V13.125"
              stroke="#757575"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.2773 8.125V13.125"
              stroke="#757575"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.3025 4.375V16.25C17.3025 16.4158 17.2318 16.5747 17.106 16.6919C16.9802 16.8092 16.8096 16.875 16.6316 16.875H5.89745C5.71952 16.875 5.54888 16.8092 5.42306 16.6919C5.29725 16.5747 5.22656 16.4158 5.22656 16.25V4.375"
              stroke="#757575"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.619 4.375V3.125C14.619 2.79348 14.4777 2.47554 14.226 2.24112C13.9744 2.0067 13.6331 1.875 13.2772 1.875H9.25193C8.89607 1.875 8.55478 2.0067 8.30315 2.24112C8.05152 2.47554 7.91016 2.79348 7.91016 3.125V4.375"
              stroke="#757575"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CartLineQuantityAdjustButton>
      </div>
    </div>
  );
}

function CartItemQuantity() {
  return (
    <div className="flex items-center gap-2">
      <CartLineQuantityAdjustButton
        adjust="decrease"
        aria-label="Decrease quantity"
        className="disabled:pointer-events-all disabled:cursor-wait"
      >
        <MinusCircleIcon />
      </CartLineQuantityAdjustButton>
      <CartLineQuantity
        as="div"
        className="min-w-[1rem] text-center text-sm font-bold leading-none text-black"
      />
      <CartLineQuantityAdjustButton
        adjust="increase"
        aria-label="Increase quantity"
        className="disabled:pointer-events-all text-black disabled:cursor-wait"
      >
        <PlusCircleIcon />
      </CartLineQuantityAdjustButton>
    </div>
  );
}

function CartFooter() {
  return (
    <footer className="sticky bottom-0">
      <div className="relative flex flex-col">
        <div role="table" aria-label="Cost summary" className="text-sm">
          <div
            className="flex justify-between border-t border-gray p-4"
            role="row"
          >
            <span className="text-darkGray" role="rowheader">
              Subtotal
            </span>
            <CartCost
              amountType="subtotal"
              className="text-right font-bold"
              role="cell"
            />
          </div>

          <div
            role="row"
            className="flex justify-between border-t border-gray p-4"
          >
            <span className="text-darkGray" role="rowheader">
              Shipping
            </span>
            <span role="cell" className="font-bold uppercase">
              Free
            </span>
          </div>
        </div>

        <div className="flex w-full gap-3 border-t border-gray p-4">
          <CartShopPayButton
            className={clsx([defaultButtonStyles({tone: 'shopPay'}), 'w-1/2'])}
            width="100%"
          />
          <CartCheckoutButton
            className={clsx([defaultButtonStyles(), 'w-1/2'])}
          >
            Checkout
          </CartCheckoutButton>
        </div>
      </div>
    </footer>
  );
}

function CartEmpty() {
  const {closeCart} = useCartUI();
  return (
    <div className="flex flex-col px-8 pt-6">
      <p className="mb-4 text-lg font-bold">
        There&rsquo;s nothing in here...yet.
      </p>
      <Button onClick={closeCart} type="button">
        Continue Shopping
      </Button>
    </div>
  );
}
