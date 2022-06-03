import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import type {SanityColorTheme, SanityModule} from '../types';
import CardProduct from './cards/CardProduct';
import Module from './modules/Module.server';

const FULL_WIDTH_MODULE_TYPES: SanityModule['_type'][] = [
  'module.callout',
  'module.callToAction',
];

const CLASSES = {
  flexAlign: {
    center: 'items-center',
    end: 'items-end',
    start: 'items-start',
  },
  flexJustify: {
    center: 'justify-center',
    end: 'justify-end',
    start: 'justify-start',
  },
  imageAspect: {
    landscape: 'aspect-square md:aspect-[16/9]',
    square: 'aspect-square',
  },
  width: {
    sm: 'w-full md:w-[55%]',
    md: 'w-full md:w-[65%]',
    lg: 'w-full md:w-full',
  },
};

const LAYOUTS = [
  {
    aspect: 'square',
    flex: {
      align: 'start',
      justify: 'start',
    },
    offsetY: false,
    width: 'md',
  },
  {
    aspect: 'square',
    flex: {
      align: 'start',
      justify: 'end',
    },
    offsetY: false,
    width: 'lg',
  },
  {
    aspect: 'square',
    flex: {
      align: 'start',
      justify: 'start',
    },
    offsetY: false,
    width: 'lg',
  },
  {
    aspect: 'square',
    flex: {
      align: 'center',
      justify: 'start',
    },
    offsetY: false,
    width: 'sm',
  },
  {
    aspect: 'square',
    flex: {
      align: 'start',
      justify: 'end',
    },
    offsetY: false,
    width: 'md',
  },
  {
    aspect: 'square',
    flex: {
      align: 'start',
      justify: 'end',
    },
    offsetY: true,
    width: 'md',
  },
  {
    aspect: 'square',
    flex: {
      align: 'start',
      justify: 'start',
    },
    offsetY: false,
    width: 'lg',
  },
  {
    aspect: 'landscape',
    flex: {
      align: 'center',
      justify: 'end',
    },
    offsetY: false,
    width: 'lg',
  },
] as const;

type Props = {
  colorTheme?: SanityColorTheme;
  items: (SanityModule | Product)[];
};

// TODO: convert to module grid

export default function LayoutGrid({colorTheme, items}: Props) {
  return (
    <ul className="grid grid-cols-1 gap-y-[7.5vw] gap-x-[7.5vw] md:grid-cols-2">
      {items.map((item, index) => {
        const layout = LAYOUTS[index % LAYOUTS.length];

        const flexAlign = CLASSES.flexAlign[layout.flex.align];
        const flexJustify = CLASSES.flexJustify[layout.flex.justify];
        const imageAspect = CLASSES.imageAspect[layout.aspect];
        const marginTop = layout.offsetY ? 'md:mt-[5vw]' : 'mt-0';
        const width = CLASSES.width[layout.width];

        if (isModule(item)) {
          return (
            <li
              className={clsx([
                'flex overflow-hidden', //
                item._type === 'module.product'
                  ? [flexAlign, flexJustify, marginTop]
                  : 'items-center justify-center',
                FULL_WIDTH_MODULE_TYPES.includes(item._type)
                  ? 'md:col-span-2'
                  : 'md:col-span-1',
              ])}
              key={item._key}
            >
              <div
                className={clsx(
                  item._type === 'module.product' ? width : 'w-full',
                )}
              >
                <Module
                  colorTheme={colorTheme}
                  imageAspectClassName={imageAspect}
                  module={item}
                />
              </div>
            </li>
          );
        } else {
          return (
            <li
              className={clsx(['flex', flexAlign, flexJustify, marginTop])}
              key={item.id}
            >
              <div className={clsx([width])}>
                <CardProduct
                  imageAspectClassName={imageAspect}
                  storefrontProduct={item}
                />
              </div>
            </li>
          );
        }
      })}
    </ul>
  );
}

const isModule = (item: SanityModule | Product): item is SanityModule => {
  return (item as SanityModule)._type?.startsWith('module');
};
