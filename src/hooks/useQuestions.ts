import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/app/services/questions";

export const useQuestions = (slug?: string, productCode?: string, type?: string) =>
  useQuery({
    queryKey: [type, slug, productCode],
    queryFn: () => getQuestions(slug!, productCode!, type!),
    enabled: !!slug && !!productCode,
  });

