import {yupResolver} from '@hookform/resolvers/yup';
import {Link, useNavigate} from '@shopify/hydrogen/client';
import {useCallback} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import Button from '../../elements/Button';
import FormCardWrapper from '../FormCardWrapper.client';
import FormFieldText from '../FormFieldText.client';

type FormValues = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().email('Please enter a valid email'),
    password: yup.string().required('Please enter your password'),
  })
  .required();

export default function LoginForm() {
  const {
    formState: {errors, isDirty, isSubmitting, isSubmitSuccessful},
    handleSubmit,
    register,
    setError,
  } = useForm<
    FormValues & {
      serverError?: string;
    }
  >({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const handleLogin: SubmitHandler<FormValues> = useCallback(
    async (formData) => {
      const response = await callLoginApi(formData);

      if (response.error) {
        setError('serverError', {
          message:
            'Sorry, we did not recognize either your email or password. Please try again or create a new account.',
          type: 'custom',
        });
        return;
      }

      navigate('/account');
    },
    [navigate, setError],
  );

  return (
    <div className="flex justify-center">
      <FormCardWrapper title="Sign in">
        <form onSubmit={handleSubmit(handleLogin)}>
          {/* Form error */}
          {errors?.serverError?.message && (
            <div className="mb-6 flex items-center justify-center rounded-sm border border-red p-4 text-sm text-red">
              <p>{errors.serverError.message}</p>
            </div>
          )}

          <div className="space-y-12">
            <div className="space-y-4">
              {/* Email */}
              <FormFieldText
                autoComplete="email"
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.email?.message}
                label="Email address"
                type="text"
                {...register('email')}
              />

              {/* Password */}
              <FormFieldText
                autoComplete="current-password"
                disabled={isSubmitting || isSubmitSuccessful}
                error={errors.password?.message}
                label="Password"
                type="password"
                {...register('password')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 space-y-4">
            <Button
              disabled={!isDirty || isSubmitting || isSubmitSuccessful}
              type="submit"
            >
              {isSubmitting || isSubmitSuccessful ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="flex justify-between">
              <p className="text-sm">
                New user?&nbsp;
                <Link className="inline underline" to="/account/register">
                  Create an account
                </Link>
              </p>

              <p className="text-sm">
                <Link
                  className="text-primary/50 inline-block align-baseline text-sm"
                  to="/account/recover"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
          </div>
        </form>
      </FormCardWrapper>
    </div>
  );
}

export async function callLoginApi({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(`/api/account/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (error) {
    return {
      error:
        (error instanceof Error)?.toString() || 'An unknown error has occurred',
    };
  }
}
