import {
  AddToCartButton,
  BuyNowButton,
  ProductProvider,
} from '@shopify/hydrogen/client';
import {getProductVariant} from '../../utils/getProductVariant';
import {useProductsContext} from '../ProductsProvider.client';

const AnnotationProduct = (props) => {
  const {children, mark} = props;

  const product = mark?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

  // Return text only if no valid product is found
  if (!storefrontProduct) {
    return children;
  }

  const currentVariant = getProductVariant(
    storefrontProduct,
    product?.variantId,
  );

  const availableForSale = currentVariant?.availableForSale;

  // Return text only if no longer available for sale or if variant isn't accessible
  if (!availableForSale || !currentVariant) {
    return children;
  }

  return (
    <ProductProvider
      data={storefrontProduct}
      initialVariantId={currentVariant.id}
    >
      {mark?.action === 'addToCart' && (
        <AddToCartButton
          quantity={mark?.quantity || 1}
          variantId={currentVariant.id}
        >
          <span className="duration-300 flex font-medium hover:opacity-60 items-center text-blue-500 underline">
            {children}
            {/* TODO: remove */}
            <span>(cart icon)</span>
          </span>
        </AddToCartButton>
      )}
      {mark?.action === 'buyNow' && (
        <BuyNowButton
          quantity={mark?.quantity || 1}
          variantId={currentVariant.id}
        >
          <span className="duration-300 flex font-medium hover:opacity-60 items-center text-blue-500 underline">
            {children}
            {/* TODO: remove */}
            <span>(bolt icon)</span>
          </span>
        </BuyNowButton>
      )}
    </ProductProvider>
  );
};

export default AnnotationProduct;
