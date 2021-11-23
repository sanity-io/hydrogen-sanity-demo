import {Product} from '@shopify/hydrogen/client';

import {encode} from '../utils/shopifyGid';

import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import LinkProduct from './LinkProduct.client';

const ProductCard = (props) => {
  const {product} = props;

  if (!product.storefront) {
    return null;
  }

  const encodedVariantId = encode('ProductVariant', product?.variantId);

  return (
    <Product product={product.storefront} initialVariantId={encodedVariantId}>
      <div className="bg-white col-span-2 group">
        {/* Image */}
        <div className="overflow-hidden relative">
          <div className="aspect-w-6 aspect-h-4 bg-gray-100">
            <LinkProduct handle={product?.slug} variantId={product?.variantId}>
              <Product.SelectedVariant.Image
                className="absolute h-full object-cover w-full"
                options={{width: 800}}
              />
            </LinkProduct>
          </div>
          {/* Quick add to cart button */}
          <div className="absolute bottom-0 duration-300 group-hover:translate-y-0 left-0 transform-gpu transition-transform translate-y-full w-full">
            <ButtonSelectedVariantAddToCart />
          </div>
        </div>

        {/* Title */}
        <div className="font-medium mt-2">
          <LinkProduct handle={product?.slug} variantId={product?.variantId}>
            <Product.Title />
          </LinkProduct>
        </div>
        <div className="flex items-center">
          <Product.SelectedVariant.Price className="text-gray-900" />
          <Product.SelectedVariant.Price
            priceType="compareAt"
            className="ml-1 text-gray-400 line-through"
          />
        </div>
      </div>
    </Product>
  );
};

export default ProductCard;
