import {RemixServer} from '@remix-run/react';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const {SANITY_PROJECT_ID: projectId} = loadContext.env;

  /**
   * Apply a content security policy with nonce, and only apply in production
   * @see https://shopify.dev/docs/api/hydrogen/2023-10/utilities/createcontentsecuritypolicy
   */
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    imgSrc: [
      `'self'`,
      'https://cdn.shopify.com',
      'https://cdn.sanity.io',
      'https://lh3.googleusercontent.com',
    ],
    styleSrc: [
      `'self'`,
      `'unsafe-inline'`,
      'https://fonts.googleapis.com',
      'https://cdn.shopify.com',
    ],
    scriptSrc: [`'self'`, 'www.instagram.com', 'https://cdn.shopify.com'],
    fontSrc: [`'self'`, 'https://fonts.gstatic.com'],
    frameAncestors: [`'self'`],
    frameSrc: [`'self'`, 'https://www.instagram.com'],
    connectSrc: [
      `'self'`,
      'https://monorail-edge.shopifysvc.com',
      `https://${projectId}.api.sanity.io`,
      `wss://${projectId}.api.sanity.io`,
    ],
  });

  if (process.env.NODE_ENV === 'production') {
    responseHeaders.set('Content-Security-Policy', header);
  }

  const body = await renderToReadableStream(
    <NonceProvider>
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
