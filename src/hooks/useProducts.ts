import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts, getProductDetail, computePremium, checkAvailability } from "@/app/services/product";
import type { CheckAvailabilityReq, ComputePremiumReq } from "@/api/types";

export const useProducts = (slug?: string, q?: { search?: string }) =>
  useQuery({
    queryKey: ["products", slug, q],
    queryFn: () => getProducts(slug!, q),
    enabled: !!slug,
  });

export const useProductDetail = (slug?: string, product_code?: string) =>
  useQuery({
    queryKey: ["product-detail", slug, product_code],
    queryFn: () => getProductDetail(slug!, product_code!),
    enabled: !!slug && !!product_code,
  });

export const useComputePremium = (slug?: string, body?: ComputePremiumReq) =>
  useQuery({
    queryKey: [
      "compute-premium",
      slug,
      body?.product_code,
      body?.package_id,
      body?.policyterm_id,
    ],
    queryFn: () => computePremium(slug!, body!),
    enabled: !!slug && !!body?.product_code && !!body?.package_id && !!body?.policyterm_id,
  });

export const useCheckAvailability = () =>
  useMutation({
    mutationFn: (body: CheckAvailabilityReq) => checkAvailability(body),
  });
