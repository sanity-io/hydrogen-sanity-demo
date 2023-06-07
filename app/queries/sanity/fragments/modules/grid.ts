import groq from 'groq';
import {z} from 'zod';

import {IMAGE, imageAssetSchema} from '../image';
import {MARK_DEFS} from '../portableText/markDefs';

export const MODULE_GRID = groq`
  items[] {
    _key,
    body[]{
      ...,
      markDefs[] {
        ${MARK_DEFS}
      }
    },
    image {
      ${IMAGE}
    },
    title
  }
`;

export const gridModuleSchema = z.object({
  items: z
    .object({
      _key: z.string(),
      // body: z.object({
      //   markDefs: mark
      // }).passthrough().array(),
      image: imageAssetSchema,
      title: z.string(),
    })
    .array(),
});

type GridModule = z.infer<typeof gridModuleSchema>;
export type {GridModule as SanityGridModule};
