import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import BenefitDetailForm from "./BenefitDetailForm"
import { useParams } from "react-router-dom"
import { useProductDetail } from "@/hooks/useProducts"

export default function BenefitDetailPage () {
    const { t } = useTranslation("common")
    const { id } = useParams()
    const { data: detail, isLoading, isError } = useProductDetail("uob", id)
    return (
        <div className="space-y-6">
            <h1 className="text-2xl mt-8">{t("content.protectKind")}</h1>
            {isLoading && <div className="p-2">{t("status.loading")}</div>}
            {isError && <div className="p-2 text-red-600">{t("status.loadProductDetailFailed")}</div>}
            {detail && (
                <BenefitCard
                    title={detail.productName}
                    description={detail.desc}
                    imageSrc={undefined}
                    href="/products"
                    buttonTitle={t("actions.changeProtection")}
                />
            )}
            <BenefitDetailForm detail={detail} productCode={id} slug="uob" />
        </div>
    )
}
