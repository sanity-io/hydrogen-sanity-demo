// import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import Hero from '../../components/Hero.server';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PortableText from '../../components/PortableText.client';
import {PAGE} from '../../fragments/page';
import {SanityPage} from '../../types';

type Props = {
  params: any;
};

type ShopifyPayload = SanityPage;

export default function PageRoute({params}: Props) {
  const {handle} = params;
  const {sanityData: page} = useSanityQuery<ShopifyPayload>({
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
      <Hero title={page.title} />

      {/* Body */}
      {page?.body && <PortableText blocks={page.body} className="mt-4" />}

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
