import {Product} from '@shopify/hydrogen/client';
import Tippy from '@tippyjs/react/headless';
import {encode} from 'shopify-gid';

import {useProductsContext} from '../../contexts/ProductsContext.client';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from '../ButtonSelectedVariantBuyNow.client';
import LinkProduct from '../LinkProduct.client';

const BlockInlineLinkProduct = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);
  // Return text only if no valid product is found
  if (!storefrontProduct) {
    return '(Product not found)';
  }

  const encodedVariantId = encode('ProductVariant', product?.variantId);
  const productTitle = storefrontProduct?.title;
  const productUrl = `/products/${storefrontProduct.handle}?variant=${product?.variantId}`;

  return (
    <Tippy
      interactive
      placement="bottom"
      render={(attrs) => (
        <Product
          product={storefrontProduct}
          initialVariantId={encodedVariantId}
        >
          <div
            className="bg-white border border-black p-2 text-sm"
            tabIndex="-1"
            {...attrs}
          >
            <div className="w-44">
              <div className="text-sm">
                <LinkProduct to={productUrl} variantId={product?.variantId}>
                  <Product.Title className="font-medium" />
                </LinkProduct>
                <Product.Price />
              </div>
              <Product.SelectedVariant.Image
                className="my-2 w-full"
                options={{
                  height: '700',
                  crop: 'center',
                }}
              />
              {node?.action === 'addToCart' && (
                <ButtonSelectedVariantAddToCart small />
              )}
              {node?.action === 'buyNow' && (
                <ButtonSelectedVariantBuyNow small />
              )}
            </div>
          </div>
        </Product>
      )}
    >
      <span>
        <LinkProduct
          className="underline"
          to={productUrl}
          variantId={product?.variantId}
        >
          {productTitle}
        </LinkProduct>
      </span>
    </Tippy>
  );
};

export default BlockInlineLinkProduct;
