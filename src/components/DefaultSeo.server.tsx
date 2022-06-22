import {Seo} from '@shopify/hydrogen';
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

  return (
    // @ts-expect-error <Seo> shouldn't require a value for data that extends the `Shop` type
    <Seo
      data={{
        description: seo?.description,
        title: seo?.title,
        titleTemplate: `%s · ${seo?.title}`,
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
