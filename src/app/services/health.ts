import { api } from "@/lib/api";
import type { ApiEnvelope, HealthQuestion } from "@/api/types";

export const getHealthQuestions = async (
  slug: string,
  productCode: string
): Promise<HealthQuestion[]> => {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/product/${productCode}/question`,
    { params: { type: "HEALTH_QUESTIONAIRE" } }
  );
  return data.data;
};

