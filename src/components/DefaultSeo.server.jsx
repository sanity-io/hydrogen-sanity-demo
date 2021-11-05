import groq from 'groq';

import {IMAGE} from '../fragments/image';
import useSanityQuery from '../utils/query/useSanityQuery';

import Seo from './Seo.client';

export default function SeoServer() {
  const {sanityData: sanitySeo} = useSanityQuery({
    query: QUERY,
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
  });

  if (!sanitySeo) {
    return null;
  }

  return (
    <Seo defaultImage={sanitySeo?.image} defaultTitle={sanitySeo?.title} />
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
