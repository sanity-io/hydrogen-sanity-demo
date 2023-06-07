import groq from 'groq';
import {z} from 'zod';

export const COLOR_THEME = groq`
  'background': background.hex,
  'text': text.hex,
`;

export const colorThemeSchema = z.object({
  background: z.string(),
  text: z.string(),
});

type ColorTheme = z.infer<typeof colorThemeSchema>;
export type {ColorTheme as SanityColorTheme};
