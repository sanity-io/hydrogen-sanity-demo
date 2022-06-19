import {InstagramEmbed} from 'react-social-media-embed';
import type {SanityModuleInstagram} from '../../types';

export default function InstagramModule({
  module,
}: {
  module: SanityModuleInstagram;
}) {
  return (
    <div className="mx-auto min-h-full max-w-[400px] overflow-hidden">
      <InstagramEmbed
        placeholderDisabled //
        url={module.url}
      />
    </div>
  );
}
