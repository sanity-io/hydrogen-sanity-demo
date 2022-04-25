import {MinusSmIcon, PlusSmIcon, XIcon} from '@heroicons/react/solid';
import {
  CartCheckoutButton,
  CartEstimatedCost,
  CartLineImage,
  CartLinePrice,
  CartLineProductTitle,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  CartLines,
  Money,
  useCart,
  useCartLine,
} from '@shopify/hydrogen/client';
import clsx from 'clsx';
import {useCartUI} from '../contexts/CartUIProvider.client';
import CartIcon from './CartIcon.client';
import LinkProduct from './LinkProduct.client';

export default function Cart() {
  const {error, totalQuantity} = useCart();
  const {closeCart, isCartOpen, toggleCart} = useCartUI();

  // TODO: close the cart automatically whenever the URL changes
  return (
    <>
      {/* Overlay */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={`z-50 fixed top-0 bottom-0 left-0 right-0 bg-black transition-opacity duration-300 ${
          isCartOpen ? 'opacity-20' : 'opacity-0 pointer-events-none'
        }`}
        onClick={isCartOpen ? closeCart : null}
      />

      {/* Panel */}
      <div
        className={clsx([
          'pointer-events-none z-50 h-full fixed right-0 top-0 bottom-0 flex flex-col w-full max-w-md min-w-sm transition-transform duration-500 transform-gpu',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        ])}
      >
        <div className="overflow-hidden h-full pointer-events-auto">
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="bg-white p-4 h-20 border-b border-black flex flex-shrink-0 items-start justify-between">
              <CartIcon />
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <span className="cursor-pointer font-medium" onClick={toggleCart}>
                Close
              </span>
            </header>

            {/* Line items */}
            <div className="bg-white flex-grow px-4 overflow-y-auto">
              {totalQuantity > 0 ? (
                <CartLines>
                  <CartLineItems closeCart={closeCart} />
                </CartLines>
              ) : (
                <p className="py-4 text-gray-600">Your cart is empty</p>
              )}
            </div>

            {/* Error */}
            {error ? (
              <div
                className="border bg-red-200 border-red-400 text-red-800 mb-4 mx-8 px-4 py-3 rounded relative"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            {/* Footer */}
            <footer
              className={`${
                totalQuantity > 0 ? 'border-t border-solid border-gray-300' : ''
              } bg-white p-4 space-y-4 flex-shrink-0`}
            >
              {totalQuantity > 0 ? <CartFooter /> : null}
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

function CartLineItems(props) {
  const {closeCart} = props;
  const {merchandise} = useCartLine();
  const variant = merchandise?.id;

  return (
    <div role="table" aria-label="Shopping cart">
      <div role="row" className="sr-only">
        <div role="columnheader">Image</div>
        <div role="columnheader">Item details</div>
        <div role="columnheader">Price</div>
      </div>

      <div
        role="row"
        className="border-b border-solid border-gray-300 last:border-0 py-4"
      >
        <div className="flex space-x-8 relative">
          <div role="cell">
            <div className="w-20 h-20 relative">
              <LinkProduct
                handle={merchandise.product.handle}
                onClick={closeCart}
                variantId={variant?.id}
              >
                <CartLineImage className="bg-white w-full h-full object-contain" />
              </LinkProduct>
            </div>
          </div>
          <div role="cell" className="flex-grow flex flex-col justify-between">
            <div className="flex gap-2">
              <div className="flex-grow">
                <LinkProduct
                  handle={merchandise.product.handle}
                  onClick={closeCart}
                  variantId={variant?.id}
                >
                  <CartLineProductTitle className="text-gray-900 text-sm font-medium" />
                </LinkProduct>
                {/* Selected options */}
                <ul className="text-sm">
                  {merchandise.selectedOptions.map(({name, value}) => (
                    <li key={name}>
                      {name}: {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink">
                <CartLineQuantityAdjustButton
                  adjust="remove"
                  aria-label="Remove from cart"
                >
                  <XIcon className="h-4 mt-1 w-4" />
                </CartLineQuantityAdjustButton>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex-grow">
                <div className="border border-gray-300 inline-flex items-center text-gray-500">
                  <CartLineQuantityAdjustButton
                    adjust="decrease"
                    className="p-2 text-gray-400"
                    aria-label="Decrease quantity"
                  >
                    <MinusSmIcon className="h-4 w-4" />
                  </CartLineQuantityAdjustButton>
                  <CartLineQuantity
                    as="div"
                    className="text-gray-900 text-center text-sm"
                  />
                  <CartLineQuantityAdjustButton
                    adjust="increase"
                    className="p-2 text-gray-400"
                    aria-label="Increase quantity"
                  >
                    <PlusSmIcon className="h-4 w-4" />
                  </CartLineQuantityAdjustButton>
                </div>
              </div>

              <CartLinePrice className="text-sm" role="cell" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartFooter() {
  const {subtotal} = useCart();

  return (
    <>
      <div role="table" className="w-full" aria-label="Cost summary">
        {subtotal && (
          <div role="row" className="flex items-center justify-between">
            <div role="rowheader" className="pb-2 font-medium">
              Subtotal
            </div>
            <div role="cell" className="text-right pb-2">
              <Money data={subtotal} />
            </div>
          </div>
        )}
        <div role="row" className="flex items-center justify-between">
          <div role="rowheader" className="font-medium">
            Shipping
          </div>
          <div role="cell" className="text-right">
            Free
          </div>
        </div>
        <div role="row" className="flex items-center justify-between">
          <div role="rowheader" className="font-medium">
            Total
          </div>
          <CartEstimatedCost
            amountType="total"
            role="cell"
            className="text-right"
          />
        </div>
      </div>
      <div className="space-y-2">
        <CartCheckoutButton className="block w-full text-white text-sm bg-black px-3 py-4 disabled:cursor-wait disabled:opacity-60">
          Checkout
        </CartCheckoutButton>
      </div>
    </>
  );
}
