import groq from 'groq';

/*
export const IMAGE = groq`
  ...,
  "altText": asset->altText,
  caption,
  'dimensions': asset->metadata.dimensions,
  'mimeType': asset->mimeType,
`;
*/

export const IMAGE = groq`
  ...,
  "altText": asset->altText,
  "blurDataURL": asset->metadata.lqip,
  'height': asset->metadata.dimensions.height,
  'width': asset->metadata.dimensions.width,
`;
