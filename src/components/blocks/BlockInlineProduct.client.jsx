import {
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen/client';
import Tippy from '@tippyjs/react/headless';
import {useProductsContext} from '../../contexts/ProductsProvider.client';
import {getProductVariant} from '../../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../ButtonSelectedVariantBuyNow.client';
import LinkProduct from '../LinkProduct.client';

const BlockInlineProduct = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);
  // Return text only if no valid product is found
  if (!storefrontProduct) {
    return '(Product not found)';
  }

  const currentVariant = getProductVariant(
    storefrontProduct,
    product?.variantId,
  );

  if (!currentVariant) {
    return null;
  }

  const productTitle = storefrontProduct?.title;

  return (
    <Tippy
      interactive
      placement="top"
      render={(attrs) => (
        <ProductProvider
          data={storefrontProduct}
          initialVariantId={currentVariant.id}
        >
          <div
            className="bg-white border border-black p-2 text-sm"
            tabIndex="-1"
            {...attrs}
          >
            <div className="w-44">
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
                  className="my-2 w-full"
                  data={currentVariant.image}
                  options={{
                    width: 300,
                    height: 250,
                    crop: 'center',
                  }}
                />
              )}
              {node?.action === 'addToCart' && (
                <ButtonSelectedVariantAddToCart small />
              )}
              {node?.action === 'buyNow' && (
                <ButtonSelectedVariantBuyNow small />
              )}
            </div>
          </div>
        </ProductProvider>
      )}
    >
      <span>
        <LinkProduct
          className="border-dotted duration-300 hover:opacity-60 inline-flex font-medium items-center text-blue-500 whitespace-nowrap"
          handle={storefrontProduct.handle}
          variantId={product?.variantId}
        >
          {productTitle}
        </LinkProduct>
      </span>
    </Tippy>
  );
};

export default BlockInlineProduct;
