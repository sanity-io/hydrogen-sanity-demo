import {Image, Link} from '@shopify/hydrogen';
import {OrderWithNodes} from '../../types';
import {getOrderStatusMessage} from '../../utils/getOrderStatusMessage';
import Badge from '../elements/Badge';

type Props = {
  order?: OrderWithNodes;
};

export function OrderCard({order}: Props) {
  if (!order?.id) return null;
  const legacyOrderId = order!.id!.split('/').pop()!.split('?')[0];

  const lineItems = order?.lineItems?.nodes;

  return (
    <li className="flex flex-col rounded border border-darkGray/50 p-4">
      {/* Fulfillment status */}
      <div className="mb-1 inline-flex">
        <Badge
          mode="outline"
          label={getOrderStatusMessage(order.fulfillmentStatus)}
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
            loaderOptions={{scale: 2, crop: 'center'}}
            width={168}
            widths={[168]}
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
          to={`/account/orders/${legacyOrderId}`}
        >
          View details
        </Link>
      </div>
    </li>
  );
}
