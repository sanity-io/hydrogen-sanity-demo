import {useEffect, useState} from 'react';
import {InstagramEmbed} from 'react-social-media-embed/dist/components/embeds/InstagramEmbed';

import type {SanityModuleInstagram} from '~/lib/sanity';

export default function InstagramModule({
  module,
}: {
  module: SanityModuleInstagram;
}) {
  // TODO: In Hydrogen 1, we rendered `react-social-media-embed` components after initial mount to
  // prevent hydration errors for now. Check this is still needed in Hydrogen 2
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!module.url) {
    return null;
  }

  return (
    <div className="mx-auto min-h-full max-w-[400px] overflow-hidden">
      {mounted && <InstagramEmbed url={module.url} />}
    </div>
  );
}
