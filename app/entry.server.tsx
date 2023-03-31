import {RemixServer} from '@remix-run/react';
import type {EntryContext} from '@shopify/remix-oxygen';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

import {NonceContext} from '~/components/NonceContext';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let nonce: string | undefined;
  if (process.env.NODE_ENV === 'production') {
    /**
     * Crytographic nonce to strengthen Content Security Policy
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce
     */
    nonce = createNonce();
    responseHeaders.set(
      'Content-Security-Policy',
      `script-src 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none';`,
    );
  }

  const body = await renderToReadableStream(
    <NonceContext.Provider value={nonce}>
      <RemixServer context={remixContext} url={request.url} />
    </NonceContext.Provider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/**
 * Generates a random base64-encoded string of 128 bits of data
 * from a cryptographically secure random number generator
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce#generating_values
 */
function createNonce() {
  const nonce = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCodePoint(...nonce));
}
