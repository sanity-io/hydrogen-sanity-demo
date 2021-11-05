import groq from 'groq';

export const IMAGE = groq`
  ...,
  "altText": asset->altText,
  caption,
  'dimensions': asset->metadata.dimensions,
  'mimeType': asset->mimeType,
`;
