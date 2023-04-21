import CalloutModule from '~/components/modules/Callout';
import CallToActionModule from '~/components/modules/CallToAction';
import CollectionModule from '~/components/modules/Collection';
import ImageModule from '~/components/modules/Image';
import InstagramModule from '~/components/modules/Instagram';
import ProductModule from '~/components/modules/Product';
import type {SanityColorTheme, SanityModule} from '~/lib/sanity';

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
