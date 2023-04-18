import groq from 'groq';

import {IMAGE} from './image';
import {PRODUCT_HOTSPOT} from './productHotspot';

export const IMAGE_WITH_PRODUCT_HOTSPOTS = groq`
  image {
    ${IMAGE}
  },
  productHotspots[] {
    _key,
    ${PRODUCT_HOTSPOT}
  }
`;
