import {Seo} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import {IMAGE} from '../fragments/image';
import SeoImage from './SeoImage.client';

export default function DefaultSeo() {
  const {sanityData: sanitySeo} = useSanityQuery({
    query: QUERY,
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
  });

  if (!sanitySeo) {
    return null;
  }

  return (
    <>
      <Seo data={{title: sanitySeo?.title}} type="defaultSeo" />
      {/* Open Graph image tags */}
      {sanitySeo?.image && <SeoImage image={sanitySeo.image} />}
    </>
  );
}

const QUERY = groq`
  *[_type == 'settings'][0].seo {
    image {
      ${IMAGE}
    },
    title
  }
`;
