// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityModuleImages} from '../../../types';
import ImageModule from '../../modules/Image.server';

type Props = {
  centered?: boolean;
  node: PortableTextBlock & SanityModuleImages;
};

export default function ImagesBlock({centered, node}: Props) {
  const multipleImages = node.modules.length > 1;
  let alignClass;
  switch (node.verticalAlign) {
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
        node.fullWidth &&
          centered &&
          'relative left-1/2 right-1/2 mr-[-50vw] ml-[-50vw] w-screen px-6 md:px-8',
        node.fullWidth && !centered && '-ml-8 w-screen px-6 md:px-8',
      )}
    >
      <div
        className={clsx(
          'mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8',
          multipleImages ? 'md:grid-cols-2' : 'md:grid-cols-1',
          alignClass,
        )}
      >
        {node?.modules?.map((module) => (
          <ImageModule key={module._key} module={module} />
        ))}
      </div>
    </div>
  );
}
