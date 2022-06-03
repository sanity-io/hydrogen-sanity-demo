import {SanityModuleCallToAction} from '../../types';
import Link from '../Link';
import HeroContent from '../HeroContent.server';
import clsx from 'clsx';

type Props = {
  module: SanityModuleCallToAction;
};

export default function ModuleCallToAction({module}: Props) {
  return (
    <div
      className={clsx(
        'flex gap-5 md:gap-[5vw]', //
        module.layout === 'left' && 'flex-col md:flex-row',
        module.layout === 'right' && 'flex-col-reverse md:flex-row-reverse',
      )}
    >
      <div className="aspect-[864/485] grow">
        {module.content && <HeroContent content={module.content} />}
      </div>

      <div
        className={clsx(
          'mr-auto flex shrink-0 flex-col items-start', //
          'md:max-w-[20rem]',
        )}
      >
        {/* Title */}
        <div
          className={clsx(
            'text-xl font-bold', //
            'md:text-2xl',
          )}
        >
          {module.title}
        </div>

        {/* Body */}
        {module.body && (
          <div className="mt-4 leading-paragraph">{module.body}</div>
        )}

        {/* Link */}
        {module.link && (
          <div className="mt-4">
            <Link
              className="font-bold underline hover:no-underline"
              link={module.link}
            >
              {module.link.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
