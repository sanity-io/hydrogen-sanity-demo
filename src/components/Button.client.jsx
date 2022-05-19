export default function Button(props) {
  const {children} = props;
  return (
    <div className="block w-full text-white text-sm bg-black px-3 py-4 disabled:cursor-wait disabled:opacity-60">
      {children}
    </div>
  );
}
