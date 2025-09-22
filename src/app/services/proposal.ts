import { api } from "@/lib/api";
import type { ApiEnvelope, ComputePremiumReq, ComputePremiumRes, CreateSPAJRes, PaymentReq, PaymentRes, SubmissionReq } from "@/api/types";

export const createSPAJ = async (): Promise<CreateSPAJRes> => {
  const { data } = await api.post<ApiEnvelope<CreateSPAJRes>>(
    `/microsite/proposal/create-spaj`
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

export const getProposalStatus = async (
  spaj_number: string
): Promise<{ success: boolean }> => {
  const { data } = await api.get< ApiEnvelope<{ status: string }>>(
    `/microsite/proposal/${spaj_number}/status`
  );
  return mapResProposalStatus(data?.data);
};

const mapResProposalStatus = (data: { status: string }) => {
  const reslut = {
    success: data.status == 'CLEAN'
  }
  return reslut;
};

export const getPayment = async (
  body: PaymentReq
): Promise<PaymentRes> => {
  const { data } = await api.post< ApiEnvelope<PaymentRes>>(
    `/microsite/payment`,
    body
  );
  return data.data;
};
