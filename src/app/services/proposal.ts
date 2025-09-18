import { api } from "@/lib/api";
import type { ApiEnvelope, ComputePremiumReq, ComputePremiumRes, SubmissionReq } from "@/api/types";


export const getPayment = async (
  spaj_number: string
): Promise<ComputePremiumRes> => {
  const { data } = await api.get< ApiEnvelope<ComputePremiumRes>>(
    `/microsite/payment`
  );
  return data.data;
};

export const getProposalStatus = async (
  spaj_number: string
): Promise<ComputePremiumRes> => {
  const { data } = await api.get< ApiEnvelope<ComputePremiumRes>>(
    `/microsite/proposal/${spaj_number}/status`
  );
  return data.data;
};

export const submissionProposal = async (
  body: SubmissionReq
): Promise<ComputePremiumRes> => {
  const { data } = await api.post<ApiEnvelope<ComputePremiumRes>>(
    `/microsite/proposal/submit`,
    body
  );
  return data.data;
};

export const createSPAJ = async (
  body: SubmissionReq
): Promise<ComputePremiumRes> => {
  const { data } = await api.post<ApiEnvelope<ComputePremiumRes>>(
    `/microsite/proposal/create-spaj`,
    body
  );
  return data.data;
};
