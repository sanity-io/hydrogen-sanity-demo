// @ts-expect-error incompatibility with node16 resolution
import {Dialog, Transition} from '@headlessui/react';
import {Fragment, ReactNode} from 'react';
import CloseIcon from '../icons/Close';

type Props = {
  children?: ReactNode;
  onAfterLeave?: () => void;
  onClose: () => void;
  title?: string;
  visible: boolean;
};

export default function FormDialog({
  children,
  onAfterLeave,
  onClose,
  title,
  visible,
}: Props) {
  return (
    <Transition
      afterLeave={onAfterLeave}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={visible}
      className="pointer-events-none fixed inset-0 z-40 bg-black bg-opacity-20"
    >
      <Dialog onClose={onClose}>
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="shadow-xl w-full max-w-[600px] transform overflow-hidden rounded bg-white p-6 transition-all">
                {/* Header / title */}
                <div className="mb-10 flex items-start justify-between">
                  <h3 className="text-xl font-bold">{title}</h3>

                  <button onClick={onClose} type="button">
                    <CloseIcon />
                  </button>
                </div>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
