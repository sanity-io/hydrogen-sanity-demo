import {
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {flattenConnection} from '@shopify/hydrogen';
import type {
  Customer,
  MailingAddress,
  Order,
} from '@shopify/hydrogen/storefront-api-types';
import {
  type AppLoadContext,
  defer,
  json,
  type LoaderArgs,
  redirect,
} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {ReactNode} from 'react';

import {AccountAddressBook} from '~/components/account/AccountAddressBook';
import {AccountDetails} from '~/components/account/AccountDetails';
import {Modal} from '~/components/account/Modal';
import AccountOrderHistory from '~/components/account/OrderHistory';
import Button from '~/components/elements/Button';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {usePrefixPathWithLocale} from '~/lib/utils';

import {doLogout} from './($lang).account.logout';

// Combining json + Response + defer in a loader breaks the
// types returned by useLoaderData. This is a temporary fix.
type TmpRemixFix = ReturnType<typeof defer<{isAuthenticated: false}>>;

export const headers = routeHeaders;

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: 'Account details',
});

export const handle = {
  seo,
  isPublic: true,
};

export async function loader({request, context, params}: LoaderArgs) {
  const {pathname} = new URL(request.url);
  const lang = params.lang;
  const customerAccessToken = await context.session.get('customerAccessToken');
  const isAuthenticated = Boolean(customerAccessToken);
  const loginPath = lang ? `/${lang}/account/login` : '/account/login';
  const isAccountPage = /\/account\/?$/.test(pathname);

  if (!isAuthenticated) {
    if (isAccountPage) {
      return redirect(loginPath) as unknown as TmpRemixFix;
    }
    // pass through to public routes
    return json({isAuthenticated: false}) as unknown as TmpRemixFix;
  }

  const customer = await getCustomer(context, customerAccessToken);

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  const orders = flattenConnection(customer.orders) as Order[];

  return defer(
    {
      isAuthenticated,
      customer,
      heading,
      orders,
      addresses: flattenConnection(customer.addresses) as MailingAddress[],
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const matches = useMatches();

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    return match?.handle?.renderInModal;
  });

  // Public routes
  if (!data.isAuthenticated) {
    return <Outlet />;
  }

  // Authenticated routes
  if (outlet) {
    if (renderOutletInModal) {
      const modalSeo = matches.map((match) => {
        if (typeof match.handle?.seo === 'function') {
          return match.handle.seo(match);
        }
        return match?.handle?.seo || '';
      });

      const modalTitle = modalSeo.length
        ? modalSeo[modalSeo.length - 1]?.title
        : '';

      return (
        <>
          <Modal title={modalTitle} cancelLink="/account">
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Account {...(data as Account)} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...(data as Account)} />;
}

interface Account {
  customer: Customer;
  orders: Order[];
  heading: string;
  addresses: MailingAddress[];
}

function Account({customer, orders, heading, addresses}: Account) {
  return (
    <div className="divide-y divide-gray pb-24 pt-28">
      <AccountSection>
        <div className="mb-4 text-sm font-bold">Account</div>
        <h1
          className={clsx([
            'mb-4 text-2xl', //
            'md:text-3xl',
          ])}
        >
          {heading}
        </h1>
        <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
          <Button type="submit">Log out</Button>
        </Form>
      </AccountSection>

      {orders && (
        <AccountSection>
          <AccountOrderHistory orders={orders as Order[]} />
        </AccountSection>
      )}

      <AccountSection>
        <AccountDetails customer={customer as Customer} />
      </AccountSection>
      <AccountSection>
        <AccountAddressBook
          addresses={addresses as MailingAddress[]}
          customer={customer as Customer}
        />
      </AccountSection>
    </div>
  );
}

const AccountSection = ({children}: {children: ReactNode}) => {
  return (
    <div>
      <div
        className={clsx(['mx-auto w-full max-w-[1400px] px-4 py-8', 'md:px-8'])}
      >
        {children}
      </div>
    </div>
  );
};

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      defaultAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        country
        province
        city
        zip
        phone
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
            phone
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 100) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCustomer(
  context: AppLoadContext,
  customerAccessToken: string,
) {
  const {storefront} = context;

  const data = await storefront.query<{
    customer: Customer;
  }>(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (!data || !data.customer) {
    throw await doLogout(context);
  }

  return data.customer;
}
