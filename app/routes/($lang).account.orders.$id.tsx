import {useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  Image,
  Money,
  SeoHandleFunction,
} from '@shopify/hydrogen';
import type {
  DiscountApplicationConnection,
  Order,
  OrderLineItem,
} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderArgs, redirect} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {ReactNode} from 'react';
import invariant from 'tiny-invariant';

import {Link} from '~/components/Link';
import {notFound, statusMessage} from '~/lib/utils';

export const seo: SeoHandleFunction = ({data}) => ({
  title: `Order ${data?.order?.name}`,
});

export const handle = {
  seo,
};

export async function loader({request, context, params}: LoaderArgs) {
  if (!params.id) {
    return redirect(params?.lang ? `${params.lang}/account` : '/account');
  }

  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');

  invariant(orderToken, 'Order token is required');

  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect(
      params.lang ? `${params.lang}/account/login` : '/account/login',
    );
  }

  const orderId = `gid://shopify/Order/${params.id}?key=${orderToken}`;

  const data = await context.storefront.query<{node: Order}>(
    CUSTOMER_ORDER_QUERY,
    {variables: {orderId}},
  );

  const order = data?.node;

  if (!order) {
    throw notFound('Order not found');
  }

  const lineItems = flattenConnection(order.lineItems!) as Array<OrderLineItem>;

  const discountApplications = flattenConnection(
    order.discountApplications as DiscountApplicationConnection,
  );

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

export default function OrderRoute() {
  const {order, lineItems, discountValue, discountPercentage} =
    useLoaderData<typeof loader>();
  return (
    <>
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
                  {/* @ts-ignore */}
                  {lineItems.map((lineItem: OrderLineItem) => (
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
                                  data={lineItem.variant.image!}
                                  width={lineItem.variant.image.width!}
                                  height={lineItem.variant.image.height!}
                                  alt={lineItem.variant.image.altText!}
                                  crop="center"
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
                                <Money data={lineItem.variant!.price!} />
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
                        <Money data={lineItem.variant!.price!} />
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
                        className="font-normal hidden pl-6 pr-3 pt-6 text-right sm:table-cell md:pl-0"
                      >
                        <p>Discounts</p>
                      </th>
                      <th
                        scope="row"
                        className="font-normal pr-3 pt-6 text-left sm:hidden"
                      >
                        <p>Discounts</p>
                      </th>
                      <td className="pl-3 pr-4 pt-6 text-right font-medium text-green-700 md:pr-3">
                        {discountPercentage ? (
                          <span className="text-sm">
                            -{discountPercentage}% off
                          </span>
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
                      className="font-normal hidden pl-6 pr-3 pt-6 text-right sm:table-cell md:pl-0"
                    >
                      <p>Subtotal</p>
                    </th>
                    <th
                      scope="row"
                      className="font-normal pr-3 pt-6 text-left sm:hidden"
                    >
                      <p>Subtotal</p>
                    </th>
                    <td className="pl-3 pr-4 pt-6 text-right md:pr-3">
                      <Money data={order.subtotalPrice!} />
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="font-normal hidden pl-6 pr-3 pt-4 text-right sm:table-cell md:pl-0"
                    >
                      Tax
                    </th>
                    <th
                      scope="row"
                      className="font-normal pr-3 pt-4 text-left sm:hidden"
                    >
                      <p>Tax</p>
                    </th>
                    <td className="pl-3 pr-4 pt-4 text-right md:pr-3">
                      <Money data={order.totalTax!} />
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pl-6 pr-3 pt-4 text-right font-bold sm:table-cell md:pl-0"
                    >
                      Total
                    </th>
                    <th
                      scope="row"
                      className="pr-3 pt-4 text-left font-bold sm:hidden"
                    >
                      <p>Total</p>
                    </th>
                    <td className="pl-3 pr-4 pt-4 text-right font-bold md:pr-3">
                      <Money data={order.totalPrice!} />
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="top-nav sticky border-none md:my-8">
                <h3 className="font-bold">Shipping Address</h3>
                {order?.shippingAddress ? (
                  <ul className="mt-6">
                    <li>
                      <p>
                        {order.shippingAddress.firstName &&
                          order.shippingAddress.firstName + ' '}
                        {order.shippingAddress.lastName}
                      </p>
                    </li>
                    {order?.shippingAddress?.formatted ? (
                      order.shippingAddress.formatted.map((line: string) => (
                        <li key={line}>
                          <p>{line}</p>
                        </li>
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
                  <p>{statusMessage(order.fulfillmentStatus!)}</p>
                </div>
              </div>
            </div>
          </div>
        </OrderSection>
      </div>
    </>
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

const CUSTOMER_ORDER_QUERY = `#graphql
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
    url: url(transform: {crop: CENTER, maxHeight: 96, maxWidth: 96, scale: 2})
    id
    width
  }
  fragment ProductVariant on ProductVariant {
    id
    image {
      ...Image
    }
    price {
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

  query CustomerOrder(
    $country: CountryCode
    $language: LanguageCode
    $orderId: ID!
  ) @inContext(country: $country, language: $language) {
    node(id: $orderId) {
      ... on Order {
        id
        name
        orderNumber
        processedAt
        fulfillmentStatus
        totalTax {
          ...Money
        }
        totalPrice {
          ...Money
        }
        subtotalPrice {
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
`;
