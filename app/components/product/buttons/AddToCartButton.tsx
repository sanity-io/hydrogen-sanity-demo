import {useFetcher, useMatches} from '@remix-run/react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {twMerge} from 'tailwind-merge';

import {defaultButtonStyles} from '~/components/elements/Button';
import {CartAction} from '~/types/shopify';

type FormMode = 'default' | 'inline';

export default function AddToCartButton({
  children = 'Add to cart',
  lines,
  analytics,
  formMode = 'default',
  buttonClassName,
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  analytics?: unknown;
  formMode?: FormMode;
  buttonClassName?: string;
  [key: string]: any;
}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      action={`/cart`}
      method="post"
      className={formMode == 'inline' ? 'inline' : ''}
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
        className={
          formMode == 'default'
            ? twMerge(defaultButtonStyles(), buttonClassName)
            : buttonClassName
        }
        {...props}
      >
        {children}
      </button>
    </fetcher.Form>
  );
}
