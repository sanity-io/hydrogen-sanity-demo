import {useEffect, useState} from 'react';
import {InstagramEmbed} from 'react-social-media-embed/dist/components/embeds/InstagramEmbed';
import type {SanityModuleInstagram} from '../../types';

export default function InstagramModule({
  module,
}: {
  module: SanityModuleInstagram;
}) {
  // TODO: We currently render `react-social-media-embed` components after initial mount to
  // prevent hydration errors for now.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto min-h-full max-w-[400px] overflow-hidden">
      {mounted && <InstagramEmbed url={module.url} />}
    </div>
  );
}
