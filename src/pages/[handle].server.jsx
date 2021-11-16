import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import React from 'react';
import {useParams} from 'react-router-dom';

import Layout from '../components/Layout.server';
import NotFound from '../components/NotFound.server';
import PortableText from '../components/PortableText.client';
import Seo from '../components/Seo.client';
import {PORTABLE_TEXT} from '../fragments/portableText';
import {SEO} from '../fragments/seo';

export default function InfoArticle() {
  const {handle} = useParams();

  const {sanityData: sanityArticle} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
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
        page={{
          description: sanityArticle.seo?.description,
          image: sanityArticle.seo?.image,
          keywords: sanityArticle.seo?.keywords,
          title: sanityArticle.seo?.title,
        }}
      />
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
