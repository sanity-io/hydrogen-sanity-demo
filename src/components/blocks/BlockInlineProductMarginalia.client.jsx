import {
  flattenConnection,
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen/client';
import {encode} from 'shopify-gid';
import {useProductsContext} from '../../contexts/ProductsProvider.client';
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

  // Obtain encoded product ID and current variant
  const productVariantIdEncoded = encode('ProductVariant', product?.variantId);
  const currentStorefrontVariant = flattenConnection(
    storefrontProduct.variants,
  )?.find((variant) => variant.id === productVariantIdEncoded);

  return (
    <ProductProvider
      data={storefrontProduct}
      initialVariantId={productVariantIdEncoded}
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
          <Image
            className="my-4 w-full"
            data={currentStorefrontVariant?.image}
            options={{
              crop: 'center',
              height: 300,
              width: 300,
            }}
          />
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
