import {Image, ProductPrice, ProductProvider} from '@shopify/hydrogen';
import Tippy from '@tippyjs/react/headless';
import {getProductVariant} from '../../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from '../buttons/ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../buttons/ButtonSelectedVariantBuyNow.client';
import LinkProduct from '../LinkProduct.client';
import {useProductsContext} from '../product/ProductsProvider.client';

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
            className="border border-black bg-white p-2 text-sm"
            tabIndex="-1"
            {...attrs}
          >
            <div className="w-44">
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
                  className="my-2 w-full"
                  data={currentVariant.image}
                  loaderOptions={{
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
          className="inline-flex items-center whitespace-nowrap border-dotted font-medium text-blue-500 duration-300 hover:opacity-60"
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
