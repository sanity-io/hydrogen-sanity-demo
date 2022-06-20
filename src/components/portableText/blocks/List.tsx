import clsx from 'clsx';

const SHARED_LIST_CLASSES = clsx(
  'first:mt-0 last:mb-0', //
  'my-8 space-y-0.5 leading-paragraph list-outside ml-8',
);

export default function ListBlock(props: any) {
  const {children, type} = props;

  if (type === 'bullet') {
    return <ul className={SHARED_LIST_CLASSES}>{children}</ul>;
  }

  if (type === 'number') {
    return <ol className={SHARED_LIST_CLASSES}>{children}</ol>;
  }

  return null;
}
