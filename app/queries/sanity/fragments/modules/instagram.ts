import groq from 'groq';
import {z} from 'zod';

export const MODULE_INSTAGRAM = groq`
  url
`;

export const instagramModuleSchema = z.string().url();

type InstagramModule = z.infer<typeof instagramModuleSchema>;
export type {InstagramModule as SanityInstagramModule};
