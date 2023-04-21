import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, type SeoHandleFunction} from '@shopify/hydrogen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import clsx from 'clsx';

import HomeHero from '~/components/heroes/Home';
import ModuleGrid from '~/components/modules/ModuleGrid';
import {usePreviewComponent, usePreviewContext} from '~/lib/sanity';
import {SanityHeroHome, SanityHomePage} from '~/lib/sanity';
import {getStorefrontData, validateLocale} from '~/lib/utils';
import {HOME_PAGE_QUERY} from '~/queries/sanity/home';

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

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityHomePage>({
    query: HOME_PAGE_QUERY,
    cache,
  });

  // Resolve any references to products on the Storefront API
  const storefrontData = await getStorefrontData({page, context});

  return json({
    page,
    storefrontData,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const {page} = useLoaderData<typeof loader>();
  const Component = usePreviewComponent<{page: SanityHomePage}>(Route, Preview);

  return <Component page={page} />;
}

function Route({page}: {page: SanityHomePage}) {
  return (
    <>
      {/* Page hero */}
      {page?.hero && <HomeHero hero={page.hero as SanityHeroHome} />}

      {page?.modules && (
        <div className={clsx('mb-32 mt-24 px-4', 'md:px-8')}>
          <ModuleGrid items={page.modules} />
        </div>
      )}
    </>
  );
}

function Preview(props: {page: SanityHomePage}) {
  const {usePreview} = usePreviewContext()!;
  const page = usePreview(HOME_PAGE_QUERY, undefined, props.page);

  return <Route page={page} />;
}
