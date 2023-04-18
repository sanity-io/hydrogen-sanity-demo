import clsx from 'clsx';

/**
 * A component and Suspense call that's used to let your app wait for code to load while declaring a loading state
 */
export function Skeleton({
  children,
  as: Component = 'div',
  width,
  height,
  className,
  ...props
}: {
  children?: React.ReactNode;
  as?: React.ElementType;
  width?: string;
  height?: string;
  className?: string;
  [key: string]: any;
}) {
  const styles = clsx('rounded bg-white animate-pulse', className);

  return (
    <Component {...props} width={width} height={height} className={styles}>
      {children}
    </Component>
  );
}
