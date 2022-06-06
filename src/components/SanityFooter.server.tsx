import clsx from 'clsx';

export default function SanityFooter() {
  return (
    <div className="-my-overlap bg-[#121923] pt-overlap text-white">
      <div className="mx-auto max-w-[45rem] px-8 py-12 text-center text-xl">
        {/* Intro */}
        <div>
          This is a demo store that Sanity have created along with Shopify's
          Hydrogen framework, powered by our free and official Sanity Connect
          App on Shopify.
        </div>
        {/* Links */}
        <div
          className={clsx(
            'mt-8 grid grid-cols-1 gap-3 text-left text-sm',
            'md:grid-cols-3',
          )}
        >
          <a
            className={clsx(
              'space-y-3 rounded-sm border border-white border-opacity-20 p-4 duration-500 ease-out',
              'hover:bg-white hover:bg-opacity-5',
            )}
            href="https://www.sanity.io"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.25 17.25V3.75H6.75"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.25 6.75H3.75V20.25H17.25V6.75Z"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>Clone our Hydrogen template</div>
          </a>

          <a
            className={clsx(
              'space-y-3 rounded-sm border border-white border-opacity-20 p-4 duration-500 ease-out',
              'hover:bg-white hover:bg-opacity-5',
            )}
            href="https://www.sanity.io"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5062 7.56523C18.7319 7.88836 18.9295 8.23024 19.0968 8.58711L21.5249 9.93711C21.8281 11.2951 21.8313 12.7028 21.5343 14.0621L19.0968 15.4121C18.9295 15.769 18.7319 16.1109 18.5062 16.434L18.553 19.2184C17.524 20.1561 16.306 20.8625 14.9812 21.2902L12.5905 19.8559C12.1973 19.884 11.8025 19.884 11.4093 19.8559L9.02803 21.2809C7.69894 20.861 6.47699 20.1572 5.44678 19.2184L5.49366 16.4434C5.26985 16.1158 5.07235 15.7709 4.90303 15.4121L2.47491 14.0621C2.17172 12.7042 2.16852 11.2964 2.46553 9.93711L4.90303 8.58711C5.07036 8.23024 5.26796 7.88836 5.49366 7.56523L5.44678 4.78086C6.47583 3.84314 7.69376 3.13667 9.01865 2.70898L11.4093 4.14336C11.8025 4.11523 12.1973 4.11523 12.5905 4.14336L14.9718 2.71836C16.3009 3.13826 17.5228 3.842 18.553 4.78086L18.5062 7.56523Z"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>Try our pre-configured Sanity Studio</div>
          </a>

          <a
            className={clsx(
              'space-y-3 rounded-sm border border-white border-opacity-20 p-4 duration-500 ease-out',
              'hover:bg-white hover:bg-opacity-5',
            )}
            href="https://www.sanity.io"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0304C3.82902 19.8897 3.75 19.6989 3.75 19.5V6.75003L5.25 3.75003H18.75L20.25 6.75003V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0304C19.8897 20.171 19.6989 20.25 19.5 20.25Z"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.82227 14.0723L12.0004 17.2504L15.1785 14.0723"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9.75V17.25"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.75 6.75H20.25"
                stroke="#F03F30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>Install the free Sanity Connect app on Shopify</div>
          </a>
        </div>
        {/* Learn more */}
        <a
          className={clsx(
            'mt-8 inline-flex items-center justify-center gap-1 text-lg text-[#508EEA]',
            'hover:opacity-70',
          )}
          href="https://www.sanity.io"
          rel="noreferrer"
          target="_blank"
        >
          <span>Learn more</span>
          <svg
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5H10"
              stroke="#508EEA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.14258 1L9.99972 5L6.14258 9"
              stroke="#508EEA"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
