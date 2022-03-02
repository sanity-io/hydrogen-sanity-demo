import {DefaultRoutes} from '@shopify/hydrogen';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../sanity.config';
import SettingsProvider from '../contexts/SettingsProvider.client';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import DefaultSeo from './DefaultSeo.server';
import NotFound from './NotFound.server';

export default function Main(props) {
  const {log, pages, serverState} = props;

  const {sanityData: sanitySettings} = useSanityQuery({
    query: QUERY,
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
    clientConfig,
  });

  return (
    <>
      <DefaultSeo />
      <SettingsProvider value={sanitySettings}>
        <DefaultRoutes
          fallback={<NotFound />}
          log={log}
          pages={pages}
          serverState={serverState}
        />
      </SettingsProvider>
    </>
  );
}

const QUERY = groq`
  *[_type == 'settings'][0] {
    footer {
      links[] {
        ${LINKS}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
    menu {
      links[] {
        ${LINKS}
      }
    },
  }
`;
