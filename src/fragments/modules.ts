import groq from 'groq';
import {MODULE_CALLOUT} from './modules/moduleCallout';
import {MODULE_CALL_TO_ACTION} from './modules/moduleCallToAction';
import {MODULE_COLLECTION} from './modules/moduleCollection';
import {MODULE_IMAGE} from './modules/moduleImage';
import {MODULE_INSTAGRAM} from './modules/moduleInstagram';
import {MODULE_PRODUCT} from './modules/moduleProduct';

export const MODULES = groq`
  _key,
  _type,
  (_type == "module.callout") => {
    ${MODULE_CALLOUT}
  },
  (_type == 'module.callToAction') => {
    ${MODULE_CALL_TO_ACTION}
  },
  (_type == "module.collection") => {
    ${MODULE_COLLECTION}
  },      
  (_type == "module.image") => {
    ${MODULE_IMAGE}
  },
  (_type == "module.instagram") => {
    ${MODULE_INSTAGRAM}
  },      
  (_type == "module.product") => {
    ${MODULE_PRODUCT}
  },      
`;
