import type {PortableTextBlock} from '@portabletext/types';
import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import SanityImage from '~/components/media/SanityImage';
import PortableText from '~/components/portableText/PortableText';
import type {SanityModuleGrid} from '~/lib/sanity';

type Props = {
  value: PortableTextBlock & SanityModuleGrid;
};

export default function GridBlock({value}: Props) {
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;

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
                dataset={sanityDataset}
                hotspot={item.image?.hotspot}
                layout="fill"
                objectFit="cover"
                projectId={sanityProjectID}
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
