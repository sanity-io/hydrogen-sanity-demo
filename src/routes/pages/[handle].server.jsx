import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import DebugWrapper from '../../components/DebugWrapper';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PortableText from '../../components/PortableText.client';
import {PORTABLE_TEXT} from '../../fragments/portableText';
import {SEO} from '../../fragments/seo';

export default function Page({params}) {
  const {handle} = params;
  const {sanityData: page} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
  });

  if (!page) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo type="page" data={page} />
      <DebugWrapper name="Page">
        {/* Title */}
        <h1 className="font-medium">{page.title}</h1>

        {/* Body */}
        {page?.body && <PortableText blocks={page.body} className="mt-4" />}
      </DebugWrapper>
    </Layout>
  );
}
const QUERY = groq`
  *[
    _type == 'page'
    && slug.current == $slug
  ][0]{
    body[]{
      ${PORTABLE_TEXT}
    },
    seo {
      ${SEO}
    },
    title,
  }
`;
