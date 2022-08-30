import clsx from 'clsx';
import type {SanityLink} from '../../types';
import {defaultButtonStyles} from './Button';
import Link from './Link';

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
