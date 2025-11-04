import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { encryptedSessionStorage } from "./encrypt-storage";
import { SubmissionReq } from "@/api/types";

type TActionClient = {
  submission: SubmissionReq
  setSubmissionData: (data: SubmissionReq) => void
  resetSubmission: () => void
}

const initalState: SubmissionReq = {
  spaj_number: "",
  product: {
    product_id: "",
    product_code: "",
    product_name: "",
    product_image: "",
    package: {
      package_id: null,
      package_name: "",
      package_code: "",
      premium_amount: 0,
      term: {
        term_id: "",
        term: 0,
        term_unit: ""
      },
      benefits: []
    }
  },
  client: {
    branch: "",
    nik: "",
    full_name: "",
    pob: "",
    dob: null,
    marital_status: "",
    sex: "",
    address: "",
    phone: "",
    country_code: "",
    zip_code: "",
    province: "",
    province_id: "",
    city_id: "",
    district_id: "",
    subdistrict_id: "",
    city_name: "",
    district_name: "",
    subdistrict_name: "",
    job: "",
    income_code: "",
    income: "",
    benef_name: "",
    benef_phone: "",
    benef_country_code: "",
    benef_address: "",
    relation: ""
  },
  questionaire: {
    consent: [],
    health_questionnaire: []
  }
}

export const useSubmissionStore = create<TActionClient>()(
  persist((set) => ({
    submission: initalState,
    setSubmissionData: (data: SubmissionReq) => {
      set((state) => ({
        ...state,
        submission: data
      }))
    },
    resetSubmission: () => {
      set(() => ({
        submission: initalState,
      }))
    },
  }),
    {
      name: "submission-data-storage",
      storage: createJSONStorage(() => encryptedSessionStorage)
    })
);