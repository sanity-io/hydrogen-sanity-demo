import {useFetcher} from '@remix-run/react';
import type {
  Cart,
  CartCost,
  CartLine,
} from '@shopify/hydrogen/storefront-api-types';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';

import {Link} from './Link';

export function CartLineItems({
  linesObj,
}: {
  linesObj: Cart['lines'] | undefined;
}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-8">
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}: {lineItem: CartLine}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4">
      {merchandise.image && (
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="flex-shrink-0"
        >
          <Image
            data={merchandise.image}
            width={110}
            height={110}
            alt={merchandise.title}
          />
        </Link>
      )}
      <div className="flex-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="text-gray-800 text-sm">{merchandise.title}</div>
        <div className="text-gray-800 text-sm">Qty: {quantity}</div>
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
      <Money data={lineItem.cost.totalAmount} />
    </div>
  );
}

function ItemRemoveButton({lineIds}: {lineIds: CartLine['id'][]}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="font-small my-2 flex h-10 w-10 max-w-xl items-center justify-center rounded-md border border-black bg-white text-center leading-none text-black hover:bg-black hover:text-white"
        type="submit"
      >
        <IconRemove />
      </button>
    </fetcher.Form>
  );
}

function IconRemove() {
  return (
    <svg
      fill="transparent"
      stroke="currentColor"
      viewBox="0 0 20 20"
      className="h-5 w-5"
    >
      <title>Remove</title>
      <path
        d="M4 6H16"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 6L6 17H14L14.5 6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function CartSummary({cost}: {cost: CartCost}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping</span>
          </dt>
          <dd className="text-green-600">Calculated at checkout</dd>
        </div>
      </dl>
    </>
  );
}

export function CartActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-2 flex flex-col">
      <a
        href={checkoutUrl}
        className="w-full rounded-md bg-black px-6 py-3 text-center font-medium text-white"
      >
        Continue to Checkout
      </a>
    </div>
  );
}
