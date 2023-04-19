import {Form, useActionData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import type {CustomerResetPayload} from '@shopify/hydrogen/storefront-api-types';
import {type ActionFunction, redirect} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {useRef, useState} from 'react';

import FormCardWrapper from '~/components/account/FormCardWrapper';
import FormFieldText from '~/components/account/FormFieldText';
import Button from '~/components/elements/Button';
import {badRequest} from '~/lib/utils';

type ActionData = {
  formError?: string;
};

const seo: SeoHandleFunction = () => ({
  title: 'Reset password',
});

export const handle = {
  seo,
};

export const action: ActionFunction = async ({
  request,
  context,
  params: {lang, id, resetToken},
}) => {
  if (
    !id ||
    !resetToken ||
    typeof id !== 'string' ||
    typeof resetToken !== 'string'
  ) {
    return badRequest<ActionData>({
      formError: 'Wrong token. Please try to reset your password again.',
    });
  }

  const formData = await request.formData();

  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  if (
    !password ||
    !passwordConfirm ||
    typeof password !== 'string' ||
    typeof passwordConfirm !== 'string' ||
    password !== passwordConfirm
  ) {
    return badRequest<ActionData>({
      formError: 'Please provide matching passwords',
    });
  }

  const {session, storefront} = context;

  try {
    const data = await storefront.mutate<{customerReset: CustomerResetPayload}>(
      CUSTOMER_RESET_MUTATION,
      {
        variables: {
          id: `gid://shopify/Customer/${id}`,
          input: {
            password,
            resetToken,
          },
        },
      },
    );

    const {accessToken} = data?.customerReset?.customerAccessToken ?? {};

    if (!accessToken) {
      /**
       * Something is wrong with the user's input.
       */
      throw new Error(data?.customerReset?.customerUserErrors.join(', '));
    }

    session.set('customerAccessToken', accessToken);

    return redirect(lang ? `${lang}/account` : '/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: any) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Something went wrong. Please try again later.',
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError: 'Sorry. We could not update your password.',
    });
  }
};

export default function Reset() {
  const actionData = useActionData<ActionData>();
  const [nativePasswordError, setNativePasswordError] = useState<null | string>(
    null,
  );
  const [nativePasswordConfirmError, setNativePasswordConfirmError] = useState<
    null | string
  >(null);

  const passwordInput = useRef<HTMLInputElement>(null);
  const passwordConfirmInput = useRef<HTMLInputElement>(null);

  const validatePasswordConfirm = () => {
    if (!passwordConfirmInput.current) return;

    if (
      passwordConfirmInput.current.value.length &&
      passwordConfirmInput.current.value !== passwordInput.current?.value
    ) {
      setNativePasswordConfirmError('The two passwords entered did not match.');
    } else if (
      passwordConfirmInput.current.validity.valid ||
      !passwordConfirmInput.current.value.length
    ) {
      setNativePasswordConfirmError(null);
    } else {
      setNativePasswordConfirmError(
        passwordConfirmInput.current.validity.valueMissing
          ? 'Please re-enter the password'
          : 'Passwords must be at least 8 characters',
      );
    }
  };

  return (
    <div
      className={clsx(
        'my-32 px-4', //
        'md:px-8',
      )}
    >
      <div className="flex justify-center">
        <FormCardWrapper title="Reset password">
          <p className="my-4 text-sm">Enter a new password for your account.</p>
          <Form method="post" noValidate>
            {/* Form error */}
            {actionData?.formError && (
              <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
                <p>{actionData.formError}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Password */}
              <FormFieldText
                ref={passwordInput}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-label="Password"
                minLength={8}
                required
                error={nativePasswordError || ''}
                label="Password"
                onBlur={(event) => {
                  if (
                    event.currentTarget.validity.valid ||
                    !event.currentTarget.value.length
                  ) {
                    setNativePasswordError(null);
                    validatePasswordConfirm();
                  } else {
                    setNativePasswordError(
                      event.currentTarget.validity.valueMissing
                        ? 'Please enter a password'
                        : 'Passwords must be at least 8 characters',
                    );
                  }
                }}
              />

              {/* Password (repeat) */}
              <FormFieldText
                ref={passwordConfirmInput}
                error={nativePasswordConfirmError || ''}
                label="Repeat password"
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                autoComplete="current-password"
                aria-label="Re-enter password"
                minLength={8}
                required
                onBlur={validatePasswordConfirm}
              />
            </div>

            {/* Footer */}
            <div className="mt-4 space-y-4">
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </FormCardWrapper>
      </div>
    </div>
  );
}

const CUSTOMER_RESET_MUTATION = `#graphql
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
