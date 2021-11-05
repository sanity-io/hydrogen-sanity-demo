import {
  Link,
  Product,
  ProductProvider,
  SelectedVariantImage,
  SelectedVariantPrice,
} from '@shopify/hydrogen/client';

import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';

const ProductCard = (props) => {
  const {product} = props;

  if (!product.storefront) {
    return null;
  }

  const firstVariant = product.storefront?.variants?.edges[0]?.node;
  const productUrl = `/products/${product?.slug}`;

  return (
    <ProductProvider
      product={product.storefront}
      initialVariantId={firstVariant.id}
    >
      <div className="bg-white col-span-2 group">
        {/* Image */}
        <div className="relative">
          <Link to={productUrl}>
            <SelectedVariantImage />
          </Link>

          {/* Quick add to cart button */}
          <div className="absolute bottom-0 group-hover:block hidden left-0 w-full">
            <ButtonSelectedVariantAddToCart />
          </div>
        </div>
        {/* Title */}
        <Link to={productUrl}>
          <div className="font-medium mt-2">
            <Product.Title />
          </div>
        </Link>

        <div className="flex items-center">
          <SelectedVariantPrice className="text-gray-900">
            {({currencyCode, amount, currencyNarrowSymbol}) => {
              return (
                <span>{`${currencyCode} ${currencyNarrowSymbol}${amount}`}</span>
              );
            }}
          </SelectedVariantPrice>
          <SelectedVariantPrice
            priceType="compareAt"
            className="ml-1 text-gray-400 line-through"
          >
            {({amount, currencyNarrowSymbol}) => {
              return <span>{`${currencyNarrowSymbol}${amount}`}</span>;
            }}
          </SelectedVariantPrice>
        </div>
      </div>
    </ProductProvider>
  );
};

export default ProductCard;
