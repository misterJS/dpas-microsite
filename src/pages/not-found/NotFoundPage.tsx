import { useTranslation } from "react-i18next"

export default function NotFoundPage() {
  const { t } = useTranslation("common")
  return (
    <div className="text-center mt-32">
      <div className="text-5xl font-bold">{t("content.titleNotFound")}</div>
      <div className="text-lg">{t("content.descNotFound")}</div>
    </div>
  )
}
