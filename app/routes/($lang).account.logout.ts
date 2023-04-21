import {
  type ActionArgs,
  type ActionFunction,
  type AppLoadContext,
  type LoaderArgs,
  redirect,
} from '@shopify/remix-oxygen';

import {cartUpdateBuyerIdentity} from '~/routes/($lang).cart';

export async function doLogout(context: AppLoadContext) {
  const {session} = context;
  session.unset('customerAccessToken');
  const cartId = session.get('cartId');

  const localeCountry = context?.storefront?.i18n?.country;

  if (cartId) {
    await cartUpdateBuyerIdentity({
      cartId,
      buyerIdentity: {
        customerAccessToken: null,
        countryCode: localeCountry,
      },
      storefront: context.storefront,
    });
  }

  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

export async function loader({context}: LoaderArgs) {
  return redirect(context.storefront.i18n.pathPrefix);
}

export const action: ActionFunction = async ({context}: ActionArgs) => {
  return doLogout(context);
};
