import {Head} from '@shopify/hydrogen/client';
import sanityImageUrl from '../utils/sanityImageUrl';

export default function SeoImage(props) {
  const {image} = props;
  if (!image) {
    return null;
  }

  const imageUrl = sanityImageUrl(image);
  return (
    <Head>
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content={`${image.width}`} />
      <meta property="og:image:height" content={`${image.height}`} />
      {image?.altText && (
        <meta property="og:image:alt" content={image.altText} />
      )}
    </Head>
  );
}
