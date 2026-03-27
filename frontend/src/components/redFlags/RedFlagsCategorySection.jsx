import { getSectionMeta } from "../../utils/redFlagsAlert";
import RedFlagsFieldCard from "./RedFlagsFieldCard";

const RedFlagsCategorySection = ({ id, flags: sectionFlags }) => {
  const meta = getSectionMeta(id);

  return (
    <div>
      <h4 className="text-sm font-semibold text-amber-950">{meta.title}</h4>
      {meta.description && (
        <p className="text-xs text-amber-800/90 mt-0.5 mb-3">{meta.description}</p>
      )}
      <div className="space-y-3">
        {sectionFlags.map((field, idx) => (
          <RedFlagsFieldCard key={`${id}-${idx}`} field={field} />
        ))}
      </div>
    </div>
  );
};

export default RedFlagsCategorySection;
