import groq from 'groq';
import {z} from 'zod';

export const CUSTOM_PRODUCT_OPTIONS = groq`
  _key,
  _type,
  title,
  (_type == 'customProductOption.color') => {
    colors[] {
      "hex": color.hex,
      title,
    },
  },
  (_type == 'customProductOption.size') => {
    sizes[] {
      height,
      title,
      width
    },
  },
`;

const customProductOptionBaseSchema = z.object({
  _key: z.string(),
  _type: z.string(),
  title: z.string(),
});

export const customProductOptionsSchema = z.discriminatedUnion('_type', [
  // Custom Product Options (Size)
  customProductOptionBaseSchema.extend({
    _type: z.literal('customProductOption.color'),
    colors: z
      .object({
        hex: z.string(),
        title: z.string(),
      })
      .array(),
  }),

  // Custom Product Options (Size)
  customProductOptionBaseSchema.extend({
    _type: z.literal('customProductOption.size'),
    sizes: z
      .object({
        width: z.number(),
        height: z.number(),
        title: z.string(),
      })
      .array(),
  }),
]);

type CustomProductOptions = z.infer<typeof customProductOptionsSchema>;
export type {CustomProductOptions as SanityCustomProductOptions};
