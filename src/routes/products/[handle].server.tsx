import {
  flattenConnection,
  ProductProvider,
  Seo,
  useRouteParams,
  useSession,
} from '@shopify/hydrogen';
import {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import clientConfig from '../../../sanity.config';
import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import ProductHero from '../../components/ProductHero.client';
import ProductEditorial from '../../components/ProductEditorial.server';
import RelatedProducts from '../../components/RelatedProducts.server';
import {PRODUCT_PAGE} from '../../fragments/productPage';
import type {SanityProduct} from '../../types';

type SanityPayload = {
  sanityData: SanityProduct;
  shopifyProducts: Record<string, Product>;
};

export default function ProductRoute() {
  const {handle} = useRouteParams();
  const {countryCode = 'US'} = useSession();

  // TODO: add `preload` support to `useSanityQuery`
  const {sanityData: sanityProduct, shopifyProducts} = useSanityQuery({
    clientConfig,
    params: {
      slug: handle,
    },
    query: QUERY,
    shopifyVariables: {
      country: countryCode,
    },
  }) as SanityPayload;

  const storefrontProduct = shopifyProducts?.[sanityProduct?._id];

  if (!sanityProduct || !storefrontProduct) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const initialVariant = flattenConnection(
    storefrontProduct.variants,
  )[0] as ProductVariant;

  return (
    <Layout colorTheme={sanityProduct?.colorTheme}>
      <ProductProvider
        data={storefrontProduct}
        initialVariantId={initialVariant.id}
      >
        <ProductHero sanityProduct={sanityProduct} />
        <ProductDetails />
        <ProductEditorial sanityProduct={sanityProduct} />
        <RelatedProducts storefrontProduct={storefrontProduct} />
      </ProductProvider>

      <Seo type="product" data={storefrontProduct} />
    </Layout>
  );
}

const QUERY = groq`
  *[
    _type == 'product'
    && store.slug.current == $slug
  ][0]{
    ${PRODUCT_PAGE}
  }
`;
