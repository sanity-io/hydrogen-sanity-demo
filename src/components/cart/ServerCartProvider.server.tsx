import {useSession} from '@shopify/hydrogen';
import {ReactNode} from 'react';
import LocalCartProvider from './LocalCartProvider.client';

type Props = {
  children: ReactNode;
};

export default function ServerCartProvider({children}: Props) {
  const {customerAccessToken} = useSession();

  return (
    <LocalCartProvider customerAccessToken={customerAccessToken}>
      {children}
    </LocalCartProvider>
  );
}
