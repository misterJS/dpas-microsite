export type ApiEnvelope<T> = {
  response_code: string;
  response_message: string;
  data: T;
};


export type ProductListItem  = {
  product_id: number;
  product_name: string;
  microsite_id: string;
  product_code: string;
  image: string;
  desc: string;
};

//product detail types
export type ProductDetailTerm = { term_id: number; term: number; term_unit: "M" | string };
export type ProductBenefit = {
  benef_code: string;
  benef_name: string;
  benef_amount: number;
  benef_type: string;
  notes?: string;
};
export type ProductPackage = { package_id: number; package_name: string; package_code: string; benefits: ProductBenefit[] };
export type ProductDetail = Pick<ProductListItem, 'product_code' | 'product_name'> & {
  desc: string;
  terms: ProductDetailTerm[];
  packages: ProductPackage[];
};

export type ComputePremiumReq = {
  policyterm_id: number;
  product_code: string;
  package_id: number | string;
};
export type ComputePremiumRes = {
  premium_amount: string | number;
  ujroh_amount: string | number;
  tabaru_amount: string | number;
};

// register types
export type BranchItem = {
  branch_id: string;
  desc_item: string;
  short_desc: string;
  long_desc: string;
};

export type ZipLookupRes = {
  province: { province_id: string; province_name: string }[];
  city: { city_id: string; city_name: string }[];
  district: { district_id: string; district_name: string }[];
  subdistrict: { subdistrict_id: string; subdistrict_name: string }[];
};

export type Province = { province_id: string; province_name: string };
export type City = { city_id: string; city_name: string };
export type District = { district_id: string; district_name: string };
export type Subdistrict = { subdistrict_id: string; subdistrict_name: string };

// health question
export type HealthQuestion = {
  id: string;
  code: string;
  question_order: number;
  question_text: string;
  type: string;
  answer_type: string;
  yes_label: string;
  no_label: string;
  group_type: string;
  group_label: string;
  group_order: number;
};

export type DocumentReq = {
  nama: string;
  dob: Date;
  gender: string;
  beneficiary: string;
  email: string;
  package_name?: string;
  term?: string | number;
};

export type DocumentRes = {
  doc_id: string;
  riplay_URL: string;
};

type TBenefits = {
  benef_code: string;
  benef_name: string;
  benef_amount: string | number;
  benef_type: string;
};

export type SubmissionReq = {
  product: {
    product_id: string
    product_code: string
    product_name: string
    package: {
      package_id?: number | null
      package_name?: string
      package_code?: string
      premium_amount?: number
      term: {
        term_id?: number
        term?: number
        term_unit?: string
      }
      benefits?: TBenefits[]
    }
  }
  client: {
    nik: string
    full_name: string
    pob: string
    dob: Date
    marital_status: string
    sex: string
    email?: string
    address: string
    phone: string
    country_code: string
    zip_code: string
    province: string
    city_name: string
    district_name: string
    subdistrict_name: string
    job: string
    income: string
    benef_name: string
    benef_phone: string
    benef_country_code: string
    benefAddress: string
    relation: string
  }
  questionaire: TQuestionaire
}

type TQuestionaire = {
  consent: TQuestionnaireItem | unknown
  health_questionnaire: TQuestionnaireItem | unknown
}

type TQuestionnaireItem = {
  answer: string
  question_answer_type: string
  question_code: string
  question_id: string
  question_text: string
  type: string
}

export type CreateSPAJRes = {
  id: string;
  spaj_number: string;
}

export type PaymentReq = {
  allow_reg: boolean;
  allow_pay: boolean;
  cart: { prm: number };
  cust_no: string;
  main_insured_name: string;
  cust_name: string;
  pay_option: string;
  source_app: string;
  currency: string;
  premium_amount: number;
  email: string;
  mobile_no: string;
  is_sharia: boolean;
  redirect_url: string;
  source_bill: string;
}

export type PaymentRes = {
  url: string;
  bill_no: string;
  resp_code: number;
  resp_desc: string;
}

export type CheckAvailabilityReq = { 
  product_code: string;
  component_code: string;
  birth_date: Date;
  email: string;
  ktp_id: string;
  marital_status: string;
}

export type CheckAvailabilityRes = {
  body: {
    product_code: string;
    component_code: string;
    birth_date: string;
    email: string;
    ktp_id: string;
    marital_status: string;
  },
  decisions: string;
  decisionDescription: string;
  validations: {
    MaxAllowedPoliciesPerLifeAssuredCheck: string;
    MaxAllowedPoliciesPerEmailIdentifier: string;
  }
}
