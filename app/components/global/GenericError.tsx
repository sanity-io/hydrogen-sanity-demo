export function GenericError({
  error,
}: {
  error?: {message: string; stack?: string};
}) {
  const heading = `Something’s wrong here.`;
  let description = `We found an error while loading this page.`;

  // TODO hide error in prod?
  if (error) {
    description += `\n${error.message}`;
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <div className="pt-34">
      <h1 className="mx-auto px-12 text-center text-4xl sm:max-w-2xl">
        {heading}
      </h1>

      <p className="my-8 text-center">{description}</p>

      {error?.stack && (
        <pre
          style={{
            padding: '2rem',
            background: 'hsla(10, 50%, 50%, 0.1)',
            color: 'red',
            overflow: 'auto',
            maxWidth: '100%',
            margin: '0 2rem',
          }}
          dangerouslySetInnerHTML={{
            __html: addLinksToStackTrace(error.stack),
          }}
        />
      )}
    </div>
  );
}

function addLinksToStackTrace(stackTrace: string) {
  return stackTrace?.replace(
    // eslint-disable-next-line no-useless-escape
    /^\s*at\s?.*?[(\s]((\/|\w\:).+)\)\n/gim,
    (all, m1) =>
      all.replace(
        m1,
        `<a href="vscode://file${m1}" class="hover:underline">${m1}</a>`,
      ),
  );
}
