// import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import HeroPage from '../../components/heroes/HeroPage.server';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PortableText from '../../components/PortableText.server';
import useSanityQuery from '../../hooks/useSanityQuery';
import {PAGE} from '../../fragments/page';
import {SanityPage} from '../../types';

type Props = {
  params: any;
};

export default function PageRoute({params}: Props) {
  const {handle} = params;
  const {data: page} = useSanityQuery<SanityPage>({
    query: QUERY,
    params: {slug: handle},
  });

  if (!page) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Page hero */}
      <HeroPage
        colorTheme={page.colorTheme}
        fallbackTitle={page.title}
        hero={page.hero}
      />

      {/* Body */}
      {page.body && (
        <PortableText
          blocks={page.body}
          centered
          className="my-8 mx-auto max-w-[660px] px-8 pb-overlap"
          colorTheme={page.colorTheme}
        />
      )}

      {/* TODO: re-add */}
      {/* <Seo type="page" data={page} /> */}
    </Layout>
  );
}
const QUERY = groq`
  *[
    _type == 'page'
    && slug.current == $slug
  ][0]{
    ${PAGE}
  }
`;
