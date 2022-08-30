import {Seo, type HydrogenRouteProps} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PageHero from '../../components/heroes/Page.server';
import PortableText from '../../components/portableText/PortableText.server';
import {PAGE} from '../../fragments/sanity/pages/page';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {SanityPage} from '../../types';

// This demo doesn't use Shopify Online Store pages.
// For this reason we don't use Shopify Analytics here.
export default function PageRoute({params}: HydrogenRouteProps) {
  const {handle} = params;
  const {data: sanityPage} = useSanityQuery<SanityPage>({
    query: QUERY_SANITY,
    params: {slug: handle},
  });

  if (!sanityPage) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityPage.seo;

  return (
    <Layout>
      {/* Page hero */}
      <PageHero
        colorTheme={sanityPage.colorTheme}
        fallbackTitle={sanityPage.title}
        hero={sanityPage.hero}
      />
      {/* Body */}
      {sanityPage.body && (
        <PortableText
          blocks={sanityPage.body}
          centered
          className={clsx(
            'mx-auto max-w-[660px] px-4 pb-24 pt-8', //
            'md:px-8',
          )}
          colorTheme={sanityPage.colorTheme}
        />
      )}
      <Seo
        data={{
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="page"
      />
    </Layout>
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
