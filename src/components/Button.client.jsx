export default function Button(props) {
  const {children, ...rest} = props;
  return (
    <div
      className="block w-full bg-black px-3 py-4 text-sm text-white disabled:cursor-wait disabled:opacity-60"
      {...rest}
    >
      {children}
    </div>
  );
}
