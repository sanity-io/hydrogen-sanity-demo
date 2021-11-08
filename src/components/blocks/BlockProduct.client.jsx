import {Product} from '@shopify/hydrogen/client';
import React from 'react';
import {encode} from 'shopify-gid';

import {useProductsContext} from '../../contexts/ProductsContext.client';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import LinkProduct from '../LinkProduct.client';

const BlockProduct = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

  if (!storefrontProduct) {
    return null;
  }

  const encodedVariantId = encode('ProductVariant', product?.variantId);
  const productUrl = `/products/${storefrontProduct.handle}?variant=${product?.variantId}`;

  return (
    <Product initialVariantId={encodedVariantId} product={storefrontProduct}>
      <div className="my-8">
        <div className="border border-black p-4 space-y-4 w-1/2">
          <div>
            <LinkProduct to={productUrl} variantId={product?.variantId}>
              <Product.Title className="font-medium" />
            </LinkProduct>
            <Product.Price />
          </div>
          <Product.SelectedVariant.Image
            className="w-full"
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
    </Product>
  );
};

export default BlockProduct;
