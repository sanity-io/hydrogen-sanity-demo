import {Product} from '@shopify/hydrogen/client';
import React from 'react';

import {useProductsContext} from '../../contexts/ProductsContext.client';
import {formatGid} from '../../utils/shopifyGid';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import LinkProduct from '../LinkProduct.client';

const BlockProduct = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

  if (!storefrontProduct) {
    return null;
  }

  return (
    <Product
      initialVariantId={formatGid('ProductVariant', product?.variantId)}
      product={storefrontProduct}
    >
      <div className="mx-auto my-8">
        <div className="border border-gray-400 p-4 space-y-4 w-1/2">
          <div>
            <LinkProduct
              handle={storefrontProduct.handle}
              variantId={product?.variantId}
            >
              <Product.Title className="font-medium" />
            </LinkProduct>
            <Product.Price />
          </div>
          <Product.SelectedVariant.Image
            className="w-full"
            options={{
              crop: 'center',
              width: 500,
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
    </Product>
  );
};

export default BlockProduct;
