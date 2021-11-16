import groq from 'groq';

import {IMAGE} from './image';
import {PORTABLE_TEXT} from './portableText';
import {SEO_PRODUCT} from './seoProduct';

export const PRODUCT_PAGE = groq`
  _id,
  "available": !store.isDeleted && store.status == 'active',
  body[]{
    ${PORTABLE_TEXT}
  },
  images[] {
    ${IMAGE}
  },
  sections[]{
    _key,
    body[]{
      ${PORTABLE_TEXT}
    },
    title
  },
  seo {
    ${SEO_PRODUCT}
  },
  store,
  "slug": store.slug.current,
`;
