import {Product, flattenConnection} from '@shopify/hydrogen/client';
import {encode} from 'shopify-gid';

import {useProductsContext} from '../../contexts/ProductsContext.client';

const AnnotationProduct = (props) => {
  const {children, mark} = props;

  const product = mark?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

  // Return text only if no valid product is found
  if (!storefrontProduct) {
    return children;
  }

  const encodedVariantId = encode('ProductVariant', product?.variantId);

  const variants = flattenConnection(storefrontProduct.variants);
  const selectedVariant = variants?.find(
    (variant) => variant.id === encodedVariantId,
  );

  const availableForSale = selectedVariant?.availableForSale;

  // Return text only (with strikethrough + sold out prefix) if no longer available for sale
  if (!availableForSale) {
    return (
      <span className="text-red-500 line-through">{children} (sold out)</span>
    );
  }

  return (
    <Product product={storefrontProduct} initialVariantId={selectedVariant.id}>
      {mark?.action === 'addToCart' && (
        <Product.SelectedVariant.AddToCartButton quantity={mark?.quantity || 1}>
          <span className="bg-gray-200 p-1 rounded-sm">
            {children} <span className="font-semibold text-xs"></span>
          </span>
        </Product.SelectedVariant.AddToCartButton>
      )}

      {mark?.action === 'buyNow' && (
        <Product.SelectedVariant.BuyNowButton quantity={mark?.quantity || 1}>
          <span className="bg-gray-700 p-1 rounded-sm text-white">
            {children} <span className="font-semibold text-xs"></span>
          </span>
        </Product.SelectedVariant.BuyNowButton>
      )}
    </Product>
  );
};

export default AnnotationProduct;
