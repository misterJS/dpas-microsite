import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import { useProducts } from "@/hooks/useProducts"

export default function BenefitPage() {
  const { t } = useTranslation("common")
  const { data: products, isLoading, isError } = useProducts("uob")
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t("content.products")}</h1>
      {isLoading && <div className="p-2">Loading…</div>}
      {isError && <div className="p-2 text-red-600">Gagal memuat produk</div>}
      {products?.map((p) => (
        <BenefitCard
          key={p.productCode}
          title={p.productName}
          description={p.desc}
          imageSrc={p.image}
          href={`/products/${p.productCode}`}
          buttonTitle="Selengkapnya"
        />
      ))}
    </div>
  )
}
