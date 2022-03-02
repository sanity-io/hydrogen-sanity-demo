import {
  flattenConnection,
  Image,
  ProductPrice,
  ProductProvider,
  ProductTitle,
} from '@shopify/hydrogen/client';
import React from 'react';
import {encode} from 'shopify-gid';
import {useProductsContext} from '../../contexts/ProductsProvider.client';
import ButtonSelectedVariantAddToCart from '../ButtonSelectedVariantAddToCart.client';
import LinkProduct from '../LinkProduct.client';

const BlockProduct = (props) => {
  const {node} = props;

  const product = node?.productWithVariant?.product;

  const storefrontProduct = useProductsContext(product?._id);

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
          <Image
            className="w-full"
            data={currentStorefrontVariant?.image}
            options={{crop: 'center', width: 500}}
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
