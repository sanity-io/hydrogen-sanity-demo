import clsx from 'clsx';

import {defaultButtonStyles} from '~/components/elements/Button';
import Link from '~/components/elements/Link';
import type {SanityLink} from '~/lib/sanity';

type Props = {
  backgroundColor?: string;
  className?: string;
  link: SanityLink;
  textColor?: string;
};

export default function LinkButton({
  backgroundColor,
  className,
  link,
  textColor,
}: Props) {
  if (!link.title) {
    return null;
  }

  return (
    <Link
      className={clsx(defaultButtonStyles(), className)}
      link={link}
      style={{background: backgroundColor, color: textColor}}
    >
      {link.title}
    </Link>
  );
}
