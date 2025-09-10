import { api } from "@/lib/api";
import type { Option } from "@/app/services/location";
import type { ApiEnvelope, BranchItem } from "@/api/types";

export const getBranches = async (slug = "uob"): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<BranchItem[]>>(
    `/microsite/${slug}/bank-branches`
  );
  return (data.data || []).map((b) => ({ code: String(b.branchId), name: b.descItem || b.shortDesc || b.longDesc }));
};

export const getJobs = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/jobs");
  return data;
};

export const getSalaries = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/salaries");
  return data;
};
