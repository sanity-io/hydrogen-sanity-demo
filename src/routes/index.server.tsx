import {CacheDays, gql, Seo, useShopQuery} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import {Suspense} from 'react';
import clientConfig from '../../sanity.config';
import Layout from '../components/Layout.server';
import ModuleGrid from '../components/ModuleGrid.server';
import HeroHome from '../components/heroes/HeroHome.server';
import {HOME_PAGE} from '../fragments/homePage';
import type {SanityHomePage} from '../types';

type SanityPayload = SanityHomePage;

export default function IndexRoute() {
  const {sanityData: sanityHome} = useSanityQuery<SanityPayload>({
    clientConfig,
    getProductGraphQLFragment: () => false,
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
        <div className="mb-32 mt-8 px-8 pb-overlap">
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
