export type ApiEnvelope<T> = {
  responseCode: string;
  responseMessage: string;
  data: T;
};

export type ProductListItem = {
  productId: number;
  productName: string;
  micrositeId: string;
  productCode: string;
  image: string;
  desc: string;
};

export type ProductDetailTerm = { termId: number; term: number; termUnit: "M" | string };
export type ProductBenefit = {
  benefCode: string;
  benefName: string;
  benefAmount: number;
  benefType: string;
  notes?: string;
};
export type ProductPackage = { packageId: number; packageName: string; packageCode: string; benefits: ProductBenefit[] };
export type ProductDetail = {
  productCode: string;
  productName: string;
  desc: string;
  terms: ProductDetailTerm[];
  packages: ProductPackage[];
};

export type ComputePremiumReq = {
  policyTermId: number;
  productCode: string;
  packageId: number | string;
};
export type ComputePremiumRes = {
  premiumAmount: string | number;
  ujrohAmount: string | number;
  tabaruAmount: string | number;
};

export type BranchItem = {
  branchId: string;
  descItem: string;
  shortDesc: string;
  longDesc: string;
};

export type ZipLookupRes = {
  province: { provinceId: string; provinceName: string }[];
  city: { cityId: string; cityName: string }[];
  district: { districtId: string; districtName: string }[];
  subdistrict: { subdistrictId: string; subdistrictName: string }[];
};

export type Province = { provinceId: string; provinceName: string };
export type City = { cityId: string; cityName: string };
export type District = { districtId: string; districtName: string };
export type Subdistrict = { subdistrictId: string; subdistrictName: string };

export type HealthQuestion = {
  questionId: string;
  questionCode: string;
  questionText: string;
  questionType?: string;
  questionAnswerType?: string;
};
