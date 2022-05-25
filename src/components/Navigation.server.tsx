import {Link} from '@shopify/hydrogen';
import type {SanityMenuLink} from '../types';
import CollectionGroup from './CollectionGroup.server';
import StyledLink from './StyledLink.client';

type Props = {
  menuLinks: SanityMenuLink[];
};

/**
 * A server component that defines the navigation for a web storefront
 */

export default function Navigation({menuLinks}: Props) {
  const renderLinks = () => {
    return menuLinks?.map((link) => {
      if (link._type === 'collectionGroup') {
        return <CollectionGroup collectionGroup={link} key={link._key} />;
      }
      if (link._type === 'linkExternal') {
        return (
          <div className="flex items-center" key={link._key}>
            <a
              className="textLink relative z-20 mr-1 whitespace-nowrap"
              href={link.url}
              rel="noreferrer"
              target={link.newWindow ? '_blank' : '_self'}
            >
              {link.title}
            </a>
          </div>
        );
      }
      if (link._type === 'linkInternal') {
        if (!link.slug) {
          return null;
        }

        return (
          <div className="flex items-center" key={link._key}>
            <Link
              className="textLink relative z-20 mr-1 whitespace-nowrap"
              to={link.slug}
            >
              {link.title}
            </Link>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <nav className="hidden items-stretch justify-start gap-6 text-sm font-bold lg:flex">
      {renderLinks()}
    </nav>
  );
}
