import sanityConfig from '../../../sanity.config';
import {SanityColorTheme, SanityHeroCollection} from '../../types';
import ProductHero from '../product/ProductHero.server';
import SanityImage from '../SanityImage.client';

type Props = {
  colorTheme?: SanityColorTheme;
  fallbackTitle: string;
  hero?: SanityHeroCollection;
};

const renderModule = (hero: SanityHeroCollection) => {
  switch (hero.module?._type) {
    case 'imageWithOptions': {
      const image = hero.module.image;
      return (
        <div className="relative flex aspect-[1300/768] place-content-center overflow-hidden rounded-md bg-lightGray">
          <SanityImage
            alt={image?.altText}
            crop={image?.crop}
            dataset={sanityConfig.dataset}
            hotspot={image?.hotspot}
            layout="fill"
            objectFit="cover"
            projectId={sanityConfig.projectId}
            sizes="100vw"
            src={image?.asset._ref}
          />
        </div>
      );
    }
    case 'productWithVariant': {
      const store = hero.module.store;

      if (!store?.gid) {
        return null;
      }

      return (
        <div className="relative flex aspect-[1300/768] place-content-center overflow-hidden rounded-md bg-lightGray">
          <ProductHero gid={store.gid} />
        </div>
      );
    }
    default:
      return null;
  }
};

export default function CollectionHero({
  colorTheme,
  fallbackTitle,
  hero,
}: Props) {
  if (!hero) {
    return (
      <h1 className="mx-8 max-w-[60rem] pt-34 text-5xl font-medium">
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
          className="mx-auto mb-7 max-w-[60rem] whitespace-pre-line text-center text-5xl font-medium"
          style={{color: colorTheme?.text || 'black'}}
        >
          {hero.title}
        </h1>
      )}

      {/* Description */}
      {hero.description && (
        <div
          className="mx-auto mb-8 max-w-[40rem] whitespace-pre-line text-center text-md font-medium leading-paragraph"
          style={{color: colorTheme?.text || 'black'}}
        >
          {hero.description}
        </div>
      )}

      {/* Module */}
      <div className="mt-8">{renderModule(hero)}</div>
    </div>
  );
}
