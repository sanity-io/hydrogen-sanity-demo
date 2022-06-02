// import resolveConfig from 'tailwindcss/resolveConfig';
import sanityConfig from '../../../sanity.config';
import {SanityModuleImage} from '../../types';
import ButtonLink from '../buttons/ButtonLink';
import SanityImage from '../SanityImage.client';
import ProductTag from '../ProductTag';

export default function ModuleImage({module}: {module: SanityModuleImage}) {
  const image = module.image;

  if (!image) {
    return null;
  }
  return (
    <div>
      <div className="relative overflow-hidden rounded">
        <SanityImage
          crop={image?.crop}
          dataset={sanityConfig.dataset}
          hotspot={image?.hotspot}
          layout="responsive"
          projectId={sanityConfig.projectId}
          sizes={['50vw, 100vw']}
          src={image?.asset._ref}
        />

        {/* Call to action */}
        {module.variant === 'callToAction' && (
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10">
            <div className="mt-[1em] flex flex-col items-center gap-5">
              {/* Title */}
              <div className="max-w-[30rem] text-xl text-white md:text-2xl lg:text-3xl">
                {module.callToAction?.title}
              </div>

              {/* Button */}
              {module.callToAction?.link && (
                <ButtonLink
                  className="bg-white text-offBlack"
                  link={module.callToAction.link}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {module.variant === 'caption' && module.caption && (
        <div className="mt-2 max-w-[35rem] text-sm text-darkGray">
          {module.caption}
        </div>
      )}

      {/* Products */}
      {module.variant === 'products' && (
        <div className="mt-2 inline-flex gap-1">
          {module.products.map((product) => (
            <ProductTag key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
