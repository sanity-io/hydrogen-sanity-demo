import {
  CacheDays,
  gql,
  Seo,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';
import groq from 'groq';
import useSanityQuery from '../hooks/useSanityQuery';

/**
 * A server component that fetches global seo settings from your Sanity dataset
 * and sets default values and templates for every page.
 */
export default function DefaultSeo() {
  const {data: seo} = useSanityQuery<{
    description?: string;
    title: string;
  }>({
    hydrogenQueryOptions: {
      preload: '*',
    },
    query: QUERY_SANITY,
  });

  const {
    data: {
      shop: {
        id,
        paymentSettings: {currencyCode},
      },
    },
  } = useShopQuery({
    query: QUERY_SHOPIFY,
    cache: CacheDays(),
    preload: '*',
  });

  // Shopify analytics
  useServerAnalytics({
    shopify: {
      shopId: id,
      currency: currencyCode,
    },
  });

  return (
    // @ts-expect-error <Seo> shouldn't require a value for data that extends the `Shop` type
    <Seo
      data={{
        title: seo?.title,
        description: seo?.description,
      }}
      type="defaultSeo"
    />
  );
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0].seo {
    ...
  }
`;

const QUERY_SHOPIFY = gql`
  query shopInfo {
    shop {
      id
      paymentSettings {
        currencyCode
      }
    }
  }
`;
