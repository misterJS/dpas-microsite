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
): Promise<any> => {
  const { data } = await api.get< ApiEnvelope<any>>(
    `/microsite/proposal/${spaj_number}/status`
  );
  return data.data;
};

export const submissionProposal = async (
  body: SubmissionReq
): Promise<any> => {
  const { data } = await api.post<ApiEnvelope<any>>(
    `/microsite/proposal/submit`,
    body
  );
  return data.data;
};

export const createSPAJ = async (): Promise<any> => {
  const { data } = await api.get<ApiEnvelope<any>>(
    `/microsite/proposal/create-spaj`
  );
  return data.data;
};
