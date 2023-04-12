import {
  Cart,
  CartBuyerIdentityInput,
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
import {
  type ActionFunction,
  type AppLoadContext,
  redirect,
} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

export const action: ActionFunction = async ({request, context}) => {
  const {session} = context;
  const formData = await request.formData();

  // Make sure the form request is valid
  const languageCode = formData.get('language') as LanguageCode;
  invariant(languageCode, 'Missing language');

  const countryCode = formData.get('country') as CountryCode;
  invariant(countryCode, 'Missing country');

  // Determine where to redirect to relative to where user navigated from
  const path = formData.get('path') as string;
  invariant(path, 'Missing redirect path');

  const cartId = await session.get('cartId');

  // Update cart buyer's country code if there is a cart id
  if (cartId) {
    await updateCartBuyerIdentity(context, {
      cartId,
      buyerIdentity: {
        countryCode,
      },
    });
  }

  return redirect(path, 302);
};

async function updateCartBuyerIdentity(
  {storefront}: AppLoadContext,
  {
    cartId,
    buyerIdentity,
  }: {
    cartId: string;
    buyerIdentity: CartBuyerIdentityInput;
  },
) {
  const data = await storefront.mutate<{
    cartBuyerIdentityUpdate: {cart: Cart};
  }>(UPDATE_CART_BUYER_COUNTRY, {
    variables: {
      cartId,
      buyerIdentity,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  return data.cartBuyerIdentityUpdate.cart;
}

const UPDATE_CART_BUYER_COUNTRY = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $country: CountryCode = ZZ
  ) @inContext(country: $country) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
      }
    }
  }
`;
