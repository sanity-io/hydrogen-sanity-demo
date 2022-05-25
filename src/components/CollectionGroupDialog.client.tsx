import {Dialog, Transition} from '@headlessui/react';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Fragment, useEffect, useRef, useState} from 'react';
import type {SanityCollectionGroup} from '../types';
import CollectionGroupContent from './CollectionGroupContent.client';

export default function CollectionGroupDialog({
  collectionGroup,
  products,
}: {
  collectionGroup: SanityCollectionGroup;
  products: Product[] | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const refTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleClose = () => {
    refTimeout.current = setTimeout(() => setIsOpen(false), 250);
  };
  const handleOpen = () => {
    clearTimeout(refTimeout?.current);
    setIsOpen(true);
  };
  const handleToggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    return () => clearTimeout(refTimeout?.current);
  }, []);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      {/* Title */}
      <button className="font-medium" onKeyPress={handleToggleOpen}>
        {collectionGroup.title}
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={handleClose} static>
          {/* Overlay */}
          {/*
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 bg-black bg-opacity-20"
            />
          </Transition.Child>
          */}

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-[450ms]"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in-out duration-[400ms]"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel
              className={`fixed top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col overflow-y-auto rounded-r-md bg-white md:right-auto md:bottom-auto md:block md:w-[470px]`}
            >
              <CollectionGroupContent
                collectionGroup={collectionGroup}
                onClose={handleClose}
                products={products}
              />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
