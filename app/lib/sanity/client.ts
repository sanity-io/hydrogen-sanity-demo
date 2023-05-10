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
    async query({query, params, cache = CacheLong()}) {
      // Hash query and make it unique based on parameters
      const queryHash = await hashQuery(query, params);

      return withCache(queryHash, cache, () =>
        sanity.client.fetch(query, params),
      );
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

/**
 * Create an SHA-256 hash as a hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export async function sha256(message: string) {
  // encode as UTF-8
  const messageBuffer = await new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  // convert bytes to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash query and its parameters for use as cache key
 * NOTE: Oxygen deployment will break if the cache key is long or contains `\n`
 * @todo performance improvement?
 */
function hashQuery(
  query: useSanityQuery['query'],
  params: useSanityQuery['params'],
): Promise<string> {
  let hash = query;

  if (params != null) {
    hash += JSON.stringify(params);
  }

  return sha256(hash);
}
