import imageUrlBuilder from '@sanity/image-url';

const BREAKPOINTS = [640, 768, 1024, 1280, 1536]; // px

export const findLastNonNullValue = (items, currentIndex) => {
  const sliced = items.slice(0, currentIndex);
  return sliced.filter((val) => val !== null).pop();
};

const generateSrcSet = (urlBuilder, breakpoints, {quality}) => {
  return breakpoints
    .map((width) => {
      return `${urlBuilder
        .width(width)
        .auto('format')
        .quality(quality)} ${width}w`;
    })
    .join(', ');
};

// Generate srcset sizes based off breakpoints
const generateSizes = (breakpoints, sizes) => {
  if (!sizes) {
    return undefined;
  }

  if (typeof sizes === 'string') {
    return sizes;
  }

  if (sizes.length === 1 && sizes[0] !== null) {
    return sizes[0];
  }

  return sizes
    .map((val, i) => {
      if (i === sizes.length - 1) {
        return sizes[i];
      }

      let current = val;
      if (val === null) {
        current = findLastNonNullValue(sizes, i);
      }

      return `(max-width: ${breakpoints?.[i]}px) ${current}`;
    })
    .join(', ');
};

const SanityImage = (props) => {
  const {
    // blurDataURL,
    breakpoints,
    crop,
    dataset,
    height,
    hotspot,
    layout,
    loading,
    objectFit,
    options,
    placeholder,
    projectId,
    quality = 80,
    sizes,
    src,
    width,
    ...rest
  } = props;

  if (!dataset) {
    throw new Error('SanityImage is missing required "dataset" property.');
  }
  if (!projectId) {
    throw new Error('SanityImage is missing required "projectId" property.');
  }

  // Strip out blacklisted props
  delete rest?.['decoding'];
  delete rest?.['ref'];
  delete rest?.['srcSet'];
  delete rest?.['style'];

  const urlBuilder = imageUrlBuilder({projectId, dataset}).image({
    _ref: src,
    crop,
    hotspot,
  });

  // Generate srcset + sizes
  const srcSetSizes = generateSizes(BREAKPOINTS, sizes);
  const srcSet = generateSrcSet(urlBuilder, BREAKPOINTS, {quality});

  // const src = urlFor.width(width).auto('format').quality(80).url();
  let urlDefault = urlBuilder;

  // Apply props
  /*
  if (height) {
    url = url.height(options.height);
  }
  if (width) {
    url = url.width(options.width);
  }
  */

  // TODO: check for valid range
  if (options?.blur) {
    urlDefault = urlDefault.blur(options.blur);
  }
  urlDefault = urlDefault.url();

  return (
    <img
      {...rest}
      decoding="async"
      // src={blurDataURL}
      sizes={srcSetSizes}
      src={urlDefault}
      srcSet={srcSet}
      style={{
        aspectRatio: 16 / 9,
        objectFit,
        ...(layout === 'fill' && {
          bottom: 0,
          height: '100%',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          width: '100%',
        }),
        ...(layout === 'responsive' && {
          width: '100%',
        }),
      }}
    />
  );
};

export default SanityImage;
