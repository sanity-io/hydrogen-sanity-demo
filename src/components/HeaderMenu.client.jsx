import {ChevronDownIcon} from '@heroicons/react/outline';
import {Popover} from '@headlessui/react';
import {Link} from '@shopify/hydrogen/client';
import clsx from 'clsx';
import CurrencySelector from './CurrencySelector.client';

const renderLinks = (links, close) => {
  return links?.map((link) => {
    if (link._type === 'linkGroup') {
      return (
        <Popover className="relative" key={link._key}>
          {({close, open}) => (
            <>
              <Popover.Button
                className={clsx([
                  'flex items-center justify-center whitespace-nowrap',
                  open ? 'opacity-50' : 'opacity-100',
                ])}
              >
                <span>{link.title}</span>
                <ChevronDownIcon
                  className={`h-3 ml-1 opacity-50 w-3`}
                  aria-hidden="true"
                />
              </Popover.Button>

              <Popover.Panel className="absolute left-0 z-10 -m-px -ml-4 transform top-10">
                <div className="overflow-hidden border border-black">
                  <div className="relative grid w-56 grid-cols-1 gap-2 px-4 py-2 bg-white backdrop-filter backdrop-blur-lg bg-opacity-80">
                    {link?.links && renderLinks(link.links, close)}
                  </div>
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      );
    }
    if (link._type === 'linkExternal') {
      return (
        <a
          className="mr-1 whitespace-nowrap"
          href={link.url}
          key={link?._key}
          onClick={close}
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
          className="mr-1 whitespace-nowrap"
          key={link?._key}
          onClick={close}
          to={link.slug}
        >
          {link.title}
        </Link>
      );
    }

    return null;
  });
};

export default function HeaderMenu(props) {
  const {links} = props;

  if (!links || links.length === 0) {
    return null;
  }

  return <div className="flex gap-4">{renderLinks(links)}
  <CurrencySelector /></div>;
}
