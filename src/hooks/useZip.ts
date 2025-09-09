import { useQuery } from "@tanstack/react-query";
import { lookupByZip } from "@/app/services/address";

export const useZipLookup = (q?: string) =>
  useQuery({
    queryKey: ["zip-lookup", q],
    queryFn: () => lookupByZip(q!),
    enabled: !!q && q.length === 5,
  });

