import {Link} from '@shopify/hydrogen';
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
  if (link._type === 'linkExternal') {
    return (
      <a
        className={clsx(DEFAULT_BUTTON_STYLES, className)}
        href={link.url}
        rel="noreferrer"
        style={{background: backgroundColor, color: textColor}}
        target={link.newWindow ? '_blank' : '_self'}
      >
        {link.title}
      </a>
    );
  }

  if (link._type === 'linkInternal') {
    return (
      <Link
        className={clsx(DEFAULT_BUTTON_STYLES, className)}
        to={link.slug}
        style={{background: backgroundColor, color: textColor}}
      >
        {link.title}
      </Link>
    );
  }

  return null;
}
