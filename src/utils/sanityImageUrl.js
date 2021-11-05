import imageUrlBuilder from '@sanity/image-url';

import {sanityClient} from '../lib/sanity';

const sanityImageUrl = (image, {width} = {width: 800}) => {
  const builder = imageUrlBuilder(sanityClient());
  const urlFor = builder.image(image);

  const src = urlFor.width(width).auto('format').quality(80).url();
  return src;
};

export default sanityImageUrl;
