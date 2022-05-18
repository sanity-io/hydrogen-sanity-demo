import {
  AddToCartButton,
  BuyNowButton,
  flattenConnection,
  ProductDescription,
  ProductPrice,
  ProductProvider,
  ProductTitle,
  useProduct,
} from '@shopify/hydrogen/client';
import {
  BUTTON_PRIMARY_CLASSES,
  BUTTON_SECONDARY_CLASSES,
} from './Button.client';
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
        <AddToCartButton
          className={BUTTON_PRIMARY_CLASSES}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of stock' : 'Add to bag'}
        </AddToCartButton>
        {!isOutOfStock && (
          <BuyNowButton
            variantId={selectedVariant.id}
            className={BUTTON_SECONDARY_CLASSES}
          >
            Buy it now
          </BuyNowButton>
        )}
      </div>
    </DebugWrapper>
  );
}

function ProductPrices() {
  const product = useProduct();

  return (
    <>
      <ProductPrice
        className="line-through font-semibold"
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
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-x-8 mb-16">
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
            {/* <ProductMetafields /> */}

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
