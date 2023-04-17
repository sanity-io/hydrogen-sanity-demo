import {useFetcher, useMatches} from '@remix-run/react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

import {defaultButtonStyles} from '~/components/elements/Button';
import {CartAction} from '~/types/shopify';

type ButtonMode = 'default' | 'inline';

export default function AddToCartButton({
  children = 'Add to cart',
  lines,
  analytics,
  mode = 'default',
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  analytics?: unknown;
  mode?: ButtonMode;
  [key: string]: any;
}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      action={`/cart`}
      method="post"
      className={mode == 'inline' ? 'inline' : ''}
    >
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
        className={mode == 'default' ? defaultButtonStyles() : ''}
        {...props}
      >
        {children}
      </button>
    </fetcher.Form>
  );
}
