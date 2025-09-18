import { useQuery } from "@tanstack/react-query";
import type { DocumentReq } from "@/api/types";
import { generateRipleyPDF } from "@/app/services/document";

export const useDocument = (slug?: string, productCode?: string, body?: DocumentReq, shouldFetch?: boolean) =>
  useQuery({
    queryKey: ['generate-riplay', slug, productCode],
    queryFn: () => generateRipleyPDF(slug!, productCode!, body!),
    enabled: shouldFetch,
  });
