import {CacheDays, gql, Seo, useShopQuery} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import {Suspense} from 'react';
import HeroHome from '../components/heroes/HeroHome.server';
import Layout from '../components/Layout.server';
import ModuleGrid from '../components/ModuleGrid.server';
import {HOME_PAGE} from '../fragments/homePage';
import useSanityQuery from '../hooks/useSanityQuery';
import type {SanityHomePage} from '../types';

export default function IndexRoute() {
  const {data: sanityHome} = useSanityQuery<SanityHomePage>({
    query: SANITY_QUERY,
  });

  return (
    <Layout>
      {/* Page hero */}
      {sanityHome?.hero && <HeroHome hero={sanityHome.hero} />}

      <Suspense fallback={null}>
        <SeoForHomepage />
      </Suspense>

      {sanityHome?.modules && (
        <div
          className={clsx(
            'mb-32 mt-24 px-4 pb-overlap', //
            'md:px-8',
          )}
        >
          <ModuleGrid items={sanityHome.modules} />
        </div>
      )}
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

const SANITY_QUERY = groq`
  *[_type == 'home'][0]{
    ${HOME_PAGE}
  }
`;

const SEO_QUERY = gql`
  query homeShopInfo {
    shop {
      description
    }
  }
`;
