import React from 'react';

import sanityConfig from '../../../sanity.config';
import SanityImage from '../SanityImage.client';

const BlockImage = (props) => {
  const {fullWidth, image} = props?.node;
  return (
    <div className="my-6">
      <div
        style={{
          width: 'calc(100vw - 3em)',
          position: 'relative',
        }}
      >
        <div className={fullWidth ? 'w-full' : 'md:w-1/3 w-full'}>
          <SanityImage
            alt={image?.altText}
            crop={image?.crop}
            dataset={sanityConfig.dataset}
            hotspot={image?.hotspot}
            layout="responsive"
            projectId={sanityConfig.projectId}
            sizes={['50vw']}
            src={image?.asset._ref}
          />
        </div>
      </div>
      {/* Caption */}
      {props?.node?.caption && (
        <div className="text-gray-400 text-sm mt-2">{props?.node?.caption}</div>
      )}
    </div>
  );
};

export default BlockImage;
