import {Await} from '@remix-run/react';
import {
  CartForm,
  type CartQueryData,
  type SeoHandleFunction,
} from '@shopify/hydrogen';
import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';

import {CartActions, CartLineItems, CartSummary} from '~/components/cart/Cart';
import SpinnerIcon from '~/components/icons/Spinner';
import {isLocalPath} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

const seo: SeoHandleFunction = () => ({
  title: 'Cart',
  noIndex: true,
});

export const handle = {
  seo,
};

export async function action({request, context}: ActionFunctionArgs) {
  const {session, cart} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryData;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(request, redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors} = result;
  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const rootData = useRootLoaderData();

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
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <>
              {cart && (
                <div className="mx-auto grid w-full max-w-6xl gap-8 pb-12 md:grid-cols-2 md:items-start md:gap-8 lg:gap-12">
                  <div className="flex-grow md:translate-y-4">
                    <CartLineItems linesObj={cart.lines} />
                  </div>
                  <div className="fixed bottom-0 left-0 right-0 grid w-full gap-6 p-4 md:sticky md:top-[65px] md:translate-y-4 md:px-6">
                    <CartSummary cost={cart.cost} />
                    <CartActions cart={cart} />
                  </div>
                </div>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
