import {Link} from '@shopify/hydrogen/client';
import {useSettingsContext} from '../contexts/SettingsProvider.client';
import CartToggleButton from './CartToggleButton.client';
import HeaderMenu from './HeaderMenu.client';

export default function Header() {
  const data = useSettingsContext();

  return (
    <header
      className="backdrop-filter backdrop-blur-lg bg-opacity-80 bg-white border-b border-black flex items-start justify-between h-20 p-4 sticky top-0 w-full z-50"
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
