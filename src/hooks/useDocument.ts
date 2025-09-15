import { useQuery } from "@tanstack/react-query";
import type { DocumentReq } from "@/api/types";
import { generateRipleyPDF } from "@/app/services/document";

export const useDocument = (type?: string, slug?: string, productCode?: string, body?: DocumentReq) =>
  useQuery({
    queryKey: [type, slug, productCode],
    queryFn: () => generateRipleyPDF(type!, slug!, productCode!, body!),
    enabled: !!slug && !!productCode,
  });
