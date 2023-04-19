import {RemixServer} from '@remix-run/react';
import type {EntryContext} from '@shopify/remix-oxygen';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

import {generateNonce, NonceProvider} from '~/lib/nonce';

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
    nonce = generateNonce();

    /**
     * Currently, we're not setting the CSP headers due to lack of support on deferred scripts.
     * @see https://github.com/remix-run/remix/issues/5156
     *
    responseHeaders.set(
      'Content-Security-Policy',
      `script-src 'nonce-${nonce}' 'strict-dynamic' cdn.shopify.com; object-src 'none'; base-uri 'none';`,
    );
     */
  }

  const body = await renderToReadableStream(
    <NonceProvider value={nonce}>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
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
