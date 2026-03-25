import PageLoader from "./PageLoader";

/**
 * Full-page loading area shared across route-level and data loaders
 * (matches Dashboard / main app background and vertical rhythm).
 */
export default function PageLoadingShell({ message = "Loading…", className = "" }) {
  return (
    <div
      className={`pt-24 sm:pt-32 pb-24 min-h-screen bg-[#F5F7FA] ${className}`.trim()}
    >
      <PageLoader message={message} />
    </div>
  );
}
