import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';

import CalloutModule from '~/components/modules/Callout';
import type {SanityColorTheme, SanityModuleCallout} from '~/lib/sanity';

type Props = {
  centered?: boolean;
  colorTheme?: SanityColorTheme;
  value: PortableTextBlock & SanityModuleCallout;
};

export default function CalloutBlock({centered, colorTheme, value}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'relative my-12 w-screen px-6',
        'md:px-8',
        centered
          ? 'left-1/2 right-1/2 ml-[-50vw] mr-[-50vw]'
          : '-ml-6 md:-ml-8',
      )}
    >
      <div className={clsx(centered && 'mx-auto w-full max-w-[1400px]')}>
        <CalloutModule colorTheme={colorTheme} module={value} />
      </div>
    </div>
  );
}
