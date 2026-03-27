const RedFlagsAlertIntro = ({ issueCount }) => (
  <>
    <h3 className="text-lg font-semibold text-amber-900 mb-2">Verification Needed</h3>
    <p className="text-sm text-amber-800 mb-4">
      {issueCount} issue{issueCount > 1 ? "s" : ""} detected. Review by category below;
      mark the invoice as defective if it is incorrect.
    </p>
  </>
);

export default RedFlagsAlertIntro;
