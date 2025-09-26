import { api } from "@/lib/api";
import type { ApiEnvelope, DocumentReq, DucumentRes } from "@/api/types";
import { mapDocumentResponse } from "@/api/mappers";

export const generateRipleyPDF = async (
  slug: string,
  productCode: string,
  body: DocumentReq
): Promise<DucumentRes> => {
  const { data } = await api.post<ApiEnvelope<DucumentRes>>(
    `/microsite/${slug}/product/${productCode}/generate-riplay`,
    body
  );
  return mapDocumentResponse(data.data);
};
