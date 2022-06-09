import {Dialog, Transition} from '@headlessui/react';
import {Collection} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import {Fragment, useState} from 'react';
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

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <div className="relative flex items-center">
      {/* Title */}
      <>
        <button
          className={clsx(
            'flex h-[2.4rem] items-center rounded-sm bg-offBlack bg-opacity-0 p-2 text-sm duration-150',
            'hover:bg-opacity-5',
          )}
          onClick={handleOpen}
        >
          <svg
            className="mb-[0.1rem] mr-[0.25rem] w-5"
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="auto"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <rect width="256" height="256" fill="none" />
            <line
              x1="88"
              y1="48"
              x2="88"
              y2="208"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
            <rect
              x="32"
              y="48"
              width="192"
              height="160"
              rx="8"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
          </svg>
          <div className="inline-flex items-center font-bold">
            {collectionGroup.title}
          </div>
        </button>
      </>
      <Transition show={isOpen}>
        <Dialog
          open={isOpen}
          className="relative z-50"
          onClose={handleClose}
          static
        >
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
