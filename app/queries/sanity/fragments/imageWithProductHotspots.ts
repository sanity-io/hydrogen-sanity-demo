import groq from 'groq';
import {z} from 'zod';

import {IMAGE, imageAssetSchema} from './image';
import {PRODUCT_HOTSPOT, productHotspotSchema} from './productHotspot';

export const IMAGE_WITH_PRODUCT_HOTSPOTS = groq`
  image {
    ${IMAGE}
  },
  productHotspots[] {
    _key,
    ${PRODUCT_HOTSPOT}
  }
`;

export const imageWithProductHotspotsSchema = z.object({
  image: imageAssetSchema,
  productHotspots: productHotspotSchema.array(),
});

type ImageWithProductHotspots = z.infer<typeof imageWithProductHotspotsSchema>;
export type {ImageWithProductHotspots as SanityImageWithProductHotspots};
