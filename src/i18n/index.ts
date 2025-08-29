import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import id from "./locales/id/common.json"

const saved = localStorage.getItem("lang") || "id"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { common: id },
    },
    lng: saved,
    fallbackLng: "id",
    defaultNS: "common",
    interpolation: { escapeValue: false },
  })

export default i18n
