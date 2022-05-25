import {Dialog} from '@headlessui/react';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import {useState} from 'react';
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

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleToggleOpen = () => setIsOpen(!isOpen);

  return (
    <div
      className="flex items-center"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      {/* Title */}
      <button className="font-medium" onKeyPress={handleToggleOpen}>
        {collectionGroup.title}
      </button>

      <Dialog open={isOpen} onClose={handleClose} static>
        {/* Overlay */}
        {isOpen && (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 bg-black opacity-10"
          />
        )}

        {isOpen && (
          <Dialog.Panel
            className={`fixed top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col overflow-y-auto rounded-r-md bg-white md:right-auto md:bottom-auto md:block md:w-[470px]`}
          >
            <CollectionGroupContent
              collectionGroup={collectionGroup}
              onClose={handleClose}
              products={products}
            />
          </Dialog.Panel>
        )}
      </Dialog>
    </div>
  );
}
