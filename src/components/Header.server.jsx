import {Link} from '@shopify/hydrogen';

import {useSettingsContext} from '../contexts/SettingsContext.server';
import CartToggleButton from './CartToggleButton.client';
import HeaderMenu from './HeaderMenu.client';

export default function Header() {
  const data = useSettingsContext();

  return (
    <header
      className="sticky top-0 z-50 flex items-start justify-between w-full h-20 p-4 bg-white border-b border-black backdrop-filter backdrop-blur-lg bg-opacity-80"
      role="banner"
    >
      <div className="">
        <div>
          <Link className="font-medium" to="/">
            Sanity + Hydrogen demo store
          </Link>
        </div>
        {data?.menu?.links && <HeaderMenu links={data.menu.links} />}
        
      </div>
      <CartToggleButton />
    </header>
  );
}
