import sanityConfig from '../../sanity.config';
import {SanityColorTheme, SanityPageHero} from '../types';
import ProductHero from './ProductHero.server';
import SanityImage from './SanityImage.client';

type Props = {
  colorTheme?: SanityColorTheme;
  fallbackTitle: string;
  hero?: SanityPageHero;
};

const renderModule = (hero: SanityPageHero) => {
  switch (hero.module?._type) {
    case 'imageWithOptions': {
      const image = hero.module.image;
      return (
        <div className="relative mt-14 flex aspect-[1300/768] place-content-center overflow-hidden rounded-md bg-lightGray">
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
        <div className="relative mt-14 flex aspect-[1300/768] place-content-center overflow-hidden rounded-md bg-lightGray">
          <ProductHero gid={store.gid} />
        </div>
      );
    }
    default:
      return null;
  }
};

export default function PageHero({colorTheme, fallbackTitle, hero}: Props) {
  if (!hero) {
    return (
      <h1 className="mx-auto max-w-[60rem] pb-8 pt-34 text-center text-4xl font-medium">
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
          className="max-w-[60rem] whitespace-pre-line text-4xl font-medium"
          style={{color: colorTheme?.text || 'black'}}
        >
          {hero.title}
        </h1>
      )}

      {/* Module */}
      {renderModule(hero)}
    </div>
  );
}
