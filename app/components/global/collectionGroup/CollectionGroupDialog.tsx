import {Dialog, Transition} from '@headlessui/react';
import clsx from 'clsx';
import {Fragment, useState} from 'react';

import CollectionGroupContent from '~/components/global/collectionGroup/CollectionGroupContent';
import type {SanityCollection, SanityCollectionGroup} from '~/lib/sanity';

export default function CollectionGroupDialog({
  collection,
  collectionGroup,
}: {
  collection?: SanityCollection;
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
            '-mx-3 flex h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 py-2 pl-2 pr-3 text-sm duration-150',
            'hover:bg-opacity-10',
          )}
          onClick={handleOpen}
        >
          <svg
            className="mr-[0.15rem] w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <rect
              className="stroke-offBlack"
              x="5"
              y="14"
              width="6"
              height="6"
              strokeWidth="1.2"
            />
            <rect
              className="stroke-offBlack"
              x="14"
              y="5"
              width="6"
              height="6"
              strokeWidth="1.2"
            />
            <circle
              className="stroke-offBlack"
              cx="8"
              cy="8"
              r="3"
              strokeWidth="1.2"
            />
            <circle
              className="stroke-offBlack"
              cx="17"
              cy="17"
              r="3"
              strokeWidth="1.2"
            />
          </svg>

          <div className="inline-flex items-center font-bold">
            {collectionGroup.title}
          </div>
        </button>
      </>
      <Transition show={isOpen} unmount={false}>
        <Dialog
          open={isOpen}
          className="relative z-50"
          onClose={handleClose}
          static
        >
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 bg-black bg-opacity-20"
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
            unmount={false}
          >
            <Dialog.Panel
              className={`fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col overflow-y-auto rounded-r-lg bg-white md:bottom-auto md:right-auto md:block md:w-[490px]`}
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
