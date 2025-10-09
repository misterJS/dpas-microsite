import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { encryptedSessionStorage } from "./encrypt-storage";
import { SubmissionReq } from "@/api/types";

type TActionClient = {
  submission: SubmissionReq
  setSubmissionData: (data: SubmissionReq) => void
}

const initalState: SubmissionReq = {
  product: {
    product_id: "",
    product_code: "",
    product_name: "",
    package: {
      package_id: null,
      package_name: "",
      package_code: "",
      premium_amount: 0,
      term: {
        term_id: 0,
        term: 0,
        term_unit: ""
      },
      benefits: []
    }
  },
  client: {
    nik: "",
    fullName: "",
    pob: "",
    dob: new Date(),
    maritalStatus: "",
    sex: "",
    address: "",
    phone: "",
    countryCode: "",
    zipCode: "",
    province: "",
    city_name: "",
    district_name: "",
    subdistrict_name: "",
    job: "",
    income: "",
    benef_name: "",
    benefPhone: "",
    benefCountryCode: "",
    benefAddress: "",
    relation: ""
  },
  questionaire: {
    consent: [],
    healthQuestionnaire: []
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
  }),
  {
    name: "submission-data-storage",
    storage: createJSONStorage(() => encryptedSessionStorage)
  })
);