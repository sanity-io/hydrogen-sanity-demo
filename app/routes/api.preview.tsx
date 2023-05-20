import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from '@shopify/remix-oxygen';

import {isLocalPath} from '~/lib/utils';
import {notFound} from '~/lib/utils';

const ROOT_PATH = '/' as const;

/**
 * A `POST` request to this route will exit preview mode
 */
export const action: ActionFunction = async ({request, context}) => {
  const {preview} = context.sanity;

  if (!(request.method === 'POST' && preview?.session)) {
    return json({message: 'Method not allowed'}, 405);
  }

  const body = await request.formData();
  const slug = (body.get('slug') as string) ?? ROOT_PATH;
  const redirectTo = isLocalPath(request, slug) ? slug : ROOT_PATH;

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await preview.session.destroy(),
    },
  });
};

// TODO: more user-friendly errors?
// export default <></>;

/**
 * A `GET` request to this route will enter preview mode
 */
export const loader: LoaderFunction = async function ({request, context}) {
  const {env, sanity} = context;

  if (!sanity.preview?.session) {
    return notFound();
  }

  const {searchParams} = new URL(request.url);

  if (!searchParams.has('secret')) {
    throw new MissingSecretError();
  }

  if (searchParams.get('secret') !== env.SANITY_PREVIEW_SECRET) {
    throw new InvalidSecretError();
  }

  const slug = searchParams.get('slug') ?? ROOT_PATH;
  const redirectTo = isLocalPath(request, slug) ? slug : ROOT_PATH;

  sanity.preview.session.set('projectId', env.SANITY_PROJECT_ID);

  return redirect(redirectTo, {
    status: 307,
    headers: {
      'Set-Cookie': await sanity.preview.session.commit(),
    },
  });
};

class MissingSecretError extends Response {
  constructor() {
    super('Missing secret', {status: 401, statusText: 'Unauthorized'});
  }
}

class InvalidSecretError extends Response {
  constructor() {
    super('Invalid secret', {status: 401, statusText: 'Unauthorized'});
  }
}
