import {Link, useServerState} from '@shopify/hydrogen/client';

/**
 * A simple wrapper for Hydrogen's `<Link />` component.
 *
 * @param {string}  props.handle - The handle of the product in Shopify
 * @param {string}  [props.variantId] - The 'raw' product variant number.
 */
const LinkProduct = (props) => {
  const {children, className, handle, onClick, variantId} = props;

  const {setServerState} = useServerState();

  // Return early with children if no valid handle found
  if (!handle) {
    return children;
  }

  let productUrl = `/products/${handle}`;
  if (variantId) {
    productUrl += `?variant=${variantId}`;
  }

  const handleClick = () => {
    if (variantId) {
      setServerState('variantId', variantId);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link className={className} onClick={handleClick} to={productUrl}>
      {children}
    </Link>
  );
};

export default LinkProduct;
