import {SanityColorTheme, SanityModule} from '../../types';
import ModuleCallout from './ModuleCallout.server';
import ModuleCollection from './ModuleCollection.server';
import ModuleImage from './ModuleImage.server';
import ModuleInstagram from './ModuleInstagram.client';

export default function Module({
  colorTheme,
  module,
}: {
  colorTheme?: SanityColorTheme;
  module: SanityModule;
}) {
  switch (module._type) {
    case 'module.callout':
      return <ModuleCallout colorTheme={colorTheme} module={module} />;
    case 'module.collection':
      return <ModuleCollection module={module} />;
    case 'module.image':
      return <ModuleImage module={module} />;
    case 'module.instagram':
      return <ModuleInstagram module={module} />;
    case 'module.product':
      return <div>module product</div>;
    default:
      return null;
  }
}
