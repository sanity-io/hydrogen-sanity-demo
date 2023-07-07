import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import Button from '~/components/elements/Button';
import Link from '~/components/elements/Link';
import SanityImage from '~/components/media/SanityImage';
import ProductHotspot from '~/components/product/Hotspot';
import ProductTag from '~/components/product/Tag';
import type {SanityModuleImage} from '~/lib/sanity';

type Props = {
  module: SanityModuleImage;
};

export default function ImageModule({module}: Props) {
  if (!module.image) {
    return null;
  }

  return (
    <div className="relative">
      {module.variant === 'callToAction' && module.callToAction?.link ? (
        <Link className="group" link={module.callToAction.link}>
          <ImageContent module={module} />
        </Link>
      ) : (
        <ImageContent module={module} />
      )}

      {/* Caption */}
      {module.variant === 'caption' && module.caption && (
        <div className="mt-2 max-w-[35rem] text-sm leading-caption text-darkGray">
          {module.caption}
        </div>
      )}
      {/* Product hotspots */}
      {module.variant === 'productHotspots' && (
        <>
          {module.productHotspots?.map((hotspot) => {
            if (!hotspot?.product?.gid) {
              return null;
            }

            return (
              <ProductHotspot
                key={hotspot._key}
                productGid={hotspot?.product?.gid}
                variantGid={hotspot?.product?.variantGid}
                x={hotspot.x}
                y={hotspot.y}
              />
            );
          })}
        </>
      )}
      {/* Product tags */}
      {module.variant === 'productTags' && (
        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
          {module.productTags?.map((tag) => {
            if (!tag?.gid) {
              return null;
            }

            return (
              <ProductTag
                key={tag._key}
                productGid={tag?.gid}
                variantGid={tag?.variantGid}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const ImageContent = ({module}: Props) => {
  const image = module.image;
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded transition-[border-radius] duration-500 ease-out',
        'group-hover:rounded-xl',
      )}
    >
      <SanityImage
        crop={image?.crop}
        dataset={sanityDataset}
        hotspot={image?.hotspot}
        layout="responsive"
        projectId={sanityProjectID}
        sizes={['50vw, 100vw']}
        src={image?.asset?._ref}
      />

      {/* Call to action */}
      {module.variant === 'callToAction' && (
        <div
          className={clsx(
            'absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 duration-500 ease-out',
            'group-hover:bg-opacity-30',
          )}
        >
          <div className="mt-[1em] flex flex-col items-center gap-5">
            {/* Title */}
            <div
              className={clsx(
                'max-w-[30rem] text-xl text-white', //
                'lg:text-2xl',
                'xl:text-3xl',
              )}
            >
              {module.callToAction?.title}
            </div>

            {/* Button */}
            {module.callToAction?.link && (
              <Button
                className={clsx('pointer-events-none bg-white text-offBlack')}
              >
                {module.callToAction.title}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
