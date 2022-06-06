// import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import HeroPage from '../../components/heroes/HeroPage.server';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PortableText from '../../components/PortableText.server';
import {PAGE} from '../../fragments/page';
import {SanityPage} from '../../types';

type Props = {
  params: any;
};

export default function PageRoute({params}: Props) {
  const {handle} = params;
  const {sanityData: page} = useSanityQuery<SanityPage>({
    query: QUERY,
    params: {
      slug: handle,
    },
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
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
          className="mt-8 flex justify-center pb-overlap"
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
