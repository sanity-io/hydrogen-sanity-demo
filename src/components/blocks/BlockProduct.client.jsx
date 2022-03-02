import {
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen/client';
import React from 'react';
import {useProductsContext} from '../../contexts/ProductsProvider.client';
import {getProductVariant} from '../../utils/getProductVariant';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import LinkProduct from '../LinkProduct.client';

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
        <div className="border border-gray-400 p-4 space-y-4 w-1/2">
          {/* Product and price */}
          <div>
            <LinkProduct
              handle={storefrontProduct.handle}
              variantId={product?.variantId}
            >
              <ProductTitle className="font-medium" />
            </LinkProduct>
            <ProductPrice />
          </div>
          {/* Image */}
          {currentVariant?.image && (
            <Image
              className="w-full"
              data={currentVariant.image}
              options={{crop: 'center', width: 500}}
            />
          )}
          <ButtonSelectedVariantAddToCart />
        </div>
        {/* Caption */}
        {props?.node?.caption && (
          <div className="text-gray-400 text-sm mt-2">
            {props?.node?.caption}
          </div>
        )}
      </div>
    </ProductProvider>
  );
};

export default BlockProduct;
