import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';

type Props = PortableTextBlock & {
  mark: PortableTextMarkDefinition & {
    slug: string;
  };
};

export default function AnnotationLinkInternal({children, mark}: Props) {
  if (!mark?.slug) {
    return null;
  }

  return (
    <Link
      className={clsx(
        'inline-flex items-center underline transition-opacity duration-300',
        'hover:opacity-60',
      )}
      to={mark?.slug}
    >
      <>{children}</>
    </Link>
  );
}
