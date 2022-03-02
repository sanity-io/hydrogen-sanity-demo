import sanityImageUrl from './sanityImageUrl';

const sanityImageSeo = (image) => {
  if (!image) {
    return null;
  }

  return {
    altText: image.altText,
    height: image.height,
    url: sanityImageUrl(image),
    width: image.width,
  };
};

export default sanityImageSeo;
