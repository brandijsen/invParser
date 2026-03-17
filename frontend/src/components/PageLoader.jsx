/**
 * Centralized loader for API fetches and route transitions.
 * Prevents jarring layout shifts and gives clear feedback while data loads.
 */
const PageLoader = ({ message = "Loading…", variant = "page", className = "" }) => {
  const isPage = variant === "page";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      style={
        isPage
          ? { minHeight: "calc(100vh - 8rem)", padding: "2rem" }
          : { minHeight: 200 }
      }
    >
      <div
        className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-emerald-600"
        aria-hidden="true"
      />
      {message && (
        <p className="text-slate-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default PageLoader;
