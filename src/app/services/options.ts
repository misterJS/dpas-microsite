import { api } from "@/lib/api";
import type { Option } from "@/app/services/location";

export const getBranches = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/branches");
  return data;
};

export const getJobs = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/jobs");
  return data;
};

export const getSalaries = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/salaries");
  return data;
};

