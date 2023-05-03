import {useFetcher, useMatches} from '@remix-run/react';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {twMerge} from 'tailwind-merge';

import {defaultButtonStyles} from '~/components/elements/Button';
import SpinnerIcon from '~/components/icons/Spinner';
import {CartAction} from '~/types/shopify';

type FormMode = 'default' | 'inline';

export default function AddToCartButton({
  children = 'Add to cart',
  lines,
  analytics,
  mode = 'default',
  buttonClassName,
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  analytics?: unknown;
  mode?: FormMode;
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
        className={
          mode == 'default'
            ? twMerge(defaultButtonStyles(), buttonClassName)
            : buttonClassName
        }
        {...props}
        disabled={fetcher.state === 'submitting'}
      >
        {fetcher.state === 'submitting' ? (
          <SpinnerIcon width={24} height={24} />
        ) : (
          children
        )}
      </button>
    </fetcher.Form>
  );
}

export function AddToCartLink({
  children = 'Add to cart',
  lines,
  analytics,
  mode = 'default',
  buttonClassName,
  loadingContent,
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  analytics?: unknown;
  mode?: FormMode;
  buttonClassName?: string;
  loadingContent?: React.ReactNode;
  [key: string]: any;
}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  const onClick = () =>
    fetcher.submit(
      {
        cartAction: CartAction.ADD_TO_CART,
        countryCode: selectedLocale?.country,
        lines: JSON.stringify(lines),
        analytics: JSON.stringify(analytics),
      },
      {method: 'post', action: '/cart?index'},
    );

  return (
    <button
      className={
        mode == 'default'
          ? twMerge(defaultButtonStyles(), buttonClassName)
          : buttonClassName
      }
      onClick={onClick}
      {...props}
    >
      {fetcher.state === 'submitting' && loadingContent
        ? loadingContent
        : children}
    </button>
  );
}
