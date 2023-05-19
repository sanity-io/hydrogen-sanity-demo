import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';

import ImageModule from '~/components/modules/Image';
import type {SanityModuleImages} from '~/lib/sanity';

type Props = {
  centered?: boolean;
  value: PortableTextBlock & SanityModuleImages;
};

export default function ImagesBlock({centered, value}: Props) {
  if (!Array.isArray(value.modules)) {
    return null;
  }

  const multipleImages = value.modules.length > 1;
  let alignClass;
  switch (value.verticalAlign) {
    case 'bottom':
      alignClass = 'items-end';
      break;
    case 'center':
      alignClass = 'items-center';
      break;
    case 'top':
      alignClass = 'items-start';
      break;
  }

  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-16',
        value.fullWidth &&
          centered &&
          'relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen px-6 md:px-8',
        value.fullWidth && !centered && '-ml-8 w-screen px-6 md:px-8',
      )}
    >
      <div
        className={clsx(
          'mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8',
          multipleImages ? 'md:grid-cols-2' : 'md:grid-cols-1',
          alignClass,
        )}
      >
        {value?.modules?.map((module) => (
          <ImageModule key={module._key} module={module} />
        ))}
      </div>
    </div>
  );
}
