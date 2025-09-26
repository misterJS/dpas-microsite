import { useQuery } from "@tanstack/react-query";
import { getBranches, getJobs, getSalaries } from "@/app/services/options";

export const useBranches = () =>
  useQuery({ queryKey: ["branches"], queryFn: () => getBranches() });

export const useJobs = () =>
  useQuery({ queryKey: ["jobs"], queryFn: () => getJobs() });

export const useSalaries = () =>
  useQuery({ queryKey: ["salaries"], queryFn: () => getSalaries() });

