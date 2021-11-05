import {MediaFile, Product, ProductProvider} from '@shopify/hydrogen/client';
import React from 'react';

import {useProductsContext} from '../../contexts/ProductsContext.client';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';

const BlockProduct = (props) => {
  const productId = props?.node?.product?._id;

  const product = useProductsContext(productId);

  if (!product) {
    return null;
  }

  const productVariant = product?.variants?.edges[0]?.node;

  return (
    <ProductProvider initialVariantId={productVariant.id} product={product}>
      <div className="my-8">
        <div className="border border-black p-4 space-y-4 w-1/2">
          <>
            <Product.Title className="font-medium" />
            <Product.Price />
          </>
          <MediaFile
            className="w-full"
            media={{
              mediaContentType: 'IMAGE',
              image: productVariant?.image,
            }}
            options={{
              height: '700',
              crop: 'center',
            }}
          />
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
