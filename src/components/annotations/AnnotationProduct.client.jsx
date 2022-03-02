import {LightningBoltIcon, ShoppingCartIcon} from '@heroicons/react/outline';
import {
  AddToCartButton,
  BuyNowButton,
  flattenConnection,
  ProductProvider,
} from '@shopify/hydrogen/client';
import {encode} from 'shopify-gid';
import {useProductsContext} from '../../contexts/ProductsProvider.client';

const AnnotationProduct = (props) => {
  const {children, mark} = props;

  const product = mark?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

  // Return text only if no valid product is found
  if (!storefrontProduct) {
    return children;
  }

  // Obtain encoded product ID and current variant
  const productVariantIdEncoded = encode('ProductVariant', product?.variantId);
  const currentStorefrontVariant = flattenConnection(
    storefrontProduct.variants,
  )?.find((variant) => variant.id === productVariantIdEncoded);

  const availableForSale = currentStorefrontVariant?.availableForSale;

  // Return text only if no longer available for sale
  if (!availableForSale) {
    return children;
  }

  return (
    <ProductProvider
      data={storefrontProduct}
      initialVariantId={currentStorefrontVariant.id}
    >
      {mark?.action === 'addToCart' && (
        <AddToCartButton
          quantity={mark?.quantity || 1}
          variantId={currentStorefrontVariant.id}
        >
          <span className="duration-300 flex font-medium hover:opacity-60 items-center text-blue-500 underline">
            {children}
            <span>
              <ShoppingCartIcon className="h-4 ml-0.5 w-4" />
            </span>
          </span>
        </AddToCartButton>
      )}
      {mark?.action === 'buyNow' && (
        <BuyNowButton
          quantity={mark?.quantity || 1}
          variantId={currentStorefrontVariant.id}
        >
          <span className="duration-300 flex font-medium hover:opacity-60 items-center text-blue-500 underline">
            {children}
            <span>
              <LightningBoltIcon className="h-4 ml-0.5 w-4" />
            </span>
          </span>
        </BuyNowButton>
      )}
    </ProductProvider>
  );
};

export default AnnotationProduct;
