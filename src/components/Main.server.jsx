import {DefaultRoutes} from '@shopify/hydrogen';
import groq from 'groq';
import {Suspense} from 'react';
import {Switch} from 'react-router-dom';

import SettingsProvider from '../contexts/SettingsProvider.server';
import {LINKS} from '../fragments/links';
import {PORTABLE_TEXT} from '../fragments/portableText';
import useSanityQuery from '../utils/query/useSanityQuery';

import DefaultSeo from './DefaultSeo.server';
import NotFound from './NotFound.server';

export default function Main(props) {
  const {pages, serverState} = props;

  const {sanityData: sanitySettings} = useSanityQuery({
    query: QUERY,
    // No need to query Shopify product data ✨
    getProductGraphQLFragment: () => false,
  });

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <DefaultSeo />
      <SettingsProvider value={sanitySettings}>
        <Switch>
          <DefaultRoutes
            pages={pages}
            serverState={serverState}
            fallback={<NotFound />}
          />
        </Switch>
      </SettingsProvider>
    </Suspense>
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
    }
  }
`;
