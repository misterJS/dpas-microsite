import { api } from "@/lib/api";
import type {
  ApiEnvelope,
  ProductListItem,
  ProductDetail,
  ComputePremiumReq,
  ComputePremiumRes,
  BranchItem,
  ZipLookupRes,
  Province,
  City,
  District,
  Subdistrict,
  HealthQuestion,
} from "./types";
import {
  mapBranchOptions,
  mapCityOptions,
  mapComputePremium,
  mapDistrictOptions,
  mapHealthQuestions,
  mapProductDetail,
  mapProductList,
  mapProvinceOptions,
  mapSubdistrictOptions,
  mapZipLookup,
} from "@/api/mappers";

// PRODUCTS
export async function getProducts(slug: string, q?: { search?: string }) {
  const { data } = await api.get<ApiEnvelope<ProductListItem[]>>(`/microsite/${slug}/products`, { params: q });
  return mapProductList(data.data);
}

export async function getProductDetail(slug: string, productCode: string) {
  const { data } = await api.get<ApiEnvelope<{ products: ProductDetail[] }>>(
    `/microsite/${slug}/products/${productCode}`
  );
  return mapProductDetail(data.data.products);
}

// PREMIUM
export async function computePremium(slug: string, body: ComputePremiumReq) {
  const { data } = await api.post<ApiEnvelope<ComputePremiumRes>>(
    `/microsite/${slug}/compute-premium`,
    body
  );
  return mapComputePremium(data.data);
}

// BRANCHES
export async function getBankBranches(slug: string) {
  const { data } = await api.get<ApiEnvelope<BranchItem[]>>(`/microsite/${slug}/bank-branches`);
  return mapBranchOptions(data.data);
}

// ZIP & ALAMAT
export async function lookupByZip(q: string) {
  const { data } = await api.get<ApiEnvelope<ZipLookupRes>>(`/microsite/address-by-zip`, { params: { q } });
  return mapZipLookup(data.data);
}

// CHAIN WILAYAH
export async function getProvinces() {
  const { data } = await api.get<ApiEnvelope<Province[]>>(`/microsite/province`);
  return mapProvinceOptions(data.data);
}
export async function getCities(provinceId: string | number) {
  const { data } = await api.get<ApiEnvelope<City[]>>(`/microsite/province/${provinceId}/city`);
  return mapCityOptions(data.data);
}
export async function getDistricts(provinceId: string | number, cityId: string | number) {
  const { data } = await api.get<ApiEnvelope<District[]>>(`/microsite/province/${provinceId}/city/${cityId}/district`);
  return mapDistrictOptions(data.data);
}
export async function getSubdistricts(provinceId: string | number, cityId: string | number, districtId: string | number) {
  const { data } = await api.get<ApiEnvelope<Subdistrict[]>>(
    `/microsite/province/${provinceId}/city/${cityId}/district/${districtId}/subdistrict`
  );
  return mapSubdistrictOptions(data.data);
}

// HEALTH QUESTIONNAIRE
export async function getHealthQuestions(slug: string, productCode: string) {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/product/${productCode}/question`,
    { params: { type: "HEALTH_QUESTIONAIRE" } }
  );
  return mapHealthQuestions(data.data);
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
