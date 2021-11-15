import {flattenConnection} from '@shopify/hydrogen';
import groq from 'groq';
import {useParams} from 'react-router-dom';
import {encode} from 'shopify-gid';
import {useSanityQuery} from 'hydrogen-plugin-sanity';

import Layout from '../../components/Layout.server';
import NotFound from '../../components/NotFound.server';
import ProductDetails from '../../components/ProductDetails.client';
import Seo from '../../components/Seo.client';
import ProductsProvider from '../../contexts/ProductsProvider.client';
import {PRODUCT_PAGE} from '../../fragments/productPage';

export default function Product(props) {
  const {handle} = useParams();
  const {sanityData: sanityProduct, shopifyProducts} = useSanityQuery({
    query: QUERY,
    params: {
      slug: handle,
    },
  });

  const storefrontProduct = shopifyProducts?.[sanityProduct?._id];

  if (!sanityProduct || !storefrontProduct) {
    return <NotFound />;
  }

  const product = {
    ...sanityProduct,
    storefront: storefrontProduct,
  };

  // Obtain variant ID from server state or request search params, in that order
  const params = new URLSearchParams(props.search);
  const variantId = props?.variantId || params?.get('variant');
  const encodedVariantId = encode('ProductVariant', variantId);

  const flattenedVariants = flattenConnection(product.storefront.variants);
  const productVariantIndex = flattenedVariants.findIndex(
    (variant) => variant.id === encodedVariantId,
  );

  const productVariant =
    product.storefront?.variants?.edges[
      productVariantIndex >= 0 ? productVariantIndex : 0
    ];

  return (
    <ProductsProvider value={shopifyProducts}>
      <Layout>
        <ProductDetails
          initialVariantId={productVariant?.node?.id}
          product={product}
        />
        {/* SEO */}
        <Seo
          page={{
            description: product.seo?.description,
            image: product.seo?.image,
            keywords: product.seo?.keywords,
            product: {
              availableForSale: productVariant?.node?.availableForSale,
              description: product.seo?.description,
              price: productVariant?.node?.priceV2,
              title: product.seo?.title,
            },
            title: product.seo?.title,
            type: 'product',
          }}
        />
      </Layout>
    </ProductsProvider>
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
