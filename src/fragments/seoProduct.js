import groq from 'groq';

import {IMAGE} from './image';

export const SEO_PRODUCT = groq`
  description,
  image {
    ${IMAGE}
  },
  keywords,
  "title": coalesce(title, ^.store.title),
`;
