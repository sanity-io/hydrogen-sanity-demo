import {SanityColorTheme} from '../types';

type Props = {
  colorTheme?: SanityColorTheme;
  title?: string;
};

export default function Hero({colorTheme, title}: Props) {
  return (
    <div
      className="rounded-b-lg py-16 px-4"
      style={{
        background: colorTheme?.background || 'white',
        color: colorTheme?.text || 'black',
      }}
    >
      {/* Title */}
      {title && (
        <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
      )}
    </div>
  );
}
