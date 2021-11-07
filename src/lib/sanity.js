import client from '@sanity/client';

import sanityConfig from '../../sanity.config';

export const sanityClient = (preview) =>
  client({
    apiVersion: sanityConfig.apiVersion,
    dataset: 'production',
    projectId: sanityConfig.projectId,
    useCdn: false,
  });
