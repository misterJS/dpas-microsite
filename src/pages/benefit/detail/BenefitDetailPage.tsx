import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import BenefitDetailForm from "./BenefitDetailForm"
import { Link, useParams } from "react-router-dom"
import { useProductDetail } from "@/hooks/useProducts"
import { IconPencil } from "@/assets"
import { LoadingComponent } from "@/components/common/LoadingComponent"
import { useState } from "react"

export default function BenefitDetailPage () {
    const { t } = useTranslation("common")
    const { id, brand } = useParams()
    const [isLoadingCompute, setIsLoadingCompute] = useState(false)
    const { data: detail, isLoading, isError } = useProductDetail(brand, id)
    return (
        <div className="space-y-6">
            <div className="flex mt-8 justify-between">
                <h1 className="text-2xl font-semibold">{t("content.protectKind")}</h1>
                <Link
                    to={`/${brand}/products`}
                    className="inline-flex items-center gap-2 font-semibold group"
                >
                    <span className="text-md">{t("actions.change")}</span>
                    <img src={IconPencil} />
                </Link>
            </div>
            {isError && <div className="p-2 text-red-600">{t("status.loadProductDetailFailed")}</div>}
            {detail && (
                <BenefitCard
                    title={detail.product_name}
                    description={detail.desc}
                    imageSrc={undefined}
                    href={`/${brand}/products`}
                    className="border-[#69C8C3]"
                />
            )}
            <BenefitDetailForm detail={detail} product_code={detail?.product_code} slug={brand} setIsLoadingCompute={setIsLoadingCompute} />
            <LoadingComponent open={isLoading || isLoadingCompute} />
        </div>
    )
}
