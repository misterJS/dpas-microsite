import { api } from "@/lib/api";
import type {
  ApiEnvelope, ProductListItem, ProductDetail, ComputePremiumReq, ComputePremiumRes,
  BranchItem, ZipLookupRes, Province, City, District, Subdistrict, HealthQuestion
} from "./types";

// PRODUCTS
export async function getProducts(slug: string, q?: { search?: string }) {
  const { data } = await api.get<ApiEnvelope<ProductListItem[]>>(`/microsite/${slug}/products`, { params: q });
  return data.data;
}

export async function getProductDetail(slug: string, productCode: string) {
  const { data } = await api.get<ApiEnvelope<{ products: ProductDetail[] }>>(
    `/microsite/${slug}/products/${productCode}`
  );
  return data.data.products?.[0];
}

// PREMIUM
export async function computePremium(slug: string, body: ComputePremiumReq) {
  const { data } = await api.get<ApiEnvelope<ComputePremiumRes>>(
    `/microsite/${slug}/compute-premium`,
    { data: body }
  );
  return data.data;
}

// BRANCHES
export async function getBankBranches(slug: string) {
  const { data } = await api.get<ApiEnvelope<BranchItem[]>>(`/microsite/${slug}/bank-branches`);
  return data.data;
}

// ZIP → ALAMAT
export async function lookupByZip(q: string) {
  const { data } = await api.get<ApiEnvelope<ZipLookupRes>>(`/microsite/address-by-zip`, { params: { q } });
  return data.data;
}

// CHAIN WILAYAH
export async function getProvinces() {
  const { data } = await api.get<ApiEnvelope<Province[]>>(`/microsite/province`);
  return data.data;
}
export async function getCities(provinceId: string | number) {
  const { data } = await api.get<ApiEnvelope<City[]>>(`/microsite/province/${provinceId}/city`);
  return data.data;
}
export async function getDistricts(provinceId: string | number, cityId: string | number) {
  const { data } = await api.get<ApiEnvelope<District[]>>(`/microsite/province/${provinceId}/city/${cityId}/district`);
  return data.data;
}
export async function getSubdistricts(provinceId: string | number, cityId: string | number, districtId: string | number) {
  const { data } = await api.get<ApiEnvelope<Subdistrict[]>>(
    `/microsite/province/${provinceId}/city/${cityId}/district/${districtId}/subdistrict`
  );
  return data.data;
}

// HEALTH QUESTIONNAIRE
export async function getHealthQuestions(slug: string, productCode: string) {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/product/${productCode}/question`,
    { params: { type: "HEALTH_QUESTIONAIRE" } }
  );
  return data.data;
}

// payload belum ready
export async function generateSpaj(payload: unknown) {
  const { data } = await api.post(`/microsite/spaj`, payload);
  return data;
}
export async function generateRipleyPDF(payload: unknown) {
  const { data } = await api.post(`/microsite/riplay`, payload);
  return data;
}
export async function submitProposal(payload: unknown) {
  const { data } = await api.post(`/microsite/proposal`, payload);
  return data;
}
export async function getPrupaylinkUrl(payload: unknown) {
  const { data } = await api.post(`https://payment-uat.pru.intranet.asia/ppl/getUrl`, payload);
  return data;
}
