import {CacheNone, Seo, type HydrogenRouteProps} from '@shopify/hydrogen';
import clsx from 'clsx';
import {Suspense} from 'react';
import LoginForm from '../../components/account/forms/Login.client';
import Layout from '../../components/global/Layout.server';

export default function Login({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Login'}} />
      </Suspense>

      <div
        className={clsx(
          'my-32 px-4', //
          'md:px-8',
        )}
      >
        <LoginForm />
      </div>
    </Layout>
  );
}
