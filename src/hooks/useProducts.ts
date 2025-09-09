import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductDetail } from "@/app/services/product";

export const useProducts = (slug?: string, q?: { search?: string }) =>
  useQuery({
    queryKey: ["products", slug, q],
    queryFn: () => getProducts(slug!, q),
    enabled: !!slug,
  });

export const useProductDetail = (slug?: string, productCode?: string) =>
  useQuery({
    queryKey: ["product-detail", slug, productCode],
    queryFn: () => getProductDetail(slug!, productCode!),
    enabled: !!slug && !!productCode,
  });

