import {Dialog, Transition} from '@headlessui/react';
import {useServerProps} from '@shopify/hydrogen';
import {Collection} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {Fragment, useEffect, useRef, useState} from 'react';
import type {SanityCollectionGroup} from '../types';
import CollectionGroupContent from './CollectionGroupContent.client';

export default function CollectionGroupDialog({
  collection,
  collectionGroup,
}: {
  collection: Collection;
  collectionGroup: SanityCollectionGroup;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const refTimeout = useRef<ReturnType<typeof setTimeout>>();
  const {pending} = useServerProps();

  const handleClose = () => {
    clearTimeout(refTimeout?.current);
    refTimeout.current = setTimeout(() => setIsOpen(false), 250);
  };
  const handleOpen = () => {
    // Don't open if a transition is pending
    if (pending) {
      return;
    }
    clearTimeout(refTimeout?.current);
    refTimeout.current = setTimeout(() => setIsOpen(true), 250);
  };
  const handleOpenCancel = () => clearTimeout(refTimeout?.current);

  useEffect(() => {
    return () => clearTimeout(refTimeout?.current);
  }, []);

  return (
    <div className="relative flex items-center">
      {/* Title */}
      <button
        className="textLink font-bold"
        onClick={handleOpen}
        onKeyPress={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleOpenCancel}
      >
        {collectionGroup.title}
      </button>
      <Transition show={isOpen}>
        <Dialog className="relative z-50" onClose={handleClose} static>
          {/* Overlay */}
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
              className={`fixed top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col overflow-y-auto rounded-r-lg bg-white md:right-auto md:bottom-auto md:block md:w-[490px]`}
              onMouseLeave={handleClose}
            >
              <CollectionGroupContent
                collection={collection}
                collectionGroup={collectionGroup}
                onClose={handleClose}
              />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
