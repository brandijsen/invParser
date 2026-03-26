import PageLoader from "./PageLoader";

/**
 * Full-page loading shell — same spinner + copy everywhere (session, data, etc.).
 */
export default function PageLoadingShell({ className = "" }) {
  return (
    <div
      className={`pt-24 sm:pt-32 pb-24 min-h-screen bg-[#F5F7FA] ${className}`.trim()}
    >
      <PageLoader message="Loading…" />
    </div>
  );
}
