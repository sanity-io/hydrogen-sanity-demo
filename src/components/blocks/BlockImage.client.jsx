import clsx from 'clsx';
import React from 'react';
import sanityConfig from '../../../sanity.config';
import SanityImage from '../SanityImage.client';

const BlockImage = (props) => {
  const {fullWidth, image} = props?.node;
  return (
    <div className="my-6">
      <div
        className={clsx([
          fullWidth ? 'ml-0 md:-ml-4' : 'md:ml-0',
          fullWidth ? 'w-full md:w-screen' : 'w-full',
        ])}
      >
        <SanityImage
          alt={image?.altText}
          crop={image?.crop}
          dataset={sanityConfig.dataset}
          height={image?.height}
          hotspot={image?.hotspot}
          layout="responsive"
          projectId={sanityConfig.projectId}
          sizes={['50vw']}
          src={image?.asset._ref}
          width={image?.width}
        />
      </div>
      {/* Caption */}
      {props?.node?.caption && (
        <div className="text-gray-400 text-sm mt-2">{props?.node?.caption}</div>
      )}
    </div>
  );
};

export default BlockImage;
