import { api } from "@/lib/api";
import type { ApiEnvelope, ZipLookupRes } from "@/api/types";

export const lookupByZip = async (q: string): Promise<ZipLookupRes> => {
  const { data } = await api.get<ApiEnvelope<ZipLookupRes>>(
    `/microsite/address-by-zip`,
    { params: { q } }
  );
  return data.data;
};

