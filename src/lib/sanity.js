import client from '@sanity/client';

import sanityConfig from '../../sanity.config';

// TODO: move into env vars
export const sanityClient = (preview) =>
  client({
    apiVersion: sanityConfig.apiVersion,
    dataset: 'production',
    projectId: sanityConfig.projectId,
    useCdn: false,
  });
