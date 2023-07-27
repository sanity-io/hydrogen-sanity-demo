import {type FetcherWithComponents, useFetcher} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {twMerge} from 'tailwind-merge';

import {defaultButtonStyles} from '~/components/elements/Button';
import SpinnerIcon from '~/components/icons/Spinner';

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
  return (
    // We can't pass a className to CartForm, so we have to wrap it in a div with a className instead
    <div className={mode == 'inline' ? '[&>*]:inline' : ''}>
      <CartForm
        route={`/cart`}
        inputs={{
          lines,
        }}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher: FetcherWithComponents<any>) => (
          <>
            <input
              type="hidden"
              name="analytics"
              value={JSON.stringify(analytics)}
            />
            <button
              className={
                mode == 'default'
                  ? twMerge(defaultButtonStyles(), buttonClassName)
                  : buttonClassName
              }
              {...props}
              disabled={fetcher.state !== 'idle' || props.disabled}
            >
              {fetcher.state !== 'idle' ? (
                <SpinnerIcon width={24} height={24} />
              ) : (
                children
              )}
            </button>
          </>
        )}
      </CartForm>
    </div>
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
  const fetcher = useFetcher();

  const onClick = () =>
    fetcher.submit(
      {
        cartFormInput: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines,
          },
        }),
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
