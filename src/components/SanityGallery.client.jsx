import sanityImageUrl from '../utils/sanityImageUrl';

export default function SanityGallery(props) {
  const {images} = props;

  if (!images?.length) {
    return null;
  }

  return (
    <ul className="grid lg:grid-cols-2 gap-5">
      {images.map((image) => {
        return (
          <li key={image?._key} className="relative">
            <img
              alt=""
              className="w-full bg-white object-cover"
              src={sanityImageUrl(image, {width: 1000})}
            />
          </li>
        );
      })}
    </ul>
  );
}
