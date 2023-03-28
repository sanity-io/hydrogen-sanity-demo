import {useFetcher, useMatches} from '@remix-run/react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

import {CartAction} from '~/types/shopify';

export default function AddToCartButton({
  children,
  lines,
  analytics,
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  analytics?: unknown;
  [key: string]: any;
}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  return (
    <fetcher.Form action={`/cart`} method="post">
      <input type="hidden" name="cartAction" value={CartAction.ADD_TO_CART} />
      {selectedLocale && (
        <input
          type="hidden"
          name="countryCode"
          value={selectedLocale.country}
        />
      )}
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <input type="hidden" name="analytics" value={JSON.stringify(analytics)} />
      <button
        className="w-full max-w-[400px] rounded-md bg-black px-6 py-3 text-center font-medium text-white"
        {...props}
      >
        {children}
      </button>
    </fetcher.Form>
  );
}
