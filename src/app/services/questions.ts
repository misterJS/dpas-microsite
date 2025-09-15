import { api } from "@/lib/api";
import type { ApiEnvelope, HealthQuestion } from "@/api/types";

export const getQuestions = async (
  slug: string,
  productCode: string,
  type: string
): Promise<HealthQuestion[]> => {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/product/${productCode}/question`,
    { params: { type: type } }
  );
  return data.data;
};

