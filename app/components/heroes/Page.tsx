import clsx from 'clsx';

import HeroContent from '~/components/heroes/HeroContent';
import type {SanityHeroPage} from '~/lib/sanity';
import {useColorTheme} from '~/lib/theme';

type Props = {
  fallbackTitle: string;
  hero?: SanityHeroPage;
};

export default function PageHero({fallbackTitle, hero}: Props) {
  const colorTheme = useColorTheme();

  if (!hero) {
    return (
      <h1
        className={clsx(
          'mx-auto max-w-[60rem] px-4 pb-8 pt-34 text-center text-3xl',
          'md:px-8 md:text-4xl',
        )}
      >
        {fallbackTitle}
      </h1>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-b-xl bg-peach px-4 pb-4 pt-24', //
        'md:px-8 md:pb-8 md:pt-34',
      )}
      style={{background: colorTheme?.background}}
    >
      {/* Title */}
      {hero.title && (
        <h1
          className={clsx(
            'max-w-[60rem] whitespace-pre-line text-2xl',
            'md:text-4xl',
          )}
          style={{color: colorTheme?.text || 'black'}}
        >
          {hero.title}
        </h1>
      )}

      {/* Hero content */}
      {hero.content && (
        <div className="mt-8">
          <HeroContent content={hero.content} />
        </div>
      )}
    </div>
  );
}
