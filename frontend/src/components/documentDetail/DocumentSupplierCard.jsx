import { FiBriefcase } from "react-icons/fi";

export default function DocumentSupplierCard({ document, parsed }) {
  if (!(document?.supplier || parsed?.semantic?.seller)) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <FiBriefcase className="text-slate-500" size={20} />
        <h3 className="text-lg font-semibold text-slate-900">Supplier</h3>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-slate-900">
          {document?.supplier?.name ??
            (parsed?.semantic?.seller?.name?.value ?? parsed?.semantic?.seller?.name)}
        </p>
        {(document?.supplier?.vat_number ??
          parsed?.semantic?.seller?.vat_number?.value ??
          parsed?.semantic?.seller?.vat_number) && (
          <p className="text-sm text-slate-500">
            VAT:{" "}
            {document?.supplier?.vat_number ??
              parsed?.semantic?.seller?.vat_number?.value ??
              parsed?.semantic?.seller?.vat_number}
          </p>
        )}
        {(parsed?.semantic?.seller?.address?.value ?? parsed?.semantic?.seller?.address) && (
          <p className="text-sm text-slate-500">
            {parsed?.semantic?.seller?.address?.value ?? parsed?.semantic?.seller?.address}
          </p>
        )}
      </div>
    </div>
  );
}
