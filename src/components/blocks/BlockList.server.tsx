// TODO: type correctly

import clsx from 'clsx';

const SHARED_LIST_CLASSES = clsx(
  'first:mt-0', //
  'my-8 space-y-1',
);

export default function BlockList(props) {
  const {children, type} = props;

  if (type === 'bullet') {
    return (
      <ol
        className={clsx(
          'list-disc', //
          SHARED_LIST_CLASSES,
        )}
      >
        {children}
      </ol>
    );
  }

  if (type === 'number') {
    return (
      <ol
        className={clsx(
          'list-decimal', //
          SHARED_LIST_CLASSES,
        )}
      >
        {children}
      </ol>
    );
  }

  return null;
}
