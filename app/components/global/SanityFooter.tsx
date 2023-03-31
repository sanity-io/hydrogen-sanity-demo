import clsx from 'clsx';

export default function SanityFooter() {
  return (
    <div className="-my-overlap bg-[#121923] pt-overlap text-white">
      <div
        className={clsx(
          'mx-auto max-w-[47rem] px-4 py-12 text-center text-xl leading-caption', //
          'md:px-8',
        )}
      >
        {/* Intro */}
        <div>
          This demo shows how Sanity.io can power remarkable storefronts on
          Shopify&apos;s Hydrogen framework.
        </div>
        {/* Links */}
        <div
          className={clsx(
            'mt-8 grid grid-cols-1 gap-3 text-left text-sm leading-caption',
            'md:grid-cols-3',
          )}
        >
          <a
            className={clsx(
              'space-y-3 rounded-sm border border-white border-opacity-20 p-4 duration-500 ease-out',
              'hover:bg-white hover:bg-opacity-5',
            )}
            href="https://github.com/sanity-io/hydrogen-sanity-demo"
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
                d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z"
                fill="#D93D46"
              />
            </svg>
            <div>Explore this demo on Github</div>
          </a>

          <a
            className={clsx(
              'space-y-3 rounded-sm border border-white border-opacity-20 p-4 duration-500 ease-out',
              'hover:bg-white hover:bg-opacity-5',
            )}
            href="https://github.com/sanity-io/sanity-shopify-studio"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              width="19"
              height="23"
              viewBox="0 0 19 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.39566 2.93457C2.39566 6.03586 4.31043 7.88113 8.14383 8.85416L12.2059 9.79617C15.8339 10.6296 18.0432 12.6998 18.0432 16.0724C18.0714 17.5417 17.5939 18.9761 16.6905 20.1351C16.6905 16.7702 14.9502 14.9521 10.7524 13.8589L6.76396 12.9517C3.5701 12.2229 1.10494 10.5211 1.10494 6.8577C1.08814 5.443 1.54221 4.06287 2.39566 2.93457"
                fill="#FF3F4A"
              />
              <path
                opacity="0.5"
                d="M14.1942 15.247C15.9268 16.3557 16.6865 17.9064 16.6865 20.1315C15.2524 21.9691 12.733 23.0002 9.77167 23.0002C4.78708 23.0002 1.29865 20.5463 0.523438 16.2821H5.31035C5.92664 18.2398 7.55845 19.1469 9.73678 19.1469C12.3957 19.1469 14.1632 17.728 14.1981 15.2393"
                fill="#FF3F4A"
              />
              <path
                opacity="0.5"
                d="M4.88408 7.53226C4.09292 7.06199 3.44383 6.38625 3.0057 5.57676C2.56758 4.76728 2.35678 3.85425 2.39567 2.93459C3.77941 1.11259 6.18643 0 9.1206 0C14.1982 0 17.1362 2.68262 17.8611 6.45843H13.2563C12.7486 4.96982 11.4772 3.81071 9.15936 3.81071C6.68257 3.81071 4.99261 5.25281 4.89571 7.53226"
                fill="#FF3F4A"
              />
            </svg>

            <div>Try our Sanity Studio for Shopify projects</div>
          </a>

          <a
            className={clsx(
              'space-y-3 rounded-sm border border-white border-opacity-20 p-4 duration-500 ease-out',
              'hover:bg-white hover:bg-opacity-5',
            )}
            href="https://apps.shopify.com/sanity-connect"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              width="20"
              height="23"
              viewBox="0 0 20 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.6278 2.70364L12.9511 2.91308C12.8759 2.62748 12.7632 2.36093 12.6316 2.09437C12.1429 1.16142 11.4474 0.666391 10.6015 0.666391C10.5451 0.666391 10.4887 0.666386 10.4323 0.685426C10.4135 0.647346 10.3759 0.628307 10.3571 0.590227C9.9812 0.190393 9.51128 0 8.94737 0C7.83835 0.0380795 6.74812 0.837747 5.86466 2.26573C5.24436 3.27483 4.75564 4.53146 4.62406 5.52152L2.46241 6.20695C1.82331 6.41639 1.80451 6.43543 1.72932 7.0447C1.67293 7.50166 0 20.582 0 20.582L13.8534 23V2.6846C13.7406 2.6846 13.6842 2.6846 13.6278 2.70364ZM10.4323 3.71275L8.1015 4.4553C8.32707 3.57947 8.7594 2.70364 9.28571 2.13245C9.47368 1.92301 9.75564 1.67549 10.0752 1.54221C10.3759 2.18957 10.4323 3.08444 10.4323 3.71275ZM8.92857 0.761589C9.15414 0.74255 9.3985 0.818708 9.58647 0.932946C9.26692 1.1043 8.98496 1.33278 8.7406 1.59934C8.04511 2.36093 7.5 3.54139 7.29323 4.68377L5.35714 5.29304C5.75188 3.50331 7.21804 0.818709 8.92857 0.761589ZM6.78571 10.9669C6.8609 12.1664 9.96241 12.4139 10.1316 15.2127C10.2632 17.4214 8.98496 18.9255 7.12406 19.0397C4.88722 19.1921 3.66541 17.8593 3.66541 17.8593L4.13534 15.822C4.13534 15.822 5.37594 16.774 6.35338 16.6978C6.99248 16.6598 7.23684 16.1267 7.19925 15.7459C7.10526 14.1846 4.58647 14.2798 4.41729 11.7285C4.28571 9.57698 5.67669 7.38742 8.7594 7.19702C9.94361 7.12086 10.5451 7.4255 10.5451 7.4255L9.84962 10.0911C9.84962 10.0911 9.06015 9.7293 8.1391 9.78642C6.78571 9.88162 6.76692 10.7574 6.78571 10.9669ZM11.1654 3.48427C11.1654 2.91308 11.0902 2.13245 10.8271 1.44702C11.6541 1.59933 12.0677 2.57036 12.2556 3.14156C12.2368 3.14156 11.1654 3.48427 11.1654 3.48427ZM14.2481 22.9619L20 21.5149C20 21.5149 17.5188 4.56954 17.5188 4.4553C17.5 4.3601 17.4248 4.28394 17.312 4.2649C17.2368 4.2649 15.6203 4.22682 15.6203 4.22682C15.6203 4.22682 14.6429 3.25579 14.2669 2.89404V22.9619H14.2481Z"
                fill="#D93D46"
              />
            </svg>

            <div>Install Sanity Connect for free on the Shopify App Store</div>
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
