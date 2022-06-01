import {SanityModule} from '../../types';
import ModuleImage from './ModuleImage.server';
import ModuleInstagram from './ModuleInstagram.client';

export default function Module({module}: {module: SanityModule}) {
  switch (module._type) {
    case 'module.image':
      return <ModuleImage module={module} />;
    case 'module.instagram':
      return <ModuleInstagram module={module} />;
    default:
      return null;
  }
}
