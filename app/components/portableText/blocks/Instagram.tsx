import clsx from 'clsx';

import type {SanityModuleInstagram} from '~/types/sanity';

import InstagramModule from '../../modules/Instagram';

type Props = {
  value: SanityModuleInstagram;
};

export default function InstagramBlock({value}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8',
      )}
    >
      <InstagramModule module={value} />
    </div>
  );
}
