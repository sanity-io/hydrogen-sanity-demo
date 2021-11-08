import {Link, useServerState} from '@shopify/hydrogen/client';

const LinkProduct = (props) => {
  const {children, className, onClick, to, variantId} = props;

  const {setServerState} = useServerState();

  const handleClick = () => {
    if (variantId) {
      setServerState('variantId', variantId);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link className={className} onClick={handleClick} to={to}>
      {children}
    </Link>
  );
};

export default LinkProduct;
