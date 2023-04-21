import clsx from 'clsx';

import LinkButton from '~/components/elements/LinkButton';
import type {SanityColorTheme, SanityModuleCallout} from '~/lib/sanity';

type Props = {
  colorTheme?: SanityColorTheme;
  module: SanityModuleCallout;
};

export default function CalloutModule({colorTheme, module}: Props) {
  return (
    <div
      className="mr-auto flex flex-col items-start"
      style={{color: colorTheme?.text}}
    >
      {/* Text */}
      <div
        className={clsx(
          'max-w-[60rem] text-2xl', //
          'md:text-4xl',
        )}
      >
        {module.text}
      </div>

      {/* Link */}
      {module.link && (
        <div className="mt-4">
          <LinkButton backgroundColor={colorTheme?.text} link={module.link} />
        </div>
      )}
    </div>
  );
}
