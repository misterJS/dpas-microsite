import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductDetail, computePremium } from "@/app/services/product";
import type { ComputePremiumReq, SubmissionReq } from "@/api/types";
import { createSPAJ, getPayment, getProposalStatus, submissionProposal } from "@/app/services/proposal";

export const useProposalStatus = (spaj_number?: string) =>
  useQuery({
    queryKey: ["proposal-status", spaj_number],
    queryFn: () => getProposalStatus(spaj_number!),
    enabled: !!spaj_number,
  });

export const usesubmissionProposal = (body?: SubmissionReq) =>
  useQuery({
    queryKey: [
      "submit",
      body
    ],
    queryFn: () => submissionProposal(body!),
    enabled: !!body,
  });

export const useCreateSPAJ = (body?: SubmissionReq) =>
  useQuery({
    queryKey: [
      "submit",
      body
    ],
    queryFn: () => createSPAJ(body!),
    enabled: !!body,
  });

export const usePayment = (spaj_number?: string) =>
  useQuery({
    queryKey: ["payment", spaj_number],
    queryFn: () => getPayment(spaj_number!),
    enabled: !!spaj_number,
  });
