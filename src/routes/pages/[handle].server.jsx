import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import React from 'react';
import clientConfig from '../../../sanity.config';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import PortableText from '../../components/PortableText.client';
import SeoImage from '../../components/SeoImage.client';
import {PORTABLE_TEXT} from '../../fragments/portableText';
import {SEO} from '../../fragments/seo';

export default function InfoArticle({params}) {
  const {handle} = params;

  const {sanityData: sanityArticle} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
  });

  if (!sanityArticle) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="max-w-3xl p-4">
        <h1 className="font-medium mb-10 text-3xl">{sanityArticle.title}</h1>

        {/* Body */}
        {sanityArticle?.body && (
          <PortableText blocks={sanityArticle.body} className="mt-4" />
        )}
      </div>

      {/* SEO */}
      <Seo
        data={{
          seo: {
            description: sanityArticle.seo?.description,
            title: sanityArticle.seo?.title || sanityArticle?.title,
          },
          title: sanityArticle.seo?.title || sanityArticle?.title,
        }}
        type="page"
      />
      {/* Open Graph image tags */}
      {sanityArticle?.seo?.image && (
        <SeoImage image={sanityArticle.seo.image} />
      )}
    </Layout>
  );
}

const QUERY = groq`
  *[
    _type == 'article.info'
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
