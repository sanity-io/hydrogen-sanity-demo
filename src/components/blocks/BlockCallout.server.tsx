import type {PortableTextBlock} from '@portabletext/types';
import type {SanityColorTheme, SanityModuleCallout} from '../../types';
import ModuleCallout from '../modules/ModuleCallout.server';

type Props = {
  colorTheme?: SanityColorTheme;
  node: PortableTextBlock & SanityModuleCallout;
};

export default function BlockCallout({colorTheme, node}: Props) {
  return (
    <div className="border-1 relative left-1/2 right-1/2 mr-[-50vw] ml-[-50vw] w-screen border-orange-400 px-8">
      <ModuleCallout colorTheme={colorTheme} module={node} />
    </div>
  );
}
