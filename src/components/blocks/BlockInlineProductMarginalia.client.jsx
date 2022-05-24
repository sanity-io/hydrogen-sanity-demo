import {Image, ProductPrice, ProductProvider} from '@shopify/hydrogen';
import {getProductVariant} from '../../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../ButtonSelectedVariantBuyNow.client';
import LinkProduct from '../LinkProduct.client';
import {useProductsContext} from '../ProductsProvider.client';

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
        <div className="absolute left-full top-0 ml-10 w-48 border border-gray-500 p-4">
          <div className="text-sm">
            <LinkProduct
              handle={storefrontProduct.handle}
              variantId={product?.variantId}
            >
              {storefrontProduct?.title && (
                <div className="font-medium">{storefrontProduct.title}</div>
              )}
            </LinkProduct>
            <ProductPrice />
          </div>
          {currentVariant?.image && (
            <Image
              className="my-4 w-full"
              data={currentVariant.image}
              loaderOptions={{
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
