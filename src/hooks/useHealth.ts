import { useQuery } from "@tanstack/react-query";
import { getHealthQuestions } from "@/app/services/health";

export const useHealthQuestions = (slug?: string, productCode?: string) =>
  useQuery({
    queryKey: ["health-questions", slug, productCode],
    queryFn: () => getHealthQuestions(slug!, productCode!),
    enabled: !!slug && !!productCode,
  });

