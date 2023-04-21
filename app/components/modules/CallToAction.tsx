import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import Link from '~/components/elements/Link';
import SanityImage from '~/components/media/SanityImage';
import ProductHero from '~/components/product/ProductHero';
import type {
  SanityAssetImage,
  SanityModuleCallToAction,
  SanityProductWithVariant,
} from '~/lib/sanity';

type Props = {
  module: SanityModuleCallToAction;
};

export default function CallToActionModule({module}: Props) {
  return (
    <div
      className={clsx(
        'flex gap-5 md:gap-[5vw]', //
        module.layout === 'left' && 'flex-col md:flex-row',
        module.layout === 'right' && 'flex-col-reverse md:flex-row-reverse',
      )}
    >
      <div className="relative aspect-[864/485] grow">
        {module.content && <ModuleContent content={module.content} />}
      </div>

      <div
        className={clsx(
          'mr-auto flex w-full shrink-0 flex-col items-start', //
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

function ModuleContent({
  content,
}: {
  content: SanityAssetImage | SanityProductWithVariant;
}) {
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;

  switch (content?._type) {
    case 'image': {
      return (
        <SanityImage
          alt={content?.altText}
          crop={content?.crop}
          dataset={sanityDataset}
          hotspot={content?.hotspot}
          layout="fill"
          objectFit="cover"
          projectId={sanityProjectID}
          sizes="100vw"
          src={content?.asset?._ref}
        />
      );
    }
    case 'productWithVariant': {
      if (!content?.gid || !content.variantGid) {
        return null;
      }

      return <ProductHero gid={content?.gid} variantGid={content.variantGid} />;
    }
    default:
      return null;
  }
}
