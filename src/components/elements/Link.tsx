import {Link as HydrogenLink} from '@shopify/hydrogen';
import type {HTMLAttributes} from 'react';
import type {SanityLink} from '../../types';

type Props = {
  link: SanityLink;
} & HTMLAttributes<HTMLElement>;

export default function Link({children, link, ...rest}: Props) {
  if (link._type === 'linkExternal') {
    return (
      <a
        href={link.url}
        rel="noreferrer"
        target={link.newWindow ? '_blank' : '_self'}
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (link._type === 'linkInternal' && link.slug) {
    return (
      <HydrogenLink to={link.slug} {...rest}>
        {children}
      </HydrogenLink>
    );
  }

  return null;
}
