import { api } from "@/lib/api";
import {
  mapComputePremium,
  mapProductDetail,
  mapProductList,
} from "@/api/mappers";
import type {
  ApiEnvelope,
  ProductDetail,
  ProductListItem,
  ComputePremiumReq,
  ComputePremiumRes,
} from "@/api/types";

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
  product_code: string
): Promise<ProductDetail | undefined> => {
  const { data } = await api.get<ApiEnvelope<ProductDetail>>(
    `/microsite/${slug}/products/${product_code}`
  );
  return mapProductDetail(data.data);
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
