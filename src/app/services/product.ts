import { api } from "@/lib/api";
import type {
  ApiEnvelope,
  ProductDetail,
  ProductListItem,
  ComputePremiumReq,
  ComputePremiumRes,
} from "@/api/types";
import {
  mapComputePremium,
  mapProductDetail,
  mapProductList,
} from "@/api/mappers";

export const getProducts = async (
  slug: string,
  q?: { search?: string }
): Promise<ProductListItem[]> => {
  const { data } = await api.get<ApiEnvelope<ProductListItem[]>>(
    `/microsite/${slug}/products`,
    { params: q }
  );
  return mapProductList(data.data);
};

export const getProductDetail = async (
  slug: string,
  productCode: string
): Promise<ProductDetail | undefined> => {
  const { data } = await api.get<
    ApiEnvelope<{ products: ProductDetail[] }>
  >(`/microsite/${slug}/products/${productCode}`);
  return mapProductDetail(data.data?.products);
};

export const computePremium = async (
  slug: string,
  body: ComputePremiumReq
): Promise<ComputePremiumRes> => {
  const { data } = await api.post<ApiEnvelope<ComputePremiumRes>>(
    `/microsite/${slug}/compute-premium`,
    body
  );
  return mapComputePremium(data.data);
};
