import {Disclosure} from '@headlessui/react';
import {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';

import MinusIcon from '~/components/icons/Minus';
import PlusIcon from '~/components/icons/Plus';
import PortableText from '~/components/portableText/PortableText';
import type {SanityModuleAccordion} from '~/lib/sanity';

type Props = {
  value: PortableTextBlock & SanityModuleAccordion;
};

export default function AccordionBlock({value}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8',
      )}
    >
      {value?.groups?.map((group) => (
        <Disclosure key={group._key}>
          {({open}: {open: boolean}) => (
            <div className="flex flex-col border-b border-b-gray">
              <Disclosure.Button
                className={clsx(
                  'flex items-center justify-between py-4 text-lg font-bold transition-opacity duration-200 ease-out',
                  'hover:opacity-60',
                )}
              >
                <div className="truncate">{group.title}</div>
                <div className="ml-4 shrink-0">
                  {open ? <MinusIcon /> : <PlusIcon />}
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className="pb-4 text-md">
                <PortableText blocks={group.body} />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
