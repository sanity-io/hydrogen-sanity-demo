import {Disclosure} from '@headlessui/react';
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityModuleAccordion} from '../../types';
import IconMinus from '../icons/IconMinus';
import IconPlus from '../icons/IconPlus';
import PortableText from '../PortableText.client';

type Props = {
  node: PortableTextBlock & SanityModuleAccordion;
};

export default function BlockAccordion({node}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8',
      )}
    >
      {node?.groups?.map((group) => (
        <Disclosure key={group._key}>
          {({open}) => (
            <div className="flex flex-col border-b border-b-gray">
              <Disclosure.Button
                className={clsx(
                  'flex items-center justify-between py-4 text-lg font-bold transition-opacity duration-200 ease-out',
                  'hover:opacity-60',
                )}
              >
                <div className="truncate">{group.title}</div>
                <div className="ml-4 shrink-0">
                  {open ? <IconMinus /> : <IconPlus />}
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
