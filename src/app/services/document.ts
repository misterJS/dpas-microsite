import { api } from "@/lib/api";
import type { ApiEnvelope, DocumentReq, DocumentRes } from "@/api/types";
import { mapDocumentResponse } from "@/api/mappers";

export const generateRipleyPDF = async (
  slug: string,
  productCode: string,
  body: DocumentReq
): Promise<DocumentRes> => {
  const { data } = await api.post<ApiEnvelope<DocumentRes>>(
    `/microsite/${slug}/product/${productCode}/generate-riplay`,
    body
  );
  return mapDocumentResponse(data.data);
};
