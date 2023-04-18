import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

import {defaultButtonStyles} from '~/components/elements/Button';
import {Link} from '~/components/Link';

type ButtonMode = 'default' | 'inline';

export default function BuyNowButton({
  children = 'Buy now',
  lines,
  mode = 'default',
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  mode?: ButtonMode;
  [key: string]: any;
}) {
  const to = lines
    .map(
      (line) =>
        `${line.merchandiseId.replace('gid://shopify/ProductVariant/', '')}:${
          line.quantity
        }`,
    )
    .join(',');

  return (
    <Link
      to={`/cart/${to}`}
      className={mode == 'default' ? defaultButtonStyles() : ''}
      {...props}
    >
      {children}
    </Link>
  );
}
