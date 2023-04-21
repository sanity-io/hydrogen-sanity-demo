import {
  type ClientConfig,
  createClient,
  type SanityClient,
} from '@sanity/client';
import {CacheLong, createWithCache_unstable} from '@shopify/hydrogen';

import type {CachingStrategy, EnvironmentOptions} from '~/types/shopify';

import type {PreviewData, PreviewSession} from './preview';

type CreateSanityClientOptions = EnvironmentOptions & {
  config: ClientConfig & Required<Pick<ClientConfig, 'projectId' | 'dataset'>>;
  preview?: {
    session: PreviewSession;
    token: string;
  };
};

type useSanityQuery = {
  query: string;
  params?: Record<string, unknown>;
  cache?: CachingStrategy;
};

export type Sanity = {
  client: SanityClient;
  preview?:
    | ({session: PreviewSession} & PreviewData)
    | {session: PreviewSession};
  query<T>(options: useSanityQuery): Promise<T>;
};

/**
 * Create Sanity provider with API client.
 */
export function createSanityClient(options: CreateSanityClientOptions): Sanity {
  const {cache, waitUntil, preview, config} = options;
  const withCache = createWithCache_unstable({
    cache,
    waitUntil,
  });

  const sanity: Sanity = {
    client: createClient(config),
    query: ({query, params, cache = CacheLong()}) => {
      // Prefix the cache key and make it unique based on arguments.
      return withCache(['sanity', query, params], cache, () => {
        return sanity.client.fetch(query, params);
      });
    },
  };

  if (preview) {
    sanity.preview = {session: preview.session};

    if (preview.session.has('projectId')) {
      sanity.preview = {
        ...sanity.preview,
        projectId: config.projectId,
        dataset: config.dataset,
        token: preview.token,
      };

      sanity.client = sanity.client.withConfig({
        useCdn: false,
        token: preview.token,
      });

      sanity.query = ({query, params}) => {
        return sanity.client.fetch(query, params);
      };
    }
  }

  return sanity;
}

export function isPreviewModeEnabled(
  preview: Sanity['preview'],
): preview is {session: PreviewSession} & PreviewData {
  // @ts-expect-error
  return preview?.token != null;
}
