import clsx from 'clsx';
import type {SanityColorTheme, SanityModuleCallout} from '../../types';
import LinkButton from '../elements/LinkButton';

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
