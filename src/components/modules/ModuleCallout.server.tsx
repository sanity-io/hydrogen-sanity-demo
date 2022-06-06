import clsx from 'clsx';
import {SanityColorTheme, SanityModuleCallout} from '../../types';
import ButtonLink from '../buttons/ButtonLink';

type Props = {
  colorTheme?: SanityColorTheme;
  module: SanityModuleCallout;
};

export default function ModuleCallout({colorTheme, module}: Props) {
  return (
    <div
      className="my-16 mr-auto flex flex-col items-start"
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
          <ButtonLink backgroundColor={colorTheme?.text} link={module.link} />
        </div>
      )}
    </div>
  );
}
