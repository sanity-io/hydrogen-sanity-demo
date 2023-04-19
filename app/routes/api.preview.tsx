import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from '@shopify/remix-oxygen';

const ROOT_PATH = '/' as const;

/**
 * A `POST` request to this route will exit preview mode
 */
export const action: ActionFunction = async ({request, context}) => {
  if (request.method !== 'POST') {
    return json({message: 'Method not allowed'}, 405);
  }

  const body = await request.formData();
  let slug = (body.get('slug') as string) ?? ROOT_PATH;
  slug = slug.startsWith(ROOT_PATH) ? slug : ROOT_PATH;

  return redirect(slug, {
    headers: {
      'Set-Cookie': await context.sanity.previewSession.destroy(),
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
  const {searchParams} = new URL(request.url);

  if (!searchParams.has('secret')) {
    throw new MissingSecretError();
  }

  if (searchParams.get('secret') !== env.SANITY_PREVIEW_SECRET) {
    throw new InvalidSecretError();
  }

  let slug = searchParams.get('slug') ?? ROOT_PATH;
  slug = slug.startsWith(ROOT_PATH) ? slug : ROOT_PATH;

  sanity.previewSession.set('projectId', env.SANITY_PROJECT_ID);

  return redirect(slug, {
    status: 307,
    headers: {
      'Set-Cookie': await sanity.previewSession.commit(),
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
