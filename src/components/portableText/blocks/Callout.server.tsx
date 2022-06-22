// @ts-expect-error incompatibility with node16 resolution
import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import type {SanityColorTheme, SanityModuleCallout} from '../../../types';
import CalloutModule from '../../modules/Callout.server';

type Props = {
  centered?: boolean;
  colorTheme?: SanityColorTheme;
  node: PortableTextBlock & SanityModuleCallout;
};

export default function CalloutBlock({centered, colorTheme, node}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'relative my-12 w-screen px-6',
        'md:px-8',
        centered
          ? 'left-1/2 right-1/2 mr-[-50vw] ml-[-50vw]'
          : '-ml-6 md:-ml-8',
      )}
    >
      <div className={clsx(centered && 'mx-auto w-full max-w-[1400px]')}>
        <CalloutModule colorTheme={colorTheme} module={node} />
      </div>
    </div>
  );
}
