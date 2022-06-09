import groq from 'groq';
import {MODULE_IMAGE} from './moduleImage';

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
