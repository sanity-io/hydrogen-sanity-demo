import {Product, flattenConnection} from '@shopify/hydrogen/client';
import {LightningBoltIcon, ShoppingCartIcon} from '@heroicons/react/outline';

import {useProductsContext} from '../../contexts/ProductsContext.client';
import {encode} from '../../utils/shopifyGid';

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

  // Return text only if no longer available for sale
  if (!availableForSale) {
    return children;
  }

  return (
    <Product product={storefrontProduct} initialVariantId={selectedVariant.id}>
      {mark?.action === 'addToCart' && (
        <Product.SelectedVariant.AddToCartButton quantity={mark?.quantity || 1}>
          <span className="duration-300 flex font-medium hover:opacity-60 items-center text-blue-500 underline">
            {children}
            <span>
              <ShoppingCartIcon className="h-4 ml-0.5 w-4" />
            </span>
          </span>
        </Product.SelectedVariant.AddToCartButton>
      )}

      {mark?.action === 'buyNow' && (
        <Product.SelectedVariant.BuyNowButton quantity={mark?.quantity || 1}>
          <span className="duration-300 flex font-medium hover:opacity-60 items-center text-blue-500 underline">
            {children}
            <span>
              <LightningBoltIcon className="h-4 ml-0.5 w-4" />
            </span>
          </span>
        </Product.SelectedVariant.BuyNowButton>
      )}
    </Product>
  );
};

export default AnnotationProduct;
