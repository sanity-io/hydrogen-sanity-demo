import {
  CacheNone,
  gql,
  Image,
  Link,
  Money,
  Seo,
  useLocalization,
  useRouteParams,
  useSession,
  useShopQuery,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import clsx from 'clsx';
import {ReactNode, Suspense} from 'react';
import Layout from '../../../components/global/Layout.server';
import {CustomerWithNodes} from '../../../types';
import {getOrderStatusMessage} from '../../../utils/getOrderStatusMessage';

export default function OrderDetails({response}: HydrogenRouteProps) {
  const {id} = useRouteParams();

  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');
  if (!id) return response.redirect('/account/');

  const {data} = useShopQuery<{
    customer?: CustomerWithNodes;
  }>({
    query: QUERY_SHOPIFY_ORDER,
    variables: {
      country: countryCode,
      customerAccessToken,
      orderId: `id:${id}`,
      language: languageCode,
    },
    cache: CacheNone(),
  });

  const order = data?.customer?.orders?.nodes?.[0];

  if (!order) return null;

  const lineItems = order.lineItems?.nodes;
  const discountApplications = order.discountApplications?.nodes;

  const firstDiscount = discountApplications[0]?.value;
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: `Order ${order.name}`}} />
      </Suspense>

      <div className="divide-y divide-gray pb-24 pt-28">
        <OrderSection>
          <div className="mb-4 text-sm">
            <Link className="linkTextNavigation text-darkGray" to="/account">
              Account
            </Link>{' '}
            /{' '}
            <span className="font-bold text-offBlack">Order {order.name}</span>
          </div>
          <h1
            className={clsx([
              'mb-4 text-2xl', //
              'md:text-3xl',
            ])}
          >
            Order {order.name}
          </h1>
        </OrderSection>

        <OrderSection>
          <div className="mx-auto w-full max-w-[1400px]">
            <p className="mt-2 text-darkGray">
              Placed on {new Date(order.processedAt!).toDateString()}
            </p>
            <div className="grid items-start gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16">
              <table className="my-8 min-w-full divide-y divide-darkGray/50 md:col-span-3">
                <thead>
                  <tr className="align-baseline ">
                    <th
                      scope="col"
                      className="pb-4 pl-0 pr-3 text-left font-bold"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="hidden px-4 pb-4 text-right font-bold sm:table-cell md:table-cell"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="hidden px-4 pb-4 text-right font-bold sm:table-cell md:table-cell"
                    >
                      Quantity
                    </th>
                    <th scope="col" className="px-4 pb-4 text-right font-bold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-darkGray/50">
                  {lineItems.map((lineItem) => (
                    <tr key={lineItem.variant!.id}>
                      <td className="w-full max-w-0 py-4 pl-0 pr-3 align-top sm:w-auto sm:max-w-none sm:align-middle">
                        <div className="flex gap-6">
                          <Link
                            to={`/products/${
                              lineItem.variant!.product!.handle
                            }`}
                          >
                            {lineItem?.variant?.image && (
                              <div className="aspect-square w-20 overflow-hidden rounded-sm">
                                <Image
                                  src={lineItem.variant.image.src!}
                                  width={lineItem.variant.image.width!}
                                  height={lineItem.variant.image.height!}
                                  alt={lineItem.variant.image.altText!}
                                  loaderOptions={{
                                    scale: 2,
                                    crop: 'center',
                                  }}
                                />
                              </div>
                            )}
                          </Link>
                          <div className="hidden flex-col justify-center lg:flex">
                            <p>{lineItem.title}</p>
                            <p className="mt-1">{lineItem.variant!.title}</p>
                          </div>
                          <dl className="grid">
                            <dt className="sr-only">Product</dt>
                            <dd className="truncate lg:hidden">
                              <h3>{lineItem.title}</h3>
                              <div className="mt-1">
                                {lineItem.variant!.title}
                              </div>
                            </dd>
                            <dt className="sr-only">Price</dt>
                            <dd className="truncate sm:hidden">
                              <div className="mt-4">
                                <Money data={lineItem.variant!.priceV2!} />
                              </div>
                            </dd>
                            <dt className="sr-only">Quantity</dt>
                            <dd className="truncate sm:hidden">
                              <div className="mt-1">
                                Qty: {lineItem.quantity}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </td>
                      <td className="hidden px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                        <Money data={lineItem.variant!.priceV2!} />
                      </td>
                      <td className="hidden px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                        {lineItem.quantity}
                      </td>
                      <td className="px-3 py-4 text-right align-top sm:table-cell sm:align-middle">
                        <Money data={lineItem.discountedTotalPrice!} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {((discountValue && discountValue.amount) ||
                    discountPercentage) && (
                    <tr>
                      <th
                        scope="row"
                        colSpan={3}
                        className="font-normal hidden pt-6 pl-6 pr-3 text-right sm:table-cell md:pl-0"
                      >
                        Discount
                      </th>
                      <th
                        scope="row"
                        className="font-normal pt-6 pr-3 text-left sm:hidden"
                      >
                        Discount
                      </th>
                      <td className="pt-6 pl-3 pr-4 text-right font-medium md:pr-3">
                        {discountPercentage ? (
                          <span>-{discountPercentage}% off</span>
                        ) : (
                          discountValue && <Money data={discountValue!} />
                        )}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="font-normal hidden pt-6 pl-6 pr-3 text-right sm:table-cell md:pl-0"
                    >
                      Subtotal
                    </th>
                    <th
                      scope="row"
                      className="font-normal pt-6 pr-3 text-left sm:hidden"
                    >
                      Subtotal
                    </th>
                    <td className="pt-6 pl-3 pr-4 text-right md:pr-3">
                      <Money data={order.subtotalPriceV2!} />
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="font-normal hidden pt-4 pl-6 pr-3 text-right sm:table-cell md:pl-0"
                    >
                      Tax
                    </th>
                    <th
                      scope="row"
                      className="font-normal pt-4 pr-3 text-left sm:hidden"
                    >
                      Tax
                    </th>
                    <td className="pt-4 pl-3 pr-4 text-right md:pr-3">
                      <Money data={order.totalTaxV2!} />
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 pl-6 pr-3 text-right font-bold sm:table-cell md:pl-0"
                    >
                      Total
                    </th>
                    <th
                      scope="row"
                      className="pt-4 pr-3 text-left font-bold sm:hidden"
                    >
                      Total
                    </th>
                    <td className="pt-4 pl-3 pr-4 text-right font-bold md:pr-3">
                      <Money data={order.totalPriceV2!} />
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="top-nav sticky border-none md:my-8">
                <h3 className="font-bold">Shipping Address</h3>
                {order?.shippingAddress ? (
                  <ul className="mt-6">
                    <li>
                      {order.shippingAddress.firstName &&
                        order.shippingAddress.firstName + ' '}
                      {order.shippingAddress.lastName}
                    </li>
                    {order?.shippingAddress?.formatted ? (
                      order.shippingAddress.formatted.map((line) => (
                        <li key={line}>{line}</li>
                      ))
                    ) : (
                      <></>
                    )}
                  </ul>
                ) : (
                  <p className="mt-3">No shipping address defined</p>
                )}
                <h3 className="mt-8 font-bold">Status</h3>
                <div className="mt-3 inline-block w-auto rounded-full font-medium">
                  {getOrderStatusMessage(order.fulfillmentStatus!)}
                </div>
              </div>
            </div>
          </div>
        </OrderSection>
      </div>
    </Layout>
  );
}

const OrderSection = ({children}: {children: ReactNode}) => {
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

// @see: https://shopify.dev/api/storefront/2022-07/objects/Order#fields
const QUERY_SHOPIFY_ORDER = gql`
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }

  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }

  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }

  fragment Image on Image {
    altText
    height
    src: url(transform: {crop: CENTER, maxHeight: 96, maxWidth: 96, scale: 2})
    id
    width
  }

  fragment ProductVariant on ProductVariant {
    image {
      ...Image
    }
    priceV2 {
      ...Money
    }
    product {
      handle
    }
    sku
    title
  }

  fragment LineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...Money
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...Money
    }
    discountedTotalPrice {
      ...Money
    }
    variant {
      ...ProductVariant
    }
  }

  query orderById(
    $customerAccessToken: String!
    $orderId: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderId) {
        nodes {
          id
          name
          orderNumber
          processedAt
          fulfillmentStatus
          totalTaxV2 {
            ...Money
          }
          totalPriceV2 {
            ...Money
          }
          subtotalPriceV2 {
            ...Money
          }
          shippingAddress {
            ...AddressFull
          }
          discountApplications(first: 100) {
            nodes {
              ...DiscountApplication
            }
          }
          lineItems(first: 100) {
            nodes {
              ...LineItemFull
            }
          }
        }
      }
    }
  }
`;
