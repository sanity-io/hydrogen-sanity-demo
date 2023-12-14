import {
  type ActionFunctionArgs,
  type ActionFunction,
  type AppLoadContext,
  type LoaderFunctionArgs,
  redirect,
} from '@shopify/remix-oxygen';

export async function doLogout(context: AppLoadContext) {
  const {session, cart} = context;
  session.unset('customerAccessToken');

  const localeCountry = context?.storefront?.i18n?.country;

  // Remove customerAccessToken frpm existing cart
  const result = await cart.updateBuyerIdentity({
    customerAccessToken: null,
    countryCode: localeCountry,
  });

  // Update cart id in cookie
  const headers = cart.setCartId(result.cart.id);

  headers.append('Set-Cookie', await session.commit());

  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers,
  });
}

export async function loader({context}: LoaderFunctionArgs) {
  return redirect(context.storefront.i18n.pathPrefix);
}

export const action: ActionFunction = async ({context}: ActionFunctionArgs) => {
  return doLogout(context);
};
