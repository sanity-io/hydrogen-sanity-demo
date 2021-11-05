import groq from 'groq';

import {IMAGE} from './image';

export const SEO = groq`
  description,
  image {
    ${IMAGE}
  },
  keywords,
  "title": coalesce(title, ^.title),
`;
