import {Dialog, Transition} from '@headlessui/react';
import clsx from 'clsx';
import {Fragment, useState} from 'react';

import {CountrySelector} from '~/components/global/CountrySelector';
import CloseIcon from '~/components/icons/Close';
import MenuIcon from '~/components/icons/Menu';
import {Link} from '~/components/Link';
import type {SanityMenuLink} from '~/lib/sanity';

type Props = {
  menuLinks: SanityMenuLink[];
};

export default function MobileNavigation({menuLinks}: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <button
        className={clsx(
          'absolute left-0 flex h-header-sm items-center p-4 text-sm font-bold duration-200',
          'hover:opacity-50',
          'md:ml-4',
          'lg:hidden',
        )}
        onClick={handleOpen}
      >
        <MenuIcon />
      </button>

      <Transition show={open}>
        <Dialog onClose={handleClose}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-40 bg-black bg-opacity-20"
            />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in-out duration-500"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 z-50 h-full w-full overflow-y-auto bg-white pb-40">
              {/* Header */}
              <header className="flex h-header-sm items-center justify-start px-4">
                <button
                  className="-ml-4 h-header-sm p-4"
                  type="button"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </button>
              </header>

              {/* Links */}
              <div className="mt-6 space-y-4 px-4">
                <div className="space-y-1 text-2xl font-bold">
                  <Link
                    className="linkTextNavigation"
                    onClick={handleClose}
                    to="/"
                  >
                    Home
                  </Link>

                  {menuLinks?.map((link) => {
                    if (link._type === 'collectionGroup') {
                      return (
                        <div key={link._key}>
                          <div className="linkTextNavigation hover:border-b-transparent">
                            {link.title} –
                          </div>
                          <div className="my-1 ml-8 space-y-1">
                            {link.collectionLinks?.map((collectionLink) => {
                              if (!collectionLink.slug) {
                                return null;
                              }
                              return (
                                <div key={collectionLink._id}>
                                  <Link
                                    className="linkTextNavigation relative inline-flex whitespace-nowrap"
                                    onClick={handleClose}
                                    to={collectionLink.slug}
                                  >
                                    {collectionLink.title}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    if (link._type === 'linkExternal') {
                      return (
                        <div className="flex items-center" key={link._key}>
                          <a
                            className="linkTextNavigation relative whitespace-nowrap"
                            href={link.url}
                            onClick={handleClose}
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
                            className="linkTextNavigation relative whitespace-nowrap"
                            onClick={handleClose}
                            to={link.slug}
                          >
                            {link.title}
                          </Link>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>

                <div className="space-y-1">
                  {/* Account */}
                  <Link
                    className={clsx(
                      '-ml-2 inline-flex h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 px-3 py-2 text-sm font-bold duration-150',
                      'hover:bg-opacity-10',
                    )}
                    onClick={handleClose}
                    to="/account"
                  >
                    <span className="mr-2">Account</span>
                  </Link>
                  <div className="-ml-2">
                    <CountrySelector align="left" />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
