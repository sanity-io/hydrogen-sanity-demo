import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import clsx from 'clsx';
import CardProduct from './cards/CardProduct';

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

export default function ProductsGrid({
  className,
  products,
}: {
  className?: string;
  products: Product[];
}) {
  return <ul className={className}>{renderCardLayout(products)}</ul>;
}

const renderCardLayout = (products: Product[]) => {
  return products.map((product, index) => {
    const layout = LAYOUTS[index % LAYOUTS.length];

    const flexAlign = CLASSES.flexAlign[layout.flex.align];
    const flexJustify = CLASSES.flexJustify[layout.flex.justify];
    const imageAspect = CLASSES.imageAspect[layout.aspect];
    const marginTop = layout.offsetY ? 'md:mt-[5vw]' : 'mt-0';
    const width = CLASSES.width[layout.width];

    return (
      <li
        className={clsx([
          'flex',
          flexAlign,
          flexJustify,
          marginTop,
          // 'border border-lime-500',
          // 'bg-lime-100',
        ])}
        key={product.id}
      >
        <div
          className={clsx([
            width, //
            // 'border border-blue-500',
            // 'bg-blue-100',
          ])}
        >
          <CardProduct
            imageAspectClassName={imageAspect}
            storefrontProduct={product}
          />
        </div>
      </li>
    );
  });
};
