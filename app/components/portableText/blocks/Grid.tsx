import type {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';

import SanityImage from '~/components/media/SanityImage';
import type {SanityModuleGrid} from '~/types/sanity';

// TODO: get this config from Remix context...
// import sanityConfig from '../../../../sanity.config';
import PortableText from '../PortableText';

type Props = {
  value: PortableTextBlock & SanityModuleGrid;
};

export default function GridBlock({value}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'my-8 grid grid-cols-1 gap-x-3',
        'md:grid-cols-2',
      )}
    >
      {value?.items?.map((item) => (
        <div
          className="flex items-start gap-3 border-t border-t-gray py-3"
          key={item._key}
        >
          <div className="relative flex aspect-square w-[5rem] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-lightGray">
            {item.image && (
              <SanityImage
                alt={item.image?.altText}
                crop={item.image?.crop}
                dataset={sanityConfig.dataset}
                hotspot={item.image?.hotspot}
                layout="fill"
                objectFit="cover"
                projectId={sanityConfig.projectId}
                sizes="25vw"
                src={item.image?.asset?._ref}
              />
            )}
          </div>
          <div className="space-y-1">
            <div className="text-md font-bold">{item.title}</div>
            <PortableText className="text-sm" blocks={item.body} />
          </div>
        </div>
      ))}
    </div>
  );
}
