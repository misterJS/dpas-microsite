import { api } from "@/lib/api";
import type { ApiEnvelope, BranchItem } from "@/api/types";
import {
  mapBranchOptions,
  mapOptionList,
  type Option,
  type OptionInput,
} from "@/api/mappers";

export const getBranches = async (slug = "uob"): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<BranchItem[]>>(
    `/microsite/${slug}/bank-branches`
  );
  return mapBranchOptions(data.data);
};

export const getJobs = async (): Promise<Option[]> => {
  const { data } = await api.get<OptionInput[]>("/jobs");
  return mapOptionList(data);
};

export const getSalaries = async (): Promise<Option[]> => {
  const { data } = await api.get<OptionInput[]>("/salaries");
  return mapOptionList(data);
};
