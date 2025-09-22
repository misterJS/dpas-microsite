import { useMutation, useQuery } from "@tanstack/react-query";
import type { PaymentReq, SubmissionReq } from "@/api/types";
import { createSPAJ, getPayment, getProposalStatus, submissionProposal } from "@/app/services/proposal";

export const useCreateSPAJ = () =>
  useMutation({
    mutationFn: () => createSPAJ(),
  });
  
export const useSubmissionProposal = () =>
  useMutation({
    mutationFn: (body: SubmissionReq) => submissionProposal(body),
  });

export const useProposalStatus = (spaj_number?: string) =>
  useQuery({
    queryKey: ["proposal-status", spaj_number],
    queryFn: () => getProposalStatus(spaj_number!),
    enabled: !!spaj_number,
    refetchInterval: 10_000,
  });

export const usePayment = () =>
  useMutation({
    mutationFn: (body: PaymentReq) => getPayment(body),
  });
