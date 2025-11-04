import { useMutation, useQuery } from "@tanstack/react-query";
import type { SubmissionReq } from "@/api/types";
import { createSPAJ, getPayment, getProposalStatus, submissionProposal } from "@/app/services/proposal";

export const useCreateSPAJ = () =>
  useMutation({
    mutationFn: () => createSPAJ(),
  });
  
export const useSubmissionProposal = () =>
  useMutation({
    mutationFn: (body: SubmissionReq) => submissionProposal(body),
  });

export const useProposalStatus = (spaj_number?: string, enabled: boolean = true) =>
  useQuery({
    queryKey: ["proposal-status", spaj_number],
    queryFn: () => getProposalStatus(spaj_number!),
    enabled: !!spaj_number && enabled, 
    refetchInterval: 10_000,
  });

export const usePayment = () =>
  useMutation({
    mutationFn: (spaj_number: string) => getPayment(spaj_number),
  });
