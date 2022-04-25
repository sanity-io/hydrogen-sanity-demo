import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import pluralize from 'pluralize';
import clientConfig from '../../../sanity.config';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductListing from '../../components/ProductListing.server';
import SeoImage from '../../components/SeoImage.client';
import {COLLECTION_PAGE} from '../../fragments/collectionPage';

export default function Collection({params}) {
  const {handle} = params;
  const {sanityData: sanityCollection, shopifyProducts} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
    clientConfig,
  });

  if (!sanityCollection) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="mb-20">
          {/* Title */}
          <h1 className="font-medium text-3xl">
            {sanityCollection.title}{' '}
            <span className="font-normal text-gray-400">
              (
              {pluralize(
                'product',
                sanityCollection?.products?.length || 0,
                true,
              )}
              )
            </span>
          </h1>

          {/* Description */}
          {sanityCollection?.description && (
            <div className="font-normal max-w-3xl text-gray-500 text-3xl">
              {sanityCollection.description}
            </div>
          )}
        </div>

        <ProductListing
          products={sanityCollection?.products?.map((product) => ({
            ...product,
            storefront: shopifyProducts?.[product?._id],
          }))}
        />
      </div>

      {/* SEO */}
      <Seo
        data={{
          seo: {
            description: sanityCollection.seo?.description,
            title: sanityCollection.seo?.title,
          },
          title: sanityCollection.seo?.title,
        }}
        type="page"
      />
      {/* Open Graph image tags */}
      {sanityCollection?.seo?.image && (
        <SeoImage image={sanityCollection.seo.image} />
      )}
    </Layout>
  );
}

const QUERY = groq`
  *[
    _type == 'collection'
    && slug.current == $slug
  ][0]{
    ${COLLECTION_PAGE}
  } {
    ...,
    products[available]
  }
`;
