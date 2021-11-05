import groq from 'groq';

import {PRODUCT} from './product';
import {SEO} from './seo';

export const COLLECTION = groq`
  _id,
  description,
  products[]->{
    ${PRODUCT}
  },
  seo {
    ${SEO}
  },
  "slug": slug.current,
  title,
`;
