import groq from 'groq';

import {IMAGE} from './image';

export const SEO_SHOPIFY = groq`
  "seo": {
    "description": seo.description,
    "image": seo.image {
      ${IMAGE}
    },
    "title": coalesce(seo.title, store.title),
  }
`;
