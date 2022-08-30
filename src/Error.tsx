export default function ServerError() {
  return (
    <div className="pt-20 text-center">
      <h1 className="mx-auto px-12 text-center text-2xl font-bold">
        An unexpected error has occurred
      </h1>
      <p className="my-8">
        Please try refresh this page, or return{' '}
        <a className="underline" href="/">
          home
        </a>
        .
      </p>
    </div>
  );
}
