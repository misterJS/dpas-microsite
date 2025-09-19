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
  id: string;
  code: string;
  question_order: string | number;
  question_text: string;
  type: string;
  answer_type: string;
  yes_label: string;
  no_label: string;
  group_type: string;
  group_label: string;
  group_order: string | number;
};

export type DocumentReq = {
  nama: string;
  dob: Date;
  gender: string;
  beneficiary: string;
  email: string;
  packageName?: string;
  term?: string | number;
};

export type DucumentRes = {
  docId: string;
  riplayURL: string;
};

type TBenefits = {
  benefCode: string;
  benefName: string;
  benefAmount: string | number;
  benefType: string;
};

export type SubmissionReq = {
  product: {
    productId: string
    productCode: string
    productName: string
    package: {
      packageId?: number | null
      packageName?: string
      packageCode?: string
      premiumAmount?: number
      term: {
        termId?: number
        term?: number
        termUnit?: string
      }
      benefits?: TBenefits[]
    }
  }
  client: {
    nik: string
    fullName: string
    pob: string
    dob: Date
    maritalStatus: string
    sex: string
    email?: string
    address: string
    phone: string
    countryCode: string
    zipCode: string
    Province: string
    cityName: string
    districtName: string
    subdistrictName: string
    job: string
    income: string
    benefName: string
    benefPhone: string
    benefCountryCode: string
    benefAddress: string
    relation: string
  }
  questionaire: TQuestionaire
}

type TQuestionaire = {
    consent: TQuestionnaireItem | unknown
    healthQuestionnaire: TQuestionnaireItem | unknown
  }

type TQuestionnaireItem = {
  answer: string
  questionAnswerType: string
  questionCode: string
  questionId: string
  questionText: string
  type: string
}
