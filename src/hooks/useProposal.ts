import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts, getProductDetail, computePremium } from "@/app/services/product";
import type { ComputePremiumReq, SubmissionReq } from "@/api/types";
import { createSPAJ, getPayment, getProposalStatus, submissionProposal } from "@/app/services/proposal";

export const useProposalStatus = (spaj_number?: string) =>
  useQuery({
    queryKey: ["proposal-status", spaj_number],
    queryFn: () => getProposalStatus(spaj_number!),
    enabled: !!spaj_number,
    refetchInterval: 10_000,
  });

export const useSubmissionProposal = () =>
  useMutation({
    mutationFn: (body: SubmissionReq) => submissionProposal(body),
  });


export const useCreateSPAJ = () =>
  useMutation({
    mutationFn: () => createSPAJ(),
  });

export const usePayment = (spaj_number?: string) =>
  useQuery({
    queryKey: ["payment", spaj_number],
    queryFn: () => getPayment(spaj_number!),
    enabled: !!spaj_number,
  });
