import {Link} from '@shopify/hydrogen';
import clsx from 'clsx';
import {SanityLink} from '../../types';

export default function ButtonLink({
  invert,
  link,
}: {
  invert?: boolean;
  link: SanityLink;
}) {
  if (link._type === 'linkExternal') {
    return (
      <a
        className={clsx('btn', invert && 'btn-invert')}
        href={link.url}
        rel="noreferrer"
        target={link.newWindow ? '_blank' : '_self'}
      >
        {link.title}
      </a>
    );
  }

  if (link._type === 'linkInternal') {
    return (
      <Link className={clsx('btn', invert && 'btn-invert')} to={link.slug}>
        {link.title}
      </Link>
    );
  }

  return null;
}
