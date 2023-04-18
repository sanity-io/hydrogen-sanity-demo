import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {defer, LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import groq from 'groq';

import HomeHero from '~/components/heroes/Home';
import ModuleGrid from '~/components/modules/ModuleGrid';
import {getStorefrontData, validateLocale} from '~/lib/utils';
import {HOME_PAGE} from '~/queries/sanity/fragments/pages/home';
import {SanityHomePage} from '~/types/sanity';

const seo: SeoHandleFunction = ({data}) => ({
  title: data?.page?.seo?.title || 'Sanity x Hydrogen',
  description:
    data?.page?.seo?.description ||
    'A custom storefront powered by Hydrogen and Sanity',
});

export const handle = {
  seo,
};

export async function loader({context, params}: LoaderArgs) {
  validateLocale({context, params});

  const page = await context.sanity.client.fetch<SanityHomePage>(QUERY_SANITY);

  // Resolve any references to products on the Storefront API
  const storefrontData = await getStorefrontData({page, context});

  return defer({
    page,
    storefrontData,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <>
      {/* Page hero */}
      {page?.hero && <HomeHero hero={page.hero} />}

      {page?.modules && (
        <div
          className={clsx(
            'mb-32 mt-24 px-4', //
            'md:px-8',
          )}
        >
          <ModuleGrid items={page.modules} />
        </div>
      )}
    </>
  );
}

const QUERY_SANITY = groq`
  *[_type == 'home'][0]{
    ${HOME_PAGE}
  }
`;
