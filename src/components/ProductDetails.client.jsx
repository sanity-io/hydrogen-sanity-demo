import {
  flattenConnection,
  ProductDescription,
  ProductPrice,
  ProductProvider,
  ProductTitle,
  useProduct,
} from '@shopify/hydrogen/client';
import ButtonSelectedVariantAddToCart from './ButtonSelectedVariantAddToCart.client';
import ButtonSelectedVariantBuyNow from './ButtonSelectedVariantBuyNow.client';
import DebugWrapper from './DebugWrapper';
import Gallery from './Gallery.client';
import ProductMetafields from './ProductMetafields.client';
import ProductOptions from './ProductOptions.client';

function ProductActions() {
  const {selectedVariant} = useProduct();
  const isOutOfStock = !selectedVariant.availableForSale;

  return (
    <DebugWrapper name="Product Actions" shopify>
      <div className="space-y-2">
        <ButtonSelectedVariantAddToCart available={!isOutOfStock} />

        {!isOutOfStock && <ButtonSelectedVariantBuyNow />}
      </div>
    </DebugWrapper>
  );
}

function ProductPrices() {
  const product = useProduct();

  return (
    <>
      <ProductPrice
        className="font-semibold line-through"
        priceType="compareAt"
        variantId={product.selectedVariant.id}
      />
      <ProductPrice
        className="font-semibold"
        variantId={product.selectedVariant.id}
      />
    </>
  );
}

export default function ProductDetails({product}) {
  const initialVariant = flattenConnection(product.variants)[0];

  return (
    <DebugWrapper name="Product Details" shopify>
      <ProductProvider data={product} initialVariantId={initialVariant.id}>
        <div className="mb-16 grid grid-cols-1 gap-x-8 md:grid-cols-[2fr,1fr]">
          {/* Mobile */}
          <div className="md:hidden">
            {/* Title */}
            <ProductTitle as="h1" className="font-medium" />
            {/* Vendor */}
            {product.vendor && <div>{product.vendor}</div>}
            {/* Prices */}
            <div className="flex justify-between md:block">
              <ProductPrices />
            </div>
          </div>

          <Gallery />

          {/* Desktop */}
          <div>
            <div className="hidden md:block">
              {/* Title */}
              <ProductTitle as="h1" className="font-medium" />
              {/* Vendor */}
              {product.vendor && <div>{product.vendor}</div>}
              {/* Prices */}
              <ProductPrices />
            </div>

            {/* Product Options */}
            <ProductOptions />

            {/* Product Metafields */}
            <ProductMetafields />

            {/* Actions */}
            <ProductActions />

            {/* Product Description */}
            <DebugWrapper name="Product Description" shopify>
              <ProductDescription className="prose" />
            </DebugWrapper>
          </div>
        </div>
      </ProductProvider>
    </DebugWrapper>
  );
}
