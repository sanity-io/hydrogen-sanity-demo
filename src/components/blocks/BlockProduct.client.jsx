import {Image, ProductPrice, ProductProvider} from '@shopify/hydrogen';
import React from 'react';
import {getProductVariant} from '../../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from '../buttons/ButtonSelectedVariantAddToCart.client';
import LinkProduct from '../LinkProduct.client';
import {useProductsContext} from '../product/ProductsProvider.client';

const BlockProduct = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

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
      <div className="mx-auto my-8">
        <div className="w-1/2 space-y-4 border border-gray p-4">
          {/* Product and price */}
          <div>
            <LinkProduct
              handle={storefrontProduct.handle}
              variantId={product?.variantId}
            >
              {storefrontProduct?.title && <div>{storefrontProduct.title}</div>}
            </LinkProduct>
            <ProductPrice />
          </div>
          {/* Image */}
          {currentVariant?.image && (
            <Image
              className="w-full"
              data={currentVariant.image}
              loaderOptions={{crop: 'center', width: 500}}
            />
          )}
          <ButtonSelectedVariantAddToCart />
        </div>
        {/* Caption */}
        {props?.node?.caption && (
          <div className="mt-2 text-sm text-darkGray">
            {props?.node?.caption}
          </div>
        )}
      </div>
    </ProductProvider>
  );
};

export default BlockProduct;
