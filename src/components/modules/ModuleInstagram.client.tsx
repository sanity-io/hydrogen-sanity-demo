import {InstagramEmbed} from 'react-social-media-embed';
import {SanityModuleInstagram} from '../../types';

export default function ModuleInstagram({
  module,
}: {
  module: SanityModuleInstagram;
}) {
  return (
    <div className="max-w-[400px] overflow-hidden">
      <InstagramEmbed
        placeholderDisabled //
        url={module.url}
      />
    </div>
  );
}
