import React from 'react';

import sanityImageUrl from '../../utils/sanityImageUrl';

const BlockImage = (props) => {
  return (
    <div className="my-6">
      <div
        style={{
          width: 'calc(100vw - 3em)',
          position: 'relative',
        }}
      >
        <img
          alt=""
          className={props?.node?.fullWidth ? 'w-full' : 'w-1/3'}
          src={sanityImageUrl(props?.node?.image, {width: 1000})}
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
