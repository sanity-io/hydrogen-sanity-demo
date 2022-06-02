import {SanityHeroHome} from '../../types';
import ButtonLink from '../buttons/ButtonLink';
import HeroContent from '../HeroContent.server';

type Props = {
  hero: SanityHeroHome;
};

export default function HeroHome({hero}: Props) {
  return (
    <div className="flex flex-col items-center rounded-b-xl bg-peach px-8 pb-8 pt-34">
      {/* Title */}
      {hero.title && (
        <h1 className="mb-7 max-w-[60rem] whitespace-pre-line text-center text-5xl">
          {hero.title}
        </h1>
      )}

      {/* Link */}
      {hero.link && <ButtonLink link={hero.link} />}

      {/* Hero content */}
      {hero.content && (
        <div className="mt-12 w-full">
          <HeroContent content={hero.content} />
        </div>
      )}
    </div>
  );
}
