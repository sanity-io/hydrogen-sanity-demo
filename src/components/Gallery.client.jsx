import React from 'react';

import sanityImageUrl from '../utils/sanityImageUrl';

const Gallery = (props) => {
  const {images} = props;

  return (
    <div className="gap-0 grid grid-cols-2 p-4">
      {images.map((image) => (
        <div key={image?._key}>
          <img alt="" src={sanityImageUrl(image, {width: 1000})} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
