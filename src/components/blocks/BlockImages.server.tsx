import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityModuleImages} from '../../types';
import ModuleImage from '../modules/ModuleImage.server';

type Props = {
  node: PortableTextBlock & SanityModuleImages;
};

export default function BlockImages({node}: Props) {
  const multipleImages = node.modules.length > 1;

  return (
    <div
      className={clsx(
        'my-8 grid grid-cols-1 gap-3 border border-red',
        node.fullWidth &&
          'relative left-1/2 right-1/2 mr-[-50vw] ml-[-50vw] w-screen px-8',
        multipleImages ? 'md:grid-cols-2' : 'md:grid-cols-1',
      )}
    >
      {node?.modules?.map((module) => (
        <ModuleImage key={module._key} module={module} />
      ))}
    </div>
  );
}
