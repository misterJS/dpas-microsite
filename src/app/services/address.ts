import { api } from "@/lib/api";
import type { ApiEnvelope, ZipLookupRes } from "@/api/types";
import { mapZipLookup } from "@/api/mappers";

export const lookupByZip = async (q: string): Promise<ZipLookupRes> => {
  const { data } = await api.get<ApiEnvelope<ZipLookupRes[]>>(
    `/microsite/address-by-zip`,
    { params: { q } }
  );
  return mapZipLookup(data?.data[0]);
};
