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

export async function getProductDetail(slug: string, product_code: string) {
  const { data } = await api.get<ApiEnvelope<{ products: ProductDetail[] }>>(
    `/microsite/${slug}/products/${product_code}`
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
export async function getCities(province_id: string | number) {
  const { data } = await api.get<ApiEnvelope<City[]>>(`/microsite/province/${province_id}/city`);
  return mapCityOptions(data.data);
}
export async function getDistricts(province_id: string | number, city_id: string | number) {
  const { data } = await api.get<ApiEnvelope<District[]>>(`/microsite/province/${province_id}/city/${city_id}/district`);
  return mapDistrictOptions(data.data);
}
export async function getSubdistricts(province_id: string | number, city_id: string | number, district_id: string | number) {
  const { data } = await api.get<ApiEnvelope<Subdistrict[]>>(
    `/microsite/province/${province_id}/city/${city_id}/district/${district_id}/subdistrict`
  );
  return mapSubdistrictOptions(data.data);
}

// HEALTH QUESTIONNAIRE
export async function getHealthQuestions(slug: string, product_code: string) {
  const { data } = await api.get<ApiEnvelope<HealthQuestion[]>>(
    `/microsite/${slug}/product/${product_code}/question`,
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
