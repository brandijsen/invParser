import { FiAlertTriangle } from "react-icons/fi";
import { prepareRedFlagsAlert } from "../utils/redFlagsAlert";
import RedFlagsAlertIntro from "./redFlags/RedFlagsAlertIntro";
import RedFlagsCategorySection from "./redFlags/RedFlagsCategorySection";

const RedFlagsAlert = ({ parsed, validationFlags }) => {
  const data = prepareRedFlagsAlert(parsed, validationFlags);
  if (!data) return null;

  const { combinedFlags, sections } = data;

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
          <FiAlertTriangle className="w-6 h-6 text-amber-700" />
        </div>

        <div className="flex-1 min-w-0">
          <RedFlagsAlertIntro issueCount={combinedFlags.length} />

          <div className="space-y-8">
            {sections.map(({ id, flags: sectionFlags }) => (
              <RedFlagsCategorySection key={id} id={id} flags={sectionFlags} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedFlagsAlert;
