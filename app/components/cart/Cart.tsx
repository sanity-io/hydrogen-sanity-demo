import {CartForm} from '@shopify/hydrogen';
import type {
  Cart,
  CartCost,
  CartLine,
  CartLineUpdateInput,
  ComponentizableCartLine,
} from '@shopify/hydrogen/storefront-api-types';
import {
  flattenConnection,
  Image,
  Money,
  ShopPayButton,
} from '@shopify/hydrogen-react';
import clsx from 'clsx';

import Button, {defaultButtonStyles} from '~/components/elements/Button';
import MinusCircleIcon from '~/components/icons/MinusCircle';
import PlusCircleIcon from '~/components/icons/PlusCircle';
import RemoveIcon from '~/components/icons/Remove';
import SpinnerIcon from '~/components/icons/Spinner';
import {Link} from '~/components/Link';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';

export function CartLineItems({
  linesObj,
}: {
  linesObj: Cart['lines'] | undefined;
}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="flex-grow px-8" role="table" aria-label="Shopping cart">
      <div role="row" className="sr-only">
        <div role="columnheader">Product image</div>
        <div role="columnheader">Product details</div>
        <div role="columnheader">Price</div>
      </div>
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}: {lineItem: CartLine | ComponentizableCartLine}) {
  const {merchandise} = lineItem;

  const updatingItems = useCartFetchers(CartForm.ACTIONS.LinesUpdate);
  const removingItems = useCartFetchers(CartForm.ACTIONS.LinesRemove);

  // Check if the line item is being updated, as we want to show the new quantity as optimistic UI
  let updatingQty;
  const updating =
    updatingItems?.find((fetcher) => {
      const formData = fetcher?.formData;

      if (formData) {
        const formInputs = CartForm.getFormInput(formData);
        return (
          Array.isArray(formInputs?.inputs?.lines) &&
          formInputs?.inputs?.lines?.find((line: CartLineUpdateInput) => {
            updatingQty = line.quantity;
            return line.id === lineItem.id;
          })
        );
      }
    }) && updatingQty;

  // Check if the line item is being removed, as we want to show the line item as being deleted
  const deleting = removingItems.find((fetcher) => {
    const formData = fetcher?.formData;
    if (formData) {
      const formInputs = CartForm.getFormInput(formData);
      return (
        Array.isArray(formInputs?.inputs?.lineIds) &&
        formInputs?.inputs?.lineIds?.find(
          (lineId: CartLineUpdateInput['id']) => lineId === lineItem.id,
        )
      );
    }
  });

  const firstVariant = merchandise.selectedOptions[0];
  const hasDefaultVariantOnly =
    firstVariant.name === 'Title' && firstVariant.value === 'Default Title';

  return (
    <div
      role="row"
      className={clsx(
        'flex items-center border-b border-lightGray py-3 last:border-b-0',
        deleting && 'opacity-50',
      )}
    >
      {/* Image */}
      <div role="cell" className="mr-3 aspect-square w-[66px] flex-shrink-0">
        {merchandise.image && (
          <Link to={`/products/${merchandise.product.handle}`}>
            <Image
              className="rounded"
              data={merchandise.image}
              width={110}
              height={110}
              alt={merchandise.title}
            />
          </Link>
        )}
      </div>

      {/* Title */}
      <div
        role="cell"
        className="flex-grow-1 mr-4 flex w-full flex-col items-start"
      >
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="text-sm font-bold hover:underline"
        >
          {merchandise.product.title}
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
      <CartItemQuantity line={lineItem} submissionQuantity={updating} />

      {/* Price */}
      <div className="ml-4 mr-6 flex min-w-[4rem] justify-end text-sm font-bold leading-none">
        {updating ? (
          <SpinnerIcon width={24} height={24} />
        ) : (
          <Money data={lineItem.cost.totalAmount} />
        )}
      </div>

      <div role="cell" className="flex flex-col items-end justify-between">
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
    </div>
  );
}

function CartItemQuantity({
  line,
  submissionQuantity,
}: {
  line: CartLine | ComponentizableCartLine;
  submissionQuantity: number | undefined;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;

  // // The below handles optimistic updates for the quantity
  const lineQuantity = submissionQuantity ? submissionQuantity : quantity;

  const prevQuantity = Number(Math.max(0, lineQuantity - 1).toFixed(0));
  const nextQuantity = Number((lineQuantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2">
      <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          value={prevQuantity}
          disabled={quantity <= 1}
        >
          <MinusCircleIcon />
        </button>
      </UpdateCartButton>

      <div className="min-w-[1rem] text-center text-sm font-bold leading-none text-black">
        {lineQuantity}
      </div>

      <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button aria-label="Increase quantity" value={prevQuantity}>
          <PlusCircleIcon />
        </button>
      </UpdateCartButton>
    </div>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function ItemRemoveButton({lineIds}: {lineIds: CartLine['id'][]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="disabled:pointer-events-all disabled:cursor-wait"
        type="submit"
      >
        <RemoveIcon />
      </button>
    </CartForm>
  );
}

export function CartSummary({cost}: {cost: CartCost}) {
  return (
    <>
      <div role="table" aria-label="Cost summary" className="text-sm">
        <div
          className="flex justify-between border-t border-gray p-4"
          role="row"
        >
          <span className="text-darkGray" role="rowheader">
            Subtotal
          </span>
          <span role="cell" className="text-right font-bold">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>

        <div
          role="row"
          className="flex justify-between border-t border-gray p-4"
        >
          <span className="text-darkGray" role="rowheader">
            Shipping
          </span>
          <span role="cell" className="font-bold uppercase">
            Calculated at checkout
          </span>
        </div>
      </div>
    </>
  );
}

export function CartActions({cart}: {cart: Cart}) {
  const {storeDomain} = useRootLoaderData();

  if (!cart || !cart.checkoutUrl) return null;

  const shopPayLineItems = flattenConnection(cart.lines).map((line) => ({
    id: line.merchandise.id,
    quantity: line.quantity,
  }));

  return (
    <div className="flex w-full gap-3">
      <ShopPayButton
        className={clsx([defaultButtonStyles({tone: 'shopPay'}), 'w-1/2'])}
        variantIdsAndQuantities={shopPayLineItems}
        storeDomain={storeDomain}
      />
      <Button
        to={cart.checkoutUrl}
        className={clsx([defaultButtonStyles(), 'w-1/2'])}
      >
        Checkout
      </Button>
    </div>
  );
}
