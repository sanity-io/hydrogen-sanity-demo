import {Product} from '@shopify/hydrogen/client';
import {encode} from 'shopify-gid';

import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import LinkProduct from './LinkProduct.client';

const ProductCard = (props) => {
  const {product} = props;

  if (!product.storefront) {
    return null;
  }

  const encodedVariantId = encode('ProductVariant', product?.variantId);
  const productUrl = `/products/${product?.slug}?variant=${product?.variantId}`;

  return (
    <Product product={product.storefront} initialVariantId={encodedVariantId}>
      <div className="bg-white col-span-2 group">
        {/* Image */}
        <div className="overflow-hidden relative">
          <div className="aspect-w-6 aspect-h-4">
            <LinkProduct to={productUrl} variantId={product?.variantId}>
              <Product.SelectedVariant.Image className="absolute h-full object-cover w-full" />
            </LinkProduct>
          </div>
          {/* Quick add to cart button */}
          <div className="absolute bottom-0 duration-300 group-hover:translate-y-0 left-0 transform-gpu transition-transform translate-y-full w-full">
            <ButtonSelectedVariantAddToCart />
          </div>
        </div>

        {/* Title */}
        <div className="font-medium mt-2">
          <LinkProduct to={productUrl} variantId={product?.variantId}>
            <Product.Title />
          </LinkProduct>
        </div>
        <div className="flex items-center">
          <Product.SelectedVariant.Price className="text-gray-900">
            {({currencyCode, amount, currencyNarrowSymbol}) => {
              return (
                <span>{`${currencyCode} ${currencyNarrowSymbol}${amount}`}</span>
              );
            }}
          </Product.SelectedVariant.Price>
          <Product.SelectedVariant.Price
            priceType="compareAt"
            className="ml-1 text-gray-400 line-through"
          >
            {({amount, currencyNarrowSymbol}) => {
              return <span>{`${currencyNarrowSymbol}${amount}`}</span>;
            }}
          </Product.SelectedVariant.Price>
        </div>
      </div>
    </Product>
  );
};

export default ProductCard;
