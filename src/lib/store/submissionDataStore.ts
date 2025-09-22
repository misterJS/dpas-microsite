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
    productId: "",
    productCode: "",
    productName: "",
    package: {
      packageId: null,
      packageName: "",
      packageCode: "",
      premiumAmount: 0,
      term: {
        termId: 0,
        term: 0,
        termUnit: ""
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
    cityName: "",
    districtName: "",
    subdistrictName: "",
    job: "",
    income: "",
    benefName: "",
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