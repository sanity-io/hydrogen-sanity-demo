import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import sanityConfig from '../../sanity.config';

const sanityImageUrl = (image, {width} = {width: 800}) => {
  const builder = imageUrlBuilder(sanityClient(sanityConfig));
  const urlFor = builder.image(image);

  const src = urlFor.width(width).auto('format').quality(80).url();
  return src;
};

export default sanityImageUrl;
