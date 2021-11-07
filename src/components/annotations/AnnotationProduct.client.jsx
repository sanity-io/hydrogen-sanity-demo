import {Product} from '@shopify/hydrogen/client';

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
    <Product product={product} initialVariantId={productVariant?.id}>
      {mark?.action === 'addToCart' && (
        <Product.SelectedVariant.AddToCartButton quantity={mark?.quantity || 1}>
          <span className="bg-gray-200 p-1 rounded-sm">
            {children} <span className="font-semibold text-xs"></span>
          </span>
        </Product.SelectedVariant.AddToCartButton>
      )}

      {mark?.action === 'buyNow' && (
        <Product.SelectedVariant.BuyNowButton
          quantity={mark?.quantity || 1}
          variantId={productVariant?.id}
        >
          <span className="bg-gray-700 p-1 rounded-sm text-white">
            {children} <span className="font-semibold text-xs"></span>
          </span>
        </Product.SelectedVariant.BuyNowButton>
      )}
    </Product>
  );
};

export default AnnotationProduct;
