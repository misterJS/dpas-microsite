import { api } from "@/lib/api";
import type { ApiEnvelope, DocumentReq, DocumentRes } from "@/api/types";
import { mapDocumentResponse } from "@/api/mappers";

export const generateRipleyPDF = async (
  slug: string,
  product_code: string,
  body: DocumentReq
): Promise<DocumentRes> => {
  const { data } = await api.post<ApiEnvelope<DocumentRes>>(
    `/microsite/${slug}/products/${product_code}/generate-riplay`,
    body
  );
  return mapDocumentResponse(data.data);
};
