import clsx from 'clsx';
import {useEffect, useState} from 'react';

import LogoIcon from '~/components/icons/Logo';
import {Link} from '~/components/Link';

export default function HeaderBackground() {
  const [scrolledDown, setScrolledDown] = useState(false);

  const handleScroll = () => {
    setScrolledDown(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Trigger handler on mount to account for reloads
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* Background */}
      {/* Logo */}
      <Link to="/">
       SUPERYAYA
      </Link>
    </div>
  );
}
