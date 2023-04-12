import groq from 'groq';

import {IMAGE_WITH_PRODUCT_HOTSPOTS} from '../imageWithProductHotspots';
import {PRODUCT_WITH_VARIANT} from '../productWithVariant';

export const HERO_PAGE = groq`
  content[0] {
    _type,
    (_type == 'imageWithProductHotspots') => {
      ${IMAGE_WITH_PRODUCT_HOTSPOTS}
    },
    (_type == 'productWithVariant') => {
      ...${PRODUCT_WITH_VARIANT}
    },
  },
  title
`;
