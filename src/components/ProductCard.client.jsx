import {Link, Product} from '@shopify/hydrogen/client';

import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';

const ProductCard = (props) => {
  const {product} = props;

  if (!product.storefront) {
    return null;
  }

  const firstVariant = product.storefront?.variants?.edges[0]?.node;
  const productUrl = `/products/${product?.slug}`;

  return (
    <Product product={product.storefront} initialVariantId={firstVariant.id}>
      <div className="bg-white col-span-2 group">
        {/* Image */}
        <div className="overflow-hidden relative">
          <div className="aspect-w-6 aspect-h-4">
            <Link to={productUrl}>
              <Product.SelectedVariant.Image className="absolute h-full object-cover w-full" />
            </Link>
          </div>
          {/* Quick add to cart button */}
          <div className="absolute bottom-0 duration-300 group-hover:translate-y-0 left-0 transform-gpu transition-transform translate-y-full w-full">
            <ButtonSelectedVariantAddToCart />
          </div>
        </div>

        {/* Title */}
        <div className="font-medium mt-2">
          <Link to={productUrl}>
            <Product.Title />
          </Link>
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
