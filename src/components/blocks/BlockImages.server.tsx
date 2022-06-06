import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityModuleImages} from '../../types';
import ModuleImage from '../modules/ModuleImage.server';

type Props = {
  node: PortableTextBlock & SanityModuleImages;
};

export default function BlockImages({node}: Props) {
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
        'my-8 grid grid-cols-1 gap-3',
        node.fullWidth &&
          'relative left-1/2 right-1/2 mr-[-50vw] ml-[-50vw] w-screen px-8',
        multipleImages ? 'md:grid-cols-2' : 'md:grid-cols-1',
        alignClass,
      )}
    >
      {node?.modules?.map((module) => (
        <ModuleImage key={module._key} module={module} />
      ))}
    </div>
  );
}
