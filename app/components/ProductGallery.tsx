import type {
  MediaEdge,
  MediaImage,
} from '@shopify/hydrogen/storefront-api-types';
import {MediaFile} from '@shopify/hydrogen-react';

export default function ProductGallery({media}: {media: MediaEdge['node'][]}) {
  if (!media.length) {
    return null;
  }

  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  return (
    <div
      className={`grid w-[90vw] grid-flow-col gap-4 overflow-x-scroll  md:w-full md:grid-flow-row md:grid-cols-2 md:overflow-x-auto md:p-0 lg:col-span-2`}
    >
      {media.map((med, i) => {
        let extraProps: Record<string, any> = {};

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: 'eager',
            disableZoom: true,
            style: {height: '100%', margin: '0 auto'},
          };
        }

        const data = {
          ...med,
          __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
          image: {
            // TODO - make sure we handle all media types correctly, not just image
            // @ts-ignore
            ...med.image,
            altText: med.alt || 'Product image',
          },
        } as MediaImage;

        return (
          <div
            className={`${
              i % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'
            } card-image shadow-sm aspect-square w-[80vw] snap-center rounded bg-white md:w-full`}
            key={data.id || data?.image?.id}
          >
            <MediaFile
              className={`aspect-square h-full w-full object-cover`}
              data={data}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}
