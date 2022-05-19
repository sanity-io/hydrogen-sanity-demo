import groq from 'groq';

import {PRODUCT_WITH_VARIANT} from './productWithVariant';
import {SEO} from './seo';

export const COLLECTION_PAGE = groq`
  _id,
  description,
  products[] {
    ...${PRODUCT_WITH_VARIANT}
  },
  seo {
    ${SEO}
  },
  "slug": slug.current,
  title,
`;
