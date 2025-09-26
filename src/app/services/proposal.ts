import { api } from "@/lib/api";
import type {
  ApiEnvelope,
  CreateSPAJRes,
  PaymentReq,
  PaymentRes,
  SubmissionReq,
} from "@/api/types";
import {
  mapCreateSpajResponse,
  mapPaymentResponse,
  mapProposalStatus,
  mapUnknownData,
} from "@/api/mappers";

export const createSPAJ = async (): Promise<CreateSPAJRes> => {
  const { data } = await api.post<ApiEnvelope<CreateSPAJRes>>(
    `/microsite/proposal/create-spaj`
  );
  return mapCreateSpajResponse(data.data);
};

export const submissionProposal = async (
  body: SubmissionReq
): Promise<Record<string, unknown>> => {
  const { data } = await api.post<ApiEnvelope<Record<string, unknown>>>(
    `/microsite/proposal/submit`,
    body
  );
  return mapUnknownData(data.data, {});
};

export const getProposalStatus = async (
  spaj_number: string
): Promise<{ success: boolean }> => {
  const { data } = await api.get<ApiEnvelope<{ status: string }>>(
    `/microsite/proposal/${spaj_number}/status`
  );
  return mapProposalStatus(data?.data);
};

export const getPayment = async (
  body: PaymentReq
): Promise<PaymentRes> => {
  const { data } = await api.post<ApiEnvelope<PaymentRes>>(
    `/microsite/payment`,
    body
  );
  return mapPaymentResponse(data.data);
};
