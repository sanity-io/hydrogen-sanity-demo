import {
  BuyNowButton,
  ProductProvider,
  SelectedVariantAddToCartButton,
} from '@shopify/hydrogen/client';

import {useProductsContext} from '../../contexts/ProductsContext.client';

const AnnotationProduct = (props) => {
  const {children, mark} = props;

  const productId = mark?.product?._id;

  const product = useProductsContext(productId);
  // Return text only if no valid product is found
  if (!product) {
    return children;
  }

  const productVariant = product?.variants?.edges[0]?.node;
  const availableForSale = productVariant?.availableForSale;

  // Return text only (with strikethrough + sold out prefix) if no longer available for sale
  if (!availableForSale) {
    return (
      <span className="text-red-500 line-through">{children} (sold out)</span>
    );
  }

  return (
    <ProductProvider product={product} initialVariantId={productVariant?.id}>
      {mark?.action === 'addToCart' && (
        <SelectedVariantAddToCartButton quantity={mark?.quantity || 1}>
          <span className="bg-gray-200 p-1 rounded-sm">
            {children}{' '}
            <span className="font-semibold text-xs">({mark.action})</span>
          </span>
        </SelectedVariantAddToCartButton>
      )}

      {mark?.action === 'buyNow' && (
        <BuyNowButton
          quantity={mark?.quantity || 1}
          variantId={productVariant?.id}
        >
          <span className="bg-gray-700 p-1 rounded-sm text-white">
            {children}{' '}
            <span className="font-semibold text-xs">({mark.action})</span>
          </span>
        </BuyNowButton>
      )}
    </ProductProvider>
  );
};

export default AnnotationProduct;
