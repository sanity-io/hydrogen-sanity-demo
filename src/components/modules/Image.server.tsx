import {gql, useSession, useShop, useShopQuery} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import sanityConfig from '../../../sanity.config';
import {DEFAULT_BUTTON_STYLES} from '../../constants';
import type {ProductWithNodes, SanityModuleImage} from '../../types';
import Link from '../elements/Link';
import SanityImage from '../media/SanityImage.client';
import ProductTag from '../product/Tag.client';

type ShopifyPayload = {
  products: Partial<Product>[];
  productVariants: Partial<ProductVariant>[];
};

type Props = {
  module: SanityModuleImage;
};

export default function ImageModule({module}: Props) {
  if (!module.image) {
    return null;
  }

  // Conditionally fetch Shopify products if this is an image module of variant `products`
  let storefrontProducts: ProductWithNodes[];
  if (module.variant === 'products') {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        country: countryCode,
        ids: module.products.map((p) => p.gid),
        language: languageCode,
        variantIds: module.products.map((p) => p.variantGid),
      },
    });
    // Attach variant nodes
    storefrontProducts = data.products.map((product, index) => {
      const productVariant = data.productVariants[index];
      return {
        ...product,
        variants: {nodes: [productVariant as ProductVariant]},
      };
    });
  }

  return (
    <div>
      {module.variant === 'callToAction' && module.callToAction?.link ? (
        <Link className="group" link={module.callToAction.link}>
          <ImageContent module={module} />
        </Link>
      ) : (
        <ImageContent module={module} />
      )}

      {/* Caption */}
      {module.variant === 'caption' && module.caption && (
        <div className="mt-2 max-w-[35rem] text-sm leading-caption text-darkGray">
          {module.caption}
        </div>
      )}
      {/* Products */}
      {module.variant === 'products' && (
        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
          {module.products.map((product, index) => (
            <ProductTag
              key={product._key}
              storefrontProduct={storefrontProducts[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ImageContent = ({module}: Props) => {
  const image = module.image;

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded duration-500 ease-out',
        'group-hover:rounded-xl',
      )}
    >
      <SanityImage
        crop={image?.crop}
        dataset={sanityConfig.dataset}
        hotspot={image?.hotspot}
        layout="responsive"
        projectId={sanityConfig.projectId}
        sizes={['50vw, 100vw']}
        src={image?.asset._ref}
      />

      {/* Call to action */}
      {module.variant === 'callToAction' && (
        <div
          className={clsx(
            'absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 duration-500 ease-out',
            'group-hover:bg-opacity-30',
          )}
        >
          <div className="mt-[1em] flex flex-col items-center gap-5">
            {/* Title */}
            <div
              className={clsx(
                'max-w-[30rem] text-xl text-white', //
                'lg:text-2xl',
                'xl:text-3xl',
              )}
            >
              {module.callToAction?.title}
            </div>

            {/* Button */}
            {module.callToAction?.link && (
              <div
                className={clsx(
                  DEFAULT_BUTTON_STYLES,
                  'pointer-events-none bg-white text-offBlack',
                )}
              >
                {module.callToAction.title}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const QUERY_SHOPIFY = gql`
  query products(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
    $variantIds: [ID!]!
  ) @inContext(country: $country, language: $language) {
    products: nodes(ids: $ids) {
      ... on Product {
        handle
        id
        options {
          name
          values
        }
        title
        variants(first: 1) {
          nodes {
            availableForSale
          }
        }
        vendor
      }
    }
    productVariants: nodes(ids: $variantIds) {
      ... on ProductVariant {
        availableForSale
        compareAtPriceV2 {
          amount
          currencyCode
        }
        id
        image {
          altText
          height
          id
          url
          width
        }
        priceV2 {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        title
      }
    }
  }
`;
