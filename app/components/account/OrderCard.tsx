import {flattenConnection, Image} from '@shopify/hydrogen';

import Badge from '~/components/elements/Badge';
import {Link} from '~/components/Link';
import {statusMessage} from '~/lib/utils';
import {OrderWithNodes} from '~/types/shopify';

type Props = {
  order?: OrderWithNodes;
};

export function OrderCard({order}: Props) {
  if (!order?.id) return null;
  const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?');
  const lineItems = flattenConnection(order?.lineItems);

  return (
    <li className="flex flex-col rounded border border-darkGray/50 p-4">
      {/* Fulfillment status */}
      <div className="mb-1 inline-flex">
        <Badge
          mode="outline"
          label={statusMessage(order.fulfillmentStatus)}
          small
        />
      </div>

      {/* Image */}
      {lineItems[0].variant?.image && (
        <div className="bg-primary/5 my-2 aspect-square overflow-hidden rounded-sm">
          <Image
            alt={lineItems[0].variant?.image?.altText ?? 'Order image'}
            className="fadeIn cover w-full"
            data={lineItems[0].variant?.image}
            height={168}
            crop="center"
            width={168}
          />
        </div>
      )}

      <ul className="mt-2 flex-1 flex-row space-y-1">
        <li className="font-bold">
          {new Date(order.processedAt).toDateString()}
        </li>
        <li>#{order.orderNumber}</li>
        <li>
          {lineItems.length > 1
            ? `${lineItems[0].title} +${lineItems.length - 1} more`
            : lineItems[0].title}
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-10 flex flex-row text-sm font-medium text-darkGray">
        <Link
          className="linkTextNavigation"
          to={`/account/orders/${legacyOrderId}?${key}`}
        >
          View details
        </Link>
      </div>
    </li>
  );
}
