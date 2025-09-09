import { api } from "@/lib/api";
import type { ApiEnvelope, ProductDetail, ProductListItem } from "@/api/types";

export const getProducts = async (
  slug: string,
  q?: { search?: string }
): Promise<ProductListItem[]> => {
  const { data } = await api.get<ApiEnvelope<ProductListItem[]>>(
    `/microsite/${slug}/products`,
    { params: q }
  );
  return data.data;
};

export const getProductDetail = async (
  slug: string,
  productCode: string
): Promise<ProductDetail | undefined> => {
  const { data } = await api.get<
    ApiEnvelope<{ products: ProductDetail[] }>
  >(`/microsite/${slug}/products/${productCode}`);
  return data.data.products?.[0];
};

