import type {SanityColorTheme, SanityModule} from '../../types';
import CalloutModule from './Callout';
import CallToActionModule from './CallToAction';
import CollectionModule from './Collection';
import ImageModule from './Image';
import InstagramModule from './Instagram';
import ProductModule from './Product';

type Props = {
  colorTheme?: SanityColorTheme;
  imageAspectClassName?: string;
  module: SanityModule;
};

export default function Module({
  colorTheme,
  imageAspectClassName,
  module,
}: Props) {
  switch (module._type) {
    case 'module.callout':
      return <CalloutModule colorTheme={colorTheme} module={module} />;
    case 'module.callToAction':
      return <CallToActionModule module={module} />;
    case 'module.collection':
      return <CollectionModule module={module} />;
    case 'module.image':
      return <ImageModule module={module} />;
    case 'module.instagram':
      return <InstagramModule module={module} />;
    case 'module.product':
      return (
        <ProductModule
          imageAspectClassName={imageAspectClassName}
          module={module}
        />
      );
    default:
      return null;
  }
}
