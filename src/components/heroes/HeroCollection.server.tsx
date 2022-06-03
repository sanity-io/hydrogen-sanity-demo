import clsx from 'clsx';
import {SanityColorTheme, SanityHeroCollection} from '../../types';
import HeroContent from '../HeroContent.server';

type Props = {
  colorTheme?: SanityColorTheme;
  fallbackTitle: string;
  hero?: SanityHeroCollection;
};

export default function HeroCollection({
  colorTheme,
  fallbackTitle,
  hero,
}: Props) {
  if (!hero) {
    return (
      <h1
        className={clsx(
          'mx-8 max-w-[60rem] pt-34 text-3xl', //
          'md:text-5xl',
        )}
      >
        {fallbackTitle}
      </h1>
    );
  }

  return (
    <div
      className="rounded-b-xl px-8 pb-8 pt-34"
      style={{background: colorTheme?.background || 'white'}}
    >
      {/* Title */}
      {hero.title && (
        <h1
          className={clsx(
            'mx-auto mb-7 max-w-[60rem] whitespace-pre-line text-center text-3xl',
            'md:text-5xl',
          )}
          style={{color: colorTheme?.text || 'black'}}
        >
          {hero.title}
        </h1>
      )}

      {/* Description */}
      {hero.description && (
        <div
          className="mx-auto mb-8 max-w-[40rem] whitespace-pre-line text-center text-md leading-paragraph"
          style={{color: colorTheme?.text || 'black'}}
        >
          {hero.description}
        </div>
      )}

      {/* Hero content */}
      {hero.content && (
        <div className="mt-12">
          <HeroContent content={hero.content} />
        </div>
      )}
    </div>
  );
}
