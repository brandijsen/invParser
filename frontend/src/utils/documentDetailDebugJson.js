/**
 * Payload for the "Debug JSON" tab — mirrors previous inline IIFE in DocumentDetail.
 */
export function buildDocumentDebugJson(parsed, document) {
  if (!parsed && !document?.supplier) return null;

  const seller = parsed?.semantic?.seller;
  const getVal = (o) => (o && typeof o === "object" && "value" in o ? o.value : o);
  const supplierData = document?.supplier
    ? {
        id: document.supplier.id,
        name: document.supplier.name,
        vat_number: document.supplier.vat_number,
        address: document.supplier.address ?? getVal(seller?.address) ?? null,
      }
    : seller
      ? {
          name: getVal(seller.name),
          vat_number: getVal(seller.vat_number),
          address: getVal(seller.address),
        }
      : null;
  const { semantic, ...rest } = parsed || {};
  const semanticNoSeller =
    semantic && typeof semantic === "object"
      ? Object.fromEntries(Object.entries(semantic).filter(([k]) => k !== "seller"))
      : semantic;
  return {
    supplier: supplierData,
    ...rest,
    ...(semanticNoSeller &&
      Object.keys(semanticNoSeller).length > 0 && {
        semantic: semanticNoSeller,
      }),
  };
}
