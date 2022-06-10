import {
  gql,
  ProductProvider,
  useSession,
  useShop,
  useShopQuery,
} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import sanityConfig from '../../../sanity.config';
import {DEFAULT_BUTTON_STYLES} from '../../constants';
import {SanityModuleImage} from '../../types';
import Link from '../Link';
import SanityImage from '../SanityImage.client';
import ProductTag from '../tags/Product.client';

// TODO: refactor picked product + product variants

type ShopifyPayload = {
  products: Pick<Product, 'handle' | 'id' | 'options' | 'title' | 'vendor'>[];
  productVariants: Pick<
    ProductVariant,
    | 'availableForSale'
    | 'compareAtPriceV2'
    | 'id'
    | 'image'
    | 'priceV2'
    | 'selectedOptions'
    | 'title'
  >[];
};

type Props = {
  module: SanityModuleImage;
};

export default function ImageModule({module}: Props) {
  const image = module.image;

  if (!image) {
    return null;
  }

  // Conditionally fetch Shopify products if this is an image module of variant `products`
  let storefrontProducts: Pick<
    Product,
    'handle' | 'id' | 'options' | 'title' | 'vendor'
  >[];
  let storefrontProductVariants: Pick<
    ProductVariant,
    | 'availableForSale'
    | 'compareAtPriceV2'
    | 'id'
    | 'image'
    | 'priceV2'
    | 'title'
  >[];
  if (module.variant === 'products') {
    const {languageCode} = useShop();
    const {countryCode = 'US'} = useSession();
    const {data} = useShopQuery<ShopifyPayload>({
      query: QUERY,
      variables: {
        country: countryCode,
        ids: module.products.map((p) => p?.gid),
        language: languageCode,
        variantIds: module.products.map((p) => p.variantGid),
      },
    });
    storefrontProducts = data.products;
    storefrontProductVariants = data.productVariants;
  }

  const ImageContent = (
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

  return (
    <div>
      {module.variant === 'callToAction' && module.callToAction?.link ? (
        <Link className="group" link={module.callToAction.link}>
          {ImageContent}
        </Link>
      ) : (
        ImageContent
      )}

      {/* Caption */}
      {module.variant === 'caption' && module.caption && (
        <div className="mt-2 max-w-[35rem] text-sm text-darkGray">
          {module.caption}
        </div>
      )}
      {/* Products */}
      {module.variant === 'products' && (
        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-2">
          {module.products.map((product, index) => {
            // Add selected variant
            const storefrontProductVariant = storefrontProductVariants[index];
            const storefrontProductWithVariant = {
              ...storefrontProducts[index],
              variants: {
                edges: [
                  {
                    node: storefrontProductVariant,
                  },
                ],
              },
            };

            return (
              <ProductProvider
                data={storefrontProductWithVariant}
                initialVariantId={storefrontProductVariant.id}
                key={product._id}
              >
                <ProductTag key={product._key} />
              </ProductProvider>
            );
          })}
        </div>
      )}
    </div>
  );
}

const QUERY = gql`
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
          edges {
            node {
              availableForSale
            }
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
