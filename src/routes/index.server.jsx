import {Seo} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import {useSanityQuery} from 'hydrogen-plugin-sanity';
import React, {Suspense} from 'react';
import clientConfig from '../../sanity.config';
import CollectionCard from '../components/CollectionCard.server';
import GalleryCarousel from '../components/GalleryCarousel.client';
import Layout from '../components/Layout.server';
import NotFound from '../components/NotFound.server';
import PortableText from '../components/PortableText.client';
import ProductListing from '../components/ProductListing.server';
import SeoImage from '../components/SeoImage.client';
import ProductsProvider from '../contexts/ProductsProvider.client';
import {IMAGE} from '../fragments/image';
import {PORTABLE_TEXT} from '../fragments/portableText';
import {PRODUCT_WITH_VARIANT} from '../fragments/productWithVariant';
import {SEO} from '../fragments/seo';

export default function Index() {
  const {sanityData: sanityPage, shopifyProducts} = useSanityQuery({
    query: QUERY,
    clientConfig,
  });

  if (!sanityPage) {
    return <NotFound />;
  }

  return (
    <ProductsProvider value={shopifyProducts}>
      <Layout>
        <div className="bg-black-300 relative w-full">
          {/* Intro */}
          {sanityPage?.intro && (
            <div className="max-w-3xl p-4">
              <Suspense fallback={null}>
                <PortableText blocks={sanityPage.intro} />
              </Suspense>
            </div>
          )}

          {/* Divider */}
          <div className="bg-black h-px my-10 w-full" />

          {/* Featured collections */}
          <div className="px-4">
            <h2 className="font-medium text-xl">Featured collections</h2>
            <section
              className={clsx([
                'grid grid-cols-1 sm:grid-cols-2',
                'gap-10 my-8',
              ])}
            >
              {sanityPage.featuredCollections?.map((collection) => (
                <div key={collection?._id}>
                  <CollectionCard collection={collection} />
                </div>
              ))}
            </section>
          </div>

          {/* Divider */}
          <div className="bg-black h-px my-10 w-full" />

          {/* Gallery */}
          {sanityPage?.gallery && (
            <Suspense fallback={null}>
              <GalleryCarousel gallery={sanityPage?.gallery} />
            </Suspense>
          )}

          {/* Divider */}
          <div className="bg-black h-px my-10 w-full" />

          {/* Featured products */}
          <div className="px-4">
            <h2 className="font-medium text-xl">Featured products</h2>
            <ProductListing
              products={sanityPage?.featuredProducts?.map((product) => ({
                ...product,
                storefront: shopifyProducts?.[product?._id],
              }))}
            />
          </div>
        </div>
        {/* SEO */}
        <Seo
          data={{
            seo: {
              description: sanityPage.seo?.description,
              title: sanityPage.seo?.title,
            },
            title: sanityPage.seo?.title,
          }}
          type="page"
        />
        {/* Open Graph image tags */}
        {sanityPage?.seo?.image && <SeoImage image={sanityPage.seo.image} />}
      </Layout>
    </ProductsProvider>
  );
}

const QUERY = groq`
  *[_id == 'home'][0]{
    featuredCollections[]-> {
      _id,
      image {
        ${IMAGE}
      },
      "slug": slug.current,
      title,
    },
    featuredProducts[] {
      ...${PRODUCT_WITH_VARIANT}
    },
    gallery[] {
      _key,
      image {
        ${IMAGE}
      },
      productWithVariant {
        ${PRODUCT_WITH_VARIANT}
      },
      title
    },
    intro[] {
      ${PORTABLE_TEXT}
    },
    seo {
      ${SEO}
    }
  } {
    ...,
    featuredProducts[available]
  }
`;
