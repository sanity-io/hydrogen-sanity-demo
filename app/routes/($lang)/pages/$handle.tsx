import {useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import groq from 'groq';
import invariant from 'tiny-invariant';

import PageHero from '~/components/heroes/Page';
import PortableText from '~/components/portableText/PortableText';
import {getStorefrontData, validateLocale} from '~/lib/utils';
import {PAGE} from '~/queries/sanity/fragments/pages/page';
import {SanityPage} from '~/types/sanity';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
});

export const handle = {
  seo,
};

export async function loader({params, context}: LoaderArgs) {
  validateLocale({context, params});

  const {handle} = params;
  invariant(handle, 'Missing page handle');

  const page = await context.sanity.client.fetch<SanityPage>(QUERY_SANITY, {
    slug: handle,
  });

  // Resolve any references to products on the Storefront API
  const storefrontData = await getStorefrontData({page, context});

  if (!page) {
    throw new Response(null, {status: 404});
  }

  return json({page, storefrontData});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Page hero */}
      <PageHero
        colorTheme={page.colorTheme}
        fallbackTitle={page.title}
        hero={page.hero}
      />
      {/* Body */}
      {page.body && (
        <PortableText
          blocks={page.body}
          centered
          className={clsx(
            'mx-auto max-w-[660px] px-4 pb-24 pt-8', //
            'md:px-8',
          )}
          colorTheme={page.colorTheme}
        />
      )}
    </>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == 'page'
    && slug.current == $slug
  ][0]{
    ${PAGE}
  }
`;
