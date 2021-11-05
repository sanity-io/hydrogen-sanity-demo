import groq from 'groq';
import {useParams} from 'react-router-dom';

import Layout from '../../components/Layout.client';
import NotFound from '../../components/NotFound.server';
import ProductListing from '../../components/ProductListing.client';
import Seo from '../../components/Seo.client';
import {COLLECTION} from '../../fragments/collection';
import useSanityQuery from '../../utils/query/useSanityQuery';

export default function Collection() {
  const {handle} = useParams();
  const {sanityData: sanityCollection, shopifyProducts} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
  });

  if (!sanityCollection || !shopifyProducts) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="p-4">
        {/* Title */}
        <h1 className="font-medium text-xl">{sanityCollection.title}</h1>

        {/* Description */}
        {sanityCollection?.description && (
          <div className="max-w-3xl p4 text-xl">
            {sanityCollection.description}
          </div>
        )}

        <ProductListing
          products={sanityCollection?.products.map((product) => ({
            ...product,
            storefront: shopifyProducts?.[product?._id],
          }))}
        />
      </div>

      {/* SEO */}
      <Seo
        page={{
          description: sanityCollection.seo?.description,
          image: sanityCollection.seo?.image,
          keywords: sanityCollection.seo?.keywords,
          title: sanityCollection.seo?.title,
        }}
      />
    </Layout>
  );
}

const QUERY = groq`
  *[
    _type == 'collection'
    && slug.current == $slug
  ][0]{
    ${COLLECTION}
  }
`;
