import clsx from 'clsx';

import InstagramModule from '~/components/modules/Instagram';
import type {SanityModuleInstagram} from '~/lib/sanity';

type Props = {
  value: SanityModuleInstagram;
};

export default function InstagramBlock({value}: Props) {
  if (!value) {
    return null;
  }

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
