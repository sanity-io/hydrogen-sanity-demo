import {Link} from '@shopify/hydrogen/client';
import {useSettingsContext} from '../contexts/SettingsProvider.client';
import PortableText from './PortableText.client';

export default function Footer() {
  const data = useSettingsContext();

  return (
    <footer role="contentinfo" className="border-t border-black mt-32 p-4">
      {/* Links */}
      {data?.footer?.links?.map((link) => {
        if (link._type === 'linkExternal') {
          return (
            <div key={link?._key}>
              <a
                href={link.url}
                rel="noreferrer"
                target={link.newWindow ? '_blank' : '_self'}
              >
                {link.title}
              </a>
            </div>
          );
        }
        if (link._type === 'linkInternal') {
          if (!link.slug) {
            return null;
          }

          return (
            <div key={link?._key}>
              <Link to={link.slug}>{link.title}</Link>
            </div>
          );
        }
        return null;
      })}

      {data?.footer?.text && <PortableText blocks={data.footer.text} />}

      <div>
        <span className="bg-gray-500 inline-flex items-center justify-center leading-none mr-2 px-2 py-1 rounded text-gray-100 text-xs">
          Hydrogen 0.13.2
        </span>
      </div>
    </footer>
  );
}
