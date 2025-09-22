import { api } from "@/lib/api";
import type { ApiEnvelope, HealthQuestion } from "@/api/types";

export type Option = { code: string; name: string }

export type TQuestion = { 
  group_order: number; 
  group_type: string; 
  group_label: string;
  question: HealthQuestion[]
}

export const getQuestions = async (
  slug: string,
  productCode: string,
  type: string
): Promise<TQuestion[]> => {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/product/${productCode}/question`,
    { params: { type } }
  );
  return mapQuestion(data?.data ?? []);
};

const mapQuestion = (data: HealthQuestion[]): TQuestion[] => {
  const grouped: Record<string, TQuestion> = {};

  for (const item of data) {
    const key = `${item.group_order}-${item.group_type}-${item.group_label}`;
    if (!grouped[key]) {
      grouped[key] = {
        group_order: item.group_order,
        group_type: item.group_type,
        group_label: item.group_label,
        question: []
      };
    }
    grouped[key].question.push(item);
  }

  Object.values(grouped).forEach(group => {
    group.question.sort((a: HealthQuestion, b: HealthQuestion) => a.question_order - b.question_order);
  });

  return Object.values(grouped).sort((a: TQuestion, b: TQuestion) => a.group_order - b.group_order);
};
