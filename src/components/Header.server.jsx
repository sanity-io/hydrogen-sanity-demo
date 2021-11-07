import {Link} from '@shopify/hydrogen';

import {useSettingsContext} from '../contexts/SettingsContext.server';
import CartToggleButton from './CartToggleButton.client';
import HeaderMenu from './HeaderMenu.client';

export default function Header() {
  const data = useSettingsContext();

  return (
    <header
      className="border-b border-black flex items-start justify-between h-20 p-4 w-full"
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
