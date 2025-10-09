import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/app/services/questions";

export const useQuestions = (slug?: string, product_code?: string, type?: string) =>
  useQuery({
    queryKey: [type, slug, product_code],
    queryFn: () => getQuestions(slug!, product_code!, type!),
    enabled: !!slug && !!product_code,
  });

