import Link from '../Link';
import clsx from 'clsx';
import {DEFAULT_BUTTON_STYLES} from '../../constants';
import {SanityLink} from '../../types';

type Props = {
  backgroundColor?: string;
  className?: string;
  link: SanityLink;
  textColor?: string;
};

export default function ButtonLink({
  backgroundColor,
  className,
  link,
  textColor,
}: Props) {
  return (
    <Link
      className={clsx(DEFAULT_BUTTON_STYLES, className)}
      link={link}
      style={{background: backgroundColor, color: textColor}}
    >
      {link.title}
    </Link>
  );
}
