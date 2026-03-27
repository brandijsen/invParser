import { FiAlertCircle } from "react-icons/fi";
import { getSeverityColor, formatValue } from "../../utils/redFlagsAlert";

const RedFlagsFieldCard = ({ field }) => (
  <div className="bg-white rounded-lg border border-amber-200 p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <FiAlertCircle
            className={`w-4 h-4 shrink-0 ${getSeverityColor(field.severity).text}`}
          />
          <span className="text-sm font-medium text-slate-900">{field.label}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityColor(field.severity).badge}`}
          >
            {field.type === "confidence" ? (
              `${field.confidence}% confident`
            ) : (
              field.severity.toUpperCase()
            )}
          </span>
        </div>

        {field.message && (
          <div className="text-sm text-slate-700 mb-2">{field.message}</div>
        )}

        {field.expected && field.actual && (
          <div className="text-xs text-slate-600 mb-2 space-y-1">
            <div>
              <span className="font-medium">Expected:</span> €{field.expected}
            </div>
            <div>
              <span className="font-medium">Actual:</span> €{field.actual}
            </div>
          </div>
        )}

        {field.value !== undefined && field.type === "confidence" && (
          <div className="text-sm text-slate-700 font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">
            {formatValue(field.value)}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RedFlagsFieldCard;
