import {Form, useActionData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import type {CustomerRecoverPayload} from '@shopify/hydrogen/storefront-api-types';
import {
  type ActionFunction,
  json,
  type LoaderArgs,
  redirect,
} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {useState} from 'react';

import FormCardWrapper from '~/components/account/FormCardWrapper';
import FormFieldText from '~/components/account/FormFieldText';
import Button from '~/components/elements/Button';
import {badRequest} from '~/lib/utils';

const seo: SeoHandleFunction<typeof loader> = () => ({
  title: 'Recover password',
});

export const handle = {
  seo,
};

export async function loader({context, params}: LoaderArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.lang ? `${params.lang}/account` : '/account');
  }

  return new Response(null);
}

type ActionData = {
  formError?: string;
  resetRequested?: boolean;
};

export const action: ActionFunction = async ({request, context}) => {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return badRequest<ActionData>({
      formError: 'Please provide an email.',
    });
  }

  try {
    await context.storefront.mutate<{
      customerRecover: CustomerRecoverPayload;
    }>(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error: any) {
    return badRequest<ActionData>({
      formError: 'Something went wrong. Please try again later.',
    });
  }
};

export default function Recover() {
  const actionData = useActionData<ActionData>();
  const [nativeEmailError, setNativeEmailError] = useState<null | string>(null);
  const isSubmitted = actionData?.resetRequested;

  return (
    <div
      className={clsx(
        'my-32 px-4', //
        'md:px-8',
      )}
    >
      <div className="flex justify-center">
        <FormCardWrapper title="Recover password">
          {isSubmitted ? (
            <>
              <div className="text-sm">
                <p>
                  If that email address is in our system, you&rsquo;ll receive
                  an email with instructions on how to reset your password in a
                  few minutes.
                </p>
              </div>
              {/* Footer */}
              <div className="mt-4 flex justify-center">
                <Button to="/account/login" type="button">
                  Back to sign in
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="my-4 text-sm">
                Enter your email address to receive a password reset link.
              </p>
              <Form method="post" noValidate>
                {/* Form error */}
                {actionData?.formError && (
                  <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
                    <p>{actionData.formError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Email */}
                  <FormFieldText
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-label="Email address"
                    label="Email address"
                    error={nativeEmailError || ''}
                    onBlur={(event) => {
                      setNativeEmailError(
                        event.currentTarget.value.length &&
                          !event.currentTarget.validity.valid
                          ? 'Invalid email address'
                          : null,
                      );
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between">
                  <Button mode="outline" to="/account/login" type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Send reset link</Button>
                </div>
              </Form>
            </>
          )}
        </FormCardWrapper>
      </div>
    </div>
  );
}

const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
