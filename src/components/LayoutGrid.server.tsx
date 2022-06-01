import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import type {SanityModule} from '../types';
import CardProduct from './cards/CardProduct';
import Module from './modules/Module.server';

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
  className?: string;
  items: (SanityModule | Product)[];
};

const isModule = (item: SanityModule | Product): item is SanityModule => {
  return (item as SanityModule)._type?.startsWith('module');
};

export default function LayoutGrid({className, items}: Props) {
  return <ul className={className}>{renderItemLayout({items})}</ul>;
}

const renderItemLayout = ({items}: {items: (Product | SanityModule)[]}) => {
  return items.map((item, index) => {
    const layout = LAYOUTS[index % LAYOUTS.length];

    const flexAlign = CLASSES.flexAlign[layout.flex.align];
    const flexJustify = CLASSES.flexJustify[layout.flex.justify];
    const imageAspect = CLASSES.imageAspect[layout.aspect];
    const marginTop = layout.offsetY ? 'md:mt-[5vw]' : 'mt-0';
    const width = CLASSES.width[layout.width];

    if (isModule(item)) {
      return (
        <li className="flex items-center justify-center" key={item._key}>
          <Module module={item} />
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
  });
};
