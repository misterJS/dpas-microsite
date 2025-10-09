import { useQuery } from "@tanstack/react-query";
import type { DocumentReq } from "@/api/types";
import { generateRipleyPDF } from "@/app/services/document";

export const useDocument = (slug?: string, product_code?: string, body?: DocumentReq, shouldFetch?: boolean) =>
  useQuery({
    queryKey: ['generate-riplay', slug, product_code],
    queryFn: () => generateRipleyPDF(slug!, product_code!, body!),
    enabled: shouldFetch,
  });
