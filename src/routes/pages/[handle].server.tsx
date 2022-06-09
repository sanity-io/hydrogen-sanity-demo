import {Seo} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import HeroPage from '../../components/heroes/HeroPage.server';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PortableText from '../../components/PortableText.server';
import {PAGE} from '../../fragments/page';
import useSanityQuery from '../../hooks/useSanityQuery';
import {SanityPage} from '../../types';

type Props = {
  params: any;
};

export default function PageRoute({params}: Props) {
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
      <HeroPage
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
            'my-8 mx-auto max-w-[660px] px-4 pb-overlap', //
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
