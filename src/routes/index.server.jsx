import {CacheDays, gql, Seo, useShopQuery} from '@shopify/hydrogen';
import {Suspense} from 'react';
import Layout from '../components/Layout.server';

export default function IndexRoute() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>
      <div className="relative">
        <h1 className="mx-auto max-w-[60rem] pb-8 pt-34 text-center text-4xl">
          (Home modules)
        </h1>
      </div>
    </Layout>
  );
}

function SeoForHomepage() {
  const {
    data: {
      shop: {title, description},
    },
  } = useShopQuery({
    query: SEO_QUERY,
    cache: CacheDays(),
    preload: true,
  });

  return (
    <Seo
      type="homepage"
      data={{
        title,
        description,
      }}
    />
  );
}

const SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;
