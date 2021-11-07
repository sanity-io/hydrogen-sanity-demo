import {Helmet} from '@shopify/hydrogen/client';

import sanityImageUrl from '../utils/sanityImageUrl';

/**
 * @param {object}      props
 * @param {SanityImage} props.defaultImage
 * @param {string}      props.defaultTitle
 * @param {object}      props.page
 * @param {string}      props.page.description
 * @param {SanityImage} props.page.image
 * @param {string}      props.page.keywords
 * @param {object}      props.page.product
 * @param {bool}        props.page.product.availableForSale
 * @param {string}      props.page.product.description
 * @param {PriceV2}     props.page.product.price
 * @param {string}      props.page.product.title
 * @param {string}      props.page.title
 * @param {string}      props.page.type
 */
export default function Seo(props) {
  const {defaultImage, defaultTitle, page} = props;

  if (page) {
    const {description, image, keywords, price, title, type} = page;
    const imageUrl = image && sanityImageUrl(image);

    const url = typeof window === 'undefined' ? '' : window.location.href;

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords?.join()} />

        {/* OpenGraph URL */}
        {url && <meta property="og:url" content={url} />}

        {/* OpenGraph image */}
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {imageUrl && <meta property="og:image:secure_url" content={imageUrl} />}

        {/* OpenGraph type */}
        {type && <meta property="og:type" content={type} />}

        {/* OpenGraph price */}
        {price?.amount && (
          <meta property="og:price:amount" content={price?.amount} />
        )}
        {price?.currencyCode && (
          <meta property="og:price:currency" content={price?.currencyCode} />
        )}

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}

        {/* Product JSON-LD */}
        {page?.product && (
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "${page.product.title}",
                "image": [
                  ${imageUrl ? `"${imageUrl}"` : ''}
                ],
                "description": "${page.product.description}",
                "brand": {
                  "@type": "Brand",
                  "name": "${page.product?.vendor || ''}"
                },
                "offers": {
                  "@type": "Offer",
                  "url": "${url}",
                  "priceCurrency": "${page.product.price.currencyCode}",
                  "price": "${page.product.price.amount}",
                  "availability": "https://schema.org/${
                    page.product.availableForSale ? 'InStock' : 'OutOfStock'
                  }"
                }
              }
            `}
          </script>
        )}
      </Helmet>
    );
  }

  /**
   * Return a global SEO helper if no other props were passed.
   * Useful for placing in the "main" <App> container.
   */
  return (
    <Helmet defaultTitle={defaultTitle} titleTemplate={`%s – ${defaultTitle}`}>
      <meta property="og:site_name" content={defaultTitle} />
      {defaultImage && (
        <meta property="og:image" content={sanityImageUrl(defaultImage)} />
      )}
    </Helmet>
  );
}
