import {Localizations} from '~/types/shopify';

export const countries: Localizations = {
  default: {
    language: 'EN',
    country: 'US',
    label: 'United States (USD $)',
    currency: 'USD',
  },
  '/en-au': {
    language: 'EN',
    country: 'AU',
    label: 'Australia (AUD $)',
    currency: 'AUD',
  },
  '/en-gb': {
    language: 'EN',
    country: 'GB',
    label: 'UK (GBP £)',
    currency: 'GBP',
  },
  '/en-no': {
    language: 'EN',
    country: 'NO',
    label: 'Norway (NOK kr)',
    currency: 'NOK',
  },
};
