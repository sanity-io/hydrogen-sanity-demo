import {LightningBoltIcon, ShoppingCartIcon} from '@heroicons/react/outline';
import {
  AddToCartButton,
  BuyNowButton,
  ProductProvider,
} from '@shopify/hydrogen/client';
import {useProductsContext} from '../../contexts/ProductsProvider.client';
import {getProductVariant} from '../../utils/getProductVariant';

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
            <span>
              <ShoppingCartIcon className="h-4 ml-0.5 w-4" />
            </span>
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
