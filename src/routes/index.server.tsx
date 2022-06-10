import {Seo} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import HomeHero from '../components/heroes/Home.server';
import Layout from '../components/Layout.server';
import ModuleGrid from '../components/ModuleGrid.server';
import NotFound from '../components/NotFound.server';
import {HOME_PAGE} from '../fragments/pages/home';
import useSanityQuery from '../hooks/useSanityQuery';
import type {SanityHomePage} from '../types';

export default function IndexRoute() {
  const {data: sanityHome} = useSanityQuery<SanityHomePage>({
    hydrogenQueryOptions: {preload: true},
    query: SANITY_QUERY,
  });

  if (!sanityHome) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Page hero */}
      {sanityHome?.hero && <HomeHero hero={sanityHome.hero} />}

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

      <Seo
        data={{
          description: sanityHome.seo.description,
          title: sanityHome.seo.title,
        }}
        type="homepage"
      />
    </Layout>
  );
}

const SANITY_QUERY = groq`
  *[_type == 'home'][0]{
    ${HOME_PAGE}
  }
`;
