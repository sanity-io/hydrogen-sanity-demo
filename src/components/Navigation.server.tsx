import {Link} from '@shopify/hydrogen';
import type {SanityMenuLink} from '../types';
import CollectionGroup from './CollectionGroup.server';

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
          <a
            className="relative z-20 mr-1 flex items-center whitespace-nowrap"
            href={link.url}
            key={link?._key}
            rel="noreferrer"
            target={link.newWindow ? '_blank' : '_self'}
          >
            {link.title}
          </a>
        );
      }
      if (link._type === 'linkInternal') {
        if (!link.slug) {
          return null;
        }

        return (
          <Link
            className="relative z-20 mr-1 flex items-center whitespace-nowrap"
            key={link?._key}
            to={link.slug}
          >
            {link.title}
          </Link>
        );
      }

      return null;
    });
  };

  return (
    <nav className="hidden lg:flex">
      <div className="items-stretch justify-start gap-3 font-medium md:flex">
        {renderLinks()}
      </div>
    </nav>
  );
}
