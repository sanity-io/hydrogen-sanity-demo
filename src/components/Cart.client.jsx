import {MinusSmIcon, PlusSmIcon, XIcon} from '@heroicons/react/solid';
import {
  CartCheckoutButton,
  CartEstimatedCost,
  CartLine,
  CartLines,
  Money,
  useCart,
  useCartLinesTotalQuantity,
} from '@shopify/hydrogen/client';
import clsx from 'clsx';
import {decode} from 'shopify-gid';

import {useCartUI} from '../contexts/CartUIProvider.client';

import CartIcon from './CartIcon.client';
import LinkProduct from './LinkProduct.client';

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
              <span className="cursor-pointer font-medium" onClick={toggleCart}>
                Close
              </span>
            </header>

            {/* Line items */}
            <div className="bg-white flex-grow px-4 overflow-y-auto">
              {itemCount > 0 ? (
                <CartLineItems closeCart={closeCart} />
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

function CartLineItems(props) {
  const {closeCart} = props;
  return (
    <div role="table" aria-label="Shopping cart">
      <div role="row" className="sr-only">
        <div role="columnheader">Image</div>
        <div role="columnheader">Item details</div>
        <div role="columnheader">Price</div>
      </div>
      <CartLines>
        {({merchandise}) => {
          const variant = decode(merchandise?.id);

          return (
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
                      <CartLine.Image className="bg-white w-full h-full object-contain" />
                    </LinkProduct>
                  </div>
                </div>
                <div
                  role="cell"
                  className="flex-grow flex flex-col justify-between"
                >
                  <div className="flex gap-2">
                    <div className="flex-grow">
                      <LinkProduct
                        handle={merchandise.product.handle}
                        onClick={closeCart}
                        variantId={variant?.id}
                      >
                        <CartLine.ProductTitle className="text-gray-900 text-sm font-medium" />
                      </LinkProduct>
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
                        <XIcon className="h-4 mt-1 w-4" />
                      </CartLine.QuantityAdjustButton>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex-grow">
                      <div className="border border-gray-300 inline-flex items-center text-gray-500">
                        <CartLine.QuantityAdjustButton
                          adjust="decrease"
                          className="p-2 text-gray-400"
                          aria-label="Decrease quantity"
                        >
                          <MinusSmIcon className="h-4 w-4" />
                        </CartLine.QuantityAdjustButton>
                        <CartLine.Quantity
                          as="div"
                          className="text-gray-900 text-center text-sm"
                        />
                        <CartLine.QuantityAdjustButton
                          adjust="increase"
                          className="p-2 text-gray-400"
                          aria-label="Increase quantity"
                        >
                          <PlusSmIcon className="h-4 w-4" />
                        </CartLine.QuantityAdjustButton>
                      </div>
                    </div>

                    <CartLine.Price className="text-sm" role="cell" />
                  </div>
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
        />
        */}

        <CartCheckoutButton className="block w-full text-white text-sm bg-black px-3 py-4 disabled:cursor-wait disabled:opacity-60">
          Checkout
        </CartCheckoutButton>
      </div>
    </>
  );
}
