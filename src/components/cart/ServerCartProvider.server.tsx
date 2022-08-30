import {useSession} from '@shopify/hydrogen';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {ReactNode} from 'react';
import LocalCartProvider from './LocalCartProvider.client';

type Props = {
  children: ReactNode;
};

export default function ServerCartProvider({children}: Props) {
  const {countryCode} = useSession();

  return (
    <LocalCartProvider countryCode={countryCode as CountryCode}>
      {children}
    </LocalCartProvider>
  );
}
