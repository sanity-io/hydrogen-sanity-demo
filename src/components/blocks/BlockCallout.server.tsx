import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityColorTheme, SanityModuleCallout} from '../../types';
import ModuleCallout from '../modules/ModuleCallout.server';

type Props = {
  centered?: boolean;
  colorTheme?: SanityColorTheme;
  node: PortableTextBlock & SanityModuleCallout;
};

export default function BlockCallout({centered, colorTheme, node}: Props) {
  return (
    <div
      className={clsx(
        'relative w-screen px-8',
        centered ? 'left-1/2 right-1/2 mr-[-50vw] ml-[-50vw]' : '-ml-8',
      )}
    >
      <ModuleCallout colorTheme={colorTheme} module={node} />
    </div>
  );
}
