import CloseIcon from '~/components/icons/Close';
import {Link} from '~/components/Link';

export function Modal({
  children,
  title,
  cancelLink,
}: {
  children: React.ReactNode;
  title: string;
  cancelLink: string;
}) {
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
    >
      <div className="fixed inset-0 bg-black bg-opacity-20 transition-opacity"></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
          <div
            className="shadow-xl shadow-xl relative w-full max-w-[600px] flex-1 transform overflow-hidden rounded bg-white p-6 transition-all"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyPress={(e) => {
              e.stopPropagation();
            }}
            tabIndex={0}
          >
            <div className="mb-10 flex items-start justify-between">
              <h3 className="text-xl font-bold">{title}</h3>
              <Link to={cancelLink} preventScrollReset>
                <CloseIcon />
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
