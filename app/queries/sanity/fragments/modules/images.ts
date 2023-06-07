import groq from 'groq';
import {z} from 'zod';

import {imageModuleSchema, MODULE_IMAGE} from './image';

export const MODULE_IMAGES = groq`
  "fullWidth": select(
    count(modules) > 1 => true,
    fullWidth,
  ),
  layout,
  modules[] {
    _key,
    ${MODULE_IMAGE}
  }
`;

export const imagesModule = z.object({
  fullWidth: z.boolean().nullish(),
  layout: z.union([z.literal('left'), z.literal('right')]),
  modules: imageModuleSchema
    .and(
      z.object({
        _key: z.string(),
      }),
    )
    .array(),
});

type ImagesModule = z.infer<typeof imagesModule>;
export type {ImagesModule as SanityImagesModule};
