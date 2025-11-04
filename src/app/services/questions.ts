import { api } from "@/lib/api";
import type { ApiEnvelope, HealthQuestion } from "@/api/types";
import {
  mapHealthQuestionGroups,
  type QuestionGroup,
} from "@/api/mappers";

export type TQuestion = QuestionGroup;

export const getQuestions = async (
  slug: string,
  product_code: string,
  type: string
): Promise<TQuestion[]> => {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/products/${product_code}/question`,
    { params: { type } }
  );
  return mapHealthQuestionGroups(data?.data);
};
