import { api } from "@/lib/api";
import type {
  ApiEnvelope,
  CheckAvailabilityReq,
  CheckAvailabilityRes,
  CreateSPAJRes,
  PaymentRes,
  ProposaStatusRes,
  SubmissionReq,
} from "@/api/types";
import {
  mapCreateSpajResponse,
  mapPaymentResponse,
  mapProposalStatus,
  mapUnknownData,
} from "@/api/mappers";

export const createSPAJ = async (): Promise<CreateSPAJRes> => {
  const { data } = await api.get<ApiEnvelope<CreateSPAJRes>>(
    `/proposal/create-spaj`
  );
  return mapCreateSpajResponse(data.data);
};

export const submissionProposal = async (
  body: SubmissionReq
): Promise<Record<string, unknown>> => {
  const { data } = await api.post<ApiEnvelope<Record<string, unknown>>>(
    `/proposal/submit`,
    body
  );
  return mapUnknownData(data.data, {});
};

export const getProposalStatus = async (
  spaj_number: string
): Promise<ProposaStatusRes> => {
  const { data } = await api.get<ApiEnvelope<{ status: string }>>(
    `/proposal/${spaj_number}/status`
  );
  return mapProposalStatus(data?.data);
};

export const getPayment = async (
  spaj_number: string
): Promise<PaymentRes> => {
  const { data } = await api.get<ApiEnvelope<PaymentRes>>(
    `/payment/${spaj_number}?redirect_url=${encodeURIComponent(window.location.protocol + '//' + window.location.host + '/' + window.location.pathname?.split('/')?.[1])}`,
  );
  return mapPaymentResponse(data.data);
};

export const checkAvailability = async (
  body: CheckAvailabilityReq
): Promise<CheckAvailabilityRes> => {
  try {
    const { data } = await api.post<ApiEnvelope<CheckAvailabilityRes>>(
      `/check-availability`,
      body
    );
    return data.data;
  }
  catch (error: any) {
    const errorMessage = error.response?.data.data || 'Terjadi kesalahan';
    return Promise.reject(errorMessage);
  }
};
