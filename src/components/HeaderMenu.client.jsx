import {ChevronDownIcon} from '@heroicons/react/outline';
import {Popover} from '@headlessui/react';
import {Link} from '@shopify/hydrogen/client';

const renderLinks = (links) => {
  return links?.map((link) => {
    if (link._type === 'linkGroup') {
      return (
        <Popover className="relative" key={link._key}>
          {({open}) => (
            <>
              <Popover.Button className="flex items-center justify-center">
                <span>{link.title}</span>
                <ChevronDownIcon
                  className={`h-3 ml-1 opacity-75 w-3`}
                  aria-hidden="true"
                />
              </Popover.Button>

              <Popover.Panel className="absolute -m-px -ml-4 transform top-10 left-0 z-10">
                <div className="overflow-hidden border border-black">
                  <div className="bg-white gap-2 grid grid-cols-1 px-4 py-2 relative w-48">
                    {link?.links && renderLinks(link.links)}
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
          className="mr-1"
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
        <Link className="mr-1" key={link?._key} to={link.slug}>
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

  return <div className="flex gap-4">{renderLinks(links)}</div>;
}
