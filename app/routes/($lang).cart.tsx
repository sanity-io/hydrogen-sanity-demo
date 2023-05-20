import {Await, useMatches} from '@remix-run/react';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import type {
  Cart as CartType,
  CartBuyerIdentityInput,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CartUserError,
  UserError,
} from '@shopify/hydrogen/storefront-api-types';
import {ActionArgs, type AppLoadContext, json} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import {CartActions, CartLineItems, CartSummary} from '~/components/cart/Cart';
import SpinnerIcon from '~/components/icons/Spinner';
import {isLocalPath} from '~/lib/utils';
import {CartAction, type CartActions as CartActionsType} from '~/types/shopify';

const seo: SeoHandleFunction = () => ({
  title: 'Cart',
  noIndex: true,
});

export const handle = {
  seo,
};

export async function action({request, context}: ActionArgs) {
  const {session, storefront} = context;
  const headers = new Headers();

  const [formData, storedCartId, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('cartId'),
    session.get('customerAccessToken'),
  ]);

  let cartId = storedCartId;

  const cartAction = formData.get('cartAction') as CartActionsType;
  invariant(cartAction, 'No cartAction defined');

  const countryCode = formData.get('countryCode')
    ? (formData.get('countryCode') as CartBuyerIdentityInput['countryCode'])
    : null;

  let status = 200;
  let result: {
    cart: CartType;
    errors?: CartUserError[] | UserError[];
  };

  switch (cartAction) {
    case CartAction.ADD_TO_CART: {
      const lines = formData.get('lines')
        ? (JSON.parse(String(formData.get('lines'))) as CartLineInput[])
        : ([] as CartLineInput[]);
      invariant(lines.length, 'No lines to add');

      if (!cartId) {
        result = await cartCreate({
          input: countryCode ? {lines, buyerIdentity: {countryCode}} : {lines},
          storefront,
        });
      } else {
        result = await cartAdd({
          cartId,
          lines,
          storefront,
        });
      }

      cartId = result.cart.id;
      break;
    }
    case CartAction.REMOVE_FROM_CART: {
      const lineIds = formData.get('linesIds')
        ? (JSON.parse(String(formData.get('linesIds'))) as CartType['id'][])
        : ([] as CartType['id'][]);
      invariant(lineIds.length, 'No lines to remove');

      result = await cartRemove({
        cartId,
        lineIds,
        storefront,
      });

      cartId = result.cart.id;
      break;
    }
    case CartAction.UPDATE_CART: {
      const updateLines = formData.get('lines')
        ? (JSON.parse(String(formData.get('lines'))) as CartLineUpdateInput[])
        : ([] as CartLineUpdateInput[]);
      invariant(updateLines.length, 'No lines to update');

      result = await cartUpdate({
        cartId,
        lines: updateLines,
        storefront,
      });

      cartId = result.cart.id;

      break;
    }
    case CartAction.UPDATE_BUYER_IDENTITY: {
      const buyerIdentity = formData.get('buyerIdentity')
        ? (JSON.parse(
            String(formData.get('buyerIdentity')),
          ) as CartBuyerIdentityInput)
        : ({} as CartBuyerIdentityInput);

      result = cartId
        ? await cartUpdateBuyerIdentity({
            cartId,
            buyerIdentity: {
              ...buyerIdentity,
              customerAccessToken: customerAccessToken
                ? customerAccessToken
                : null,
            },
            storefront,
          })
        : await cartCreate({
            input: {
              buyerIdentity: {
                ...buyerIdentity,
                customerAccessToken: customerAccessToken
                  ? customerAccessToken
                  : null,
              },
            },
            storefront,
          });

      cartId = result.cart.id;

      break;
    }
    // TODO: handle discount code updates
    default:
      invariant(false, `${cartAction} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  session.set('cartId', cartId);
  headers.set('Set-Cookie', await session.commit());

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(request, redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart, errors} = result;
  return json(
    {
      cart,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const [root] = useMatches();

  return (
    <section
      className={clsx(
        'rounded-b-xl px-4 pb-4 pt-24', //
        'md:px-8 md:pb-8 md:pt-34',
      )}
    >
      <Suspense
        fallback={
          <div className="flex justify-center overflow-hidden">
            <SpinnerIcon />
          </div>
        }
      >
        <Await resolve={root.data?.cart}>
          {(cart) => (
            <>
              <div className="mx-auto grid w-full max-w-6xl gap-8 pb-12 md:grid-cols-2 md:items-start md:gap-8 lg:gap-12">
                <div className="flex-grow md:translate-y-4">
                  <CartLineItems linesObj={cart.lines} />
                </div>
                <div className="fixed bottom-0 left-0 right-0 grid w-full gap-6 p-4 md:sticky md:top-[65px] md:translate-y-4 md:px-6">
                  <CartSummary cost={cart.cost} />
                  <CartActions cart={cart} />
                </div>
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

/**
 * Create a cart with line(s) mutation
 * @param input CartInput https://shopify.dev/api/storefront/{api_version}/input-objects/CartInput
 * @see https://shopify.dev/api/storefront/{api_version}/mutations/cartcreate
 * @returns result {cart, errors}
 * @preserve
 */
export async function cartCreate({
  input,
  storefront,
}: {
  input: CartInput;
  storefront: AppLoadContext['storefront'];
}) {
  const {cartCreate} = await storefront.mutate<{
    cartCreate: {
      cart: CartType;
      errors: CartUserError[];
    };
    errors: UserError[];
  }>(CREATE_CART_MUTATION, {
    variables: {input},
  });

  invariant(cartCreate, 'No data returned from cartCreate mutation');

  return cartCreate;
}

/**
 * Storefront API cartLinesAdd mutation
 * @param cartId
 * @param lines [CartLineInput!]! https://shopify.dev/api/storefront/{api_version}/input-objects/CartLineInput
 * @see https://shopify.dev/api/storefront/{api_version}/mutations/cartLinesAdd
 * @returns result {cart, errors}
 * @preserve
 */
export async function cartAdd({
  cartId,
  lines,
  storefront,
}: {
  cartId: string;
  lines: CartLineInput[];
  storefront: AppLoadContext['storefront'];
}) {
  const {cartLinesAdd} = await storefront.mutate<{
    cartLinesAdd: {
      cart: CartType;
      errors: CartUserError[];
    };
  }>(ADD_LINES_MUTATION, {
    variables: {cartId, lines},
  });
  invariant(cartLinesAdd, 'No data returned from cartLinesAdd mutation');

  return cartLinesAdd;
}

/**
 * Create a cart with line(s) mutation
 * @param cartId the current cart id
 * @param lineIds [ID!]! an array of cart line ids to remove
 * @see https://shopify.dev/api/storefront/2022-07/mutations/cartlinesremove
 * @returns mutated cart
 * @preserve
 */
export async function cartRemove({
  cartId,
  lineIds,
  storefront,
}: {
  cartId: string;
  lineIds: CartType['id'][];
  storefront: AppLoadContext['storefront'];
}) {
  const {cartLinesRemove} = await storefront.mutate<{
    cartLinesRemove: {cart: CartType; errors: UserError[]};
  }>(REMOVE_LINE_ITEMS_MUTATION, {
    variables: {
      cartId,
      lineIds,
    },
  });

  invariant(cartLinesRemove, 'No data returned from remove lines mutation');
  return cartLinesRemove;
}

/**
 * Update cart line(s) mutation
 * @param cartId the current cart id
 * @param lineIds [ID!]! an array of cart line ids to remove
 * @see https://shopify.dev/api/storefront/2022-07/mutations/cartlinesremove
 * @returns mutated cart
 * @preserve
 */
export async function cartUpdate({
  cartId,
  lines,
  storefront,
}: {
  cartId: string;
  lines: CartLineUpdateInput[];
  storefront: AppLoadContext['storefront'];
}) {
  const {cartLinesUpdate} = await storefront.mutate<{
    cartLinesUpdate: {cart: CartType; errors: UserError[]};
  }>(UPDATE_LINE_MUTATION, {
    variables: {cartId, lines},
  });

  invariant(
    cartLinesUpdate,
    'No data returned from update lines items mutation',
  );
  return cartLinesUpdate;
}

/**
 * Mutation to update a cart buyerIdentity
 * @param cartId  Cart['id']
 * @param buyerIdentity CartBuyerIdentityInput
 * @returns {cart: Cart; errors: UserError[]}
 * @see API https://shopify.dev/api/storefront/2022-10/mutations/cartBuyerIdentityUpdate
 * @preserve
 */
export async function cartUpdateBuyerIdentity({
  cartId,
  buyerIdentity,
  storefront,
}: {
  cartId: string;
  buyerIdentity: CartBuyerIdentityInput;
  storefront: AppLoadContext['storefront'];
}) {
  const {cartBuyerIdentityUpdate} = await storefront.mutate<{
    cartBuyerIdentityUpdate: {cart: CartType; errors: UserError[]};
  }>(UPDATE_CART_BUYER_COUNTRY, {
    variables: {
      cartId,
      buyerIdentity,
    },
  });

  invariant(
    cartBuyerIdentityUpdate,
    'No data returned from cart buyer identity update mutation',
  );

  return cartBuyerIdentityUpdate;
}

/*
  Cart Queries
*/

const USER_ERROR_FRAGMENT = `#graphql
  fragment ErrorFragment on CartUserError {
    message
    field
    code
  }
`;

const LINES_CART_FRAGMENT = `#graphql
  fragment CartLinesFragment on Cart {
    id
    totalQuantity
  }
`;

const CREATE_CART_MUTATION = `#graphql
  mutation ($input: CartInput!, $country: CountryCode = ZZ, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...CartLinesFragment
        checkoutUrl
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
`;

const ADD_LINES_MUTATION = `#graphql
  mutation ($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode = ZZ, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
`;

const UPDATE_LINE_MUTATION = `#graphql
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode, $country: CountryCode)
  @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`;

const REMOVE_LINE_ITEMS_MUTATION = `#graphql
  mutation ($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode)
  @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ...on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
      errors: userErrors {
        message
        field
        code
      }
    }
  }
`;

const UPDATE_CART_BUYER_COUNTRY = `#graphql
 mutation(
   $cartId: ID!
   $buyerIdentity: CartBuyerIdentityInput!
   $country: CountryCode = ZZ
   $language: LanguageCode
 ) @inContext(country: $country, language: $language) {
   cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
     cart {
       id
       buyerIdentity {
         email
         phone
         countryCode
       }
     }
     errors: userErrors {
       message
       field
       code
     }
   }
 }
`;
