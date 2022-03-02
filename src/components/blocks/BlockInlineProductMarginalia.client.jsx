import {
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen/client';
import {useProductsContext} from '../../contexts/ProductsProvider.client';
import {getProductVariant} from '../../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../ButtonSelectedVariantBuyNow.client';
import LinkProduct from '../LinkProduct.client';

const BlockInlineProductMarginalia = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);
  // Return nothing if no valid product is found
  if (!storefrontProduct) {
    return null;
  }

  const currentVariant = getProductVariant(
    storefrontProduct,
    product?.variantId,
  );

  if (!currentVariant) {
    return null;
  }

  return (
    <ProductProvider
      data={storefrontProduct}
      initialVariantId={currentVariant.id}
    >
      <>
        <div className="absolute border border-gray-500 left-full ml-10 p-4 top-0 w-48">
          <div className="text-sm">
            <LinkProduct
              handle={storefrontProduct.handle}
              variantId={product?.variantId}
            >
              <ProductTitle className="font-medium" />
            </LinkProduct>
            <ProductPrice />
          </div>
          {currentVariant?.image && (
            <Image
              className="my-4 w-full"
              data={currentVariant.image}
              options={{
                crop: 'center',
                height: 300,
                width: 300,
              }}
            />
          )}
          {node?.action === 'addToCart' && (
            <ButtonSelectedVariantAddToCart small />
          )}
          {node?.action === 'buyNow' && <ButtonSelectedVariantBuyNow small />}
        </div>
      </>
    </ProductProvider>
  );
};

export default BlockInlineProductMarginalia;
