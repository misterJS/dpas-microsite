import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts, getProductDetail, computePremium, checkAvailability } from "@/app/services/product";
import type { CheckAvailabilityReq, ComputePremiumReq } from "@/api/types";

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

export const useComputePremium = (slug?: string, body?: ComputePremiumReq) =>
  useQuery({
    queryKey: [
      "compute-premium",
      slug,
      body?.productCode,
      body?.packageId,
      body?.policyTermId,
    ],
    queryFn: () => computePremium(slug!, body!),
    enabled: !!slug && !!body?.productCode && !!body?.packageId && !!body?.policyTermId,
  });

export const useCheckAvailability = () =>
  useMutation({
    mutationFn: (body: CheckAvailabilityReq) => checkAvailability(body),
  });
