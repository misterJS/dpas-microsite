import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import { useProducts } from "@/hooks/useProducts"

export default function BenefitPage() {
  const { t } = useTranslation("common")
  const { data: products, isLoading, isError } = useProducts("uob")
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t("content.products")}</h1>
      {isLoading && <div className="p-2">{t("status.loading")}</div>}
      {isError && <div className="p-2 text-red-600">{t("status.loadProductsFailed")}</div>}
      {products?.map((p) => (
        <BenefitCard
          key={p.productCode}
          title={p.productName}
          description={p.desc}
          imageSrc={p.image}
          href={`/products/${p.productCode}?type=riplay`}
          buttonTitle={t("actions.readMore")}
        />
      ))}
    </div>
  )
}
