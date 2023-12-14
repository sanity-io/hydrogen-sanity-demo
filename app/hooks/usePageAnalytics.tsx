import {useMatches} from '@remix-run/react';
import type {ShopifyPageViewPayload} from '@shopify/hydrogen';
import {useMemo} from 'react';

import {DEFAULT_LOCALE} from '~/lib/utils';

export function usePageAnalytics({hasUserConsent}: {hasUserConsent: boolean}) {
  const matches = useMatches();

  return useMemo(() => {
    const data: Record<string, unknown> = {};

    matches.forEach((event) => {
      const eventData = event?.data;
      if (eventData) {
        // @ts-expect-error
        eventData['analytics'] && Object.assign(data, eventData['analytics']);

        // @ts-expect-error
        const selectedLocale = eventData['selectedLocale'] || DEFAULT_LOCALE;
        Object.assign(data, {
          currency: selectedLocale.currency,
          acceptedLanguage: selectedLocale.language,
        });
      }
    });

    return {
      ...data,
      hasUserConsent,
    } as unknown as ShopifyPageViewPayload;
  }, [hasUserConsent, matches]);
}
