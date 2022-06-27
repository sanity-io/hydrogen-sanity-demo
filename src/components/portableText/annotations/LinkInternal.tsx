// prettier-ignore
// @ts-expect-error incompatibility with node16 resolution
import type { PortableTextBlock, PortableTextMarkDefinition } from '@portabletext/types';
import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';

type Props = PortableTextBlock & {
  mark: PortableTextMarkDefinition & {
    slug?: string;
  };
};

export default function LinkInternalAnnotation({children, mark}: Props) {
  if (!mark?.slug) {
    return null;
  }

  return (
    <Link
      className={clsx(
        'inline-flex items-center underline transition-opacity duration-200',
        'hover:opacity-60',
      )}
      to={mark?.slug}
    >
      <>{children}</>
    </Link>
  );
}
