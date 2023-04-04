import {useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import groq from 'groq';
import invariant from 'tiny-invariant';

import PageHero from '~/components/heroes/Page';
import PortableText from '~/components/portableText/PortableText';
import {PAGE} from '~/queries/sanity/fragments/pages/page';
import {SanityPage} from '~/types/sanity';
import {getHeroData} from '~/utils/heroData';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
});

export const handle = {
  seo,
};

export async function loader({params, context}: LoaderArgs) {
  invariant(params.handle, 'Missing page handle');

  const page = await context.sanity.client.fetch<SanityPage>(QUERY_SANITY, {
    slug: params.handle,
  });

  if (page.hero?.content) {
    page.hero.data = await getHeroData({content: page.hero?.content, context});
  }

  if (!page) {
    throw new Response(null, {status: 404});
  }

  return json({page});
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
