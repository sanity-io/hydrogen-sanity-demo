import {Link} from '@shopify/hydrogen/client';

import {useSettingsContext} from '../contexts/SettingsContext.server';

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

      {data?.footer?.text && (
        <PortableText className="text-gray-400" blocks={data.footer.text} />
      )}
    </footer>
  );
}
