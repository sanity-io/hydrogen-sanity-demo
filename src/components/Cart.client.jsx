import {
  CartCheckoutButton,
  CartEstimatedCost,
  CartLine,
  CartLines,
  Link,
  Money,
  useCart,
  useCartLinesTotalQuantity,
} from '@shopify/hydrogen/client';
import clsx from 'clsx';

import {useCartUI} from '../contexts/CartUIProvider.client';

import CartIcon from './CartIcon.client';

export default function Cart() {
  const itemCount = useCartLinesTotalQuantity();
  const {error} = useCart();
  const {closeCart, isCartOpen, toggleCart} = useCartUI();

  return (
    <>
      {/* Overlay */}
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
          isCartOpen ? 'right-0' : 'translate-x-full',
        ])}
      >
        <div className="overflow-hidden h-full pointer-events-auto">
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="bg-white p-4 h-20 border-b border-black flex flex-shrink-0 items-start justify-between">
              <CartIcon />
              <span
                className="font-medium"
                onClick={toggleCart}
                style={{cursor: 'pointer'}}
              >
                Close
              </span>
            </header>

            {/* Line items */}
            <div className="bg-white flex-grow px-4 overflow-y-scroll">
              {itemCount > 0 ? (
                <CartLineItems />
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

            <footer
              className={`${
                itemCount > 0 ? 'border-t border-solid border-gray-300' : ''
              } bg-white p-4 space-y-4 flex-shrink-0`}
            >
              {itemCount > 0 ? <CartFooter /> : null}
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

function CartLineItems() {
  return (
    <div role="table" aria-label="Shopping cart">
      <div role="row" className="sr-only">
        <div role="columnheader">Image</div>
        <div role="columnheader">Item details</div>
        <div role="columnheader">Price</div>
      </div>
      <CartLines>
        {({merchandise}) => {
          const productUrl = `/products/${merchandise.product.handle}`;
          return (
            <div
              role="row"
              className="border-b border-solid border-gray-300 last:border-0 py-4"
            >
              <div className="flex space-x-8 relative">
                <div role="cell">
                  <div className="w-20 h-20 relative">
                    <Link to={productUrl}>
                      <CartLine.Image className="bg-white w-full h-full object-contain" />
                    </Link>
                  </div>
                </div>
                <div
                  role="cell"
                  className="flex-grow flex flex-col justify-between"
                >
                  <div className="flex gap-2">
                    <div className="flex-grow">
                      <Link to={productUrl}>
                        <CartLine.ProductTitle className="text-gray-900 text-sm font-medium" />
                      </Link>
                      <CartLine.SelectedOptions className="text-sm">
                        {({name, value}) => (
                          <>
                            {name}: {value}
                          </>
                        )}
                      </CartLine.SelectedOptions>
                      <CartLine.Attributes className="text-sm">
                        {({key, value}) => (
                          <>
                            {key}: {value}
                          </>
                        )}
                      </CartLine.Attributes>
                    </div>
                    <div className="flex-shrink">
                      <CartLine.QuantityAdjustButton
                        adjust="remove"
                        aria-label="Remove from cart"
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
                      </CartLine.QuantityAdjustButton>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="flex-grow">
                      <div className="border border-solid border-gray-300 inline-flex items-center text-gray-500">
                        <CartLine.QuantityAdjustButton
                          adjust="decrease"
                          className="p-2"
                          aria-label="Decrease quantity"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </CartLine.QuantityAdjustButton>
                        <CartLine.Quantity
                          as="div"
                          className="p-2 text-gray-900 text-center text-sm"
                        />
                        <CartLine.QuantityAdjustButton
                          adjust="increase"
                          className="p-2"
                          aria-label="Increase quantity"
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
                        </CartLine.QuantityAdjustButton>
                      </div>
                    </div>
                  </div>
                  <CartLine.Price
                    role="cell"
                    className="absolute bottom-0 right-0 mb-3 text-sm"
                  />
                </div>
              </div>
            </div>
          );
        }}
      </CartLines>
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
              <Money money={subtotal} />
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
        {/* Shop pay */}
        {/*
        <CartShopPayButton
          className="flex w-full"
          style={{
            opacity: 0.25,
          }}
        />
        */}

        <CartCheckoutButton className="block w-full text-white text-sm bg-black px-3 py-4 disabled:cursor-wait disabled:opacity-60">
          Checkout
        </CartCheckoutButton>
      </div>
    </>
  );
}
