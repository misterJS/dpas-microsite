import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import BenefitDetailForm from "./BenefitDetailForm"

export default function BenefitDetailPage () {
    const { t } = useTranslation("common")
    return (
        <div className="space-y-6">
            <h1 className="text-2xl mt-8">{t("content.protectKind")}</h1>
            <BenefitCard
                title="Accident"
                description="Klaim Cacat Total hanya dapat dilakukan 1 kali untuk 1 jenis Cacat Total dan Manfaat Asuransi Cacat Total berakhir."
                imageSrc={undefined}
                href="/benefit"
                buttonTitle="Ubah jenis perlindungan"
            />
            <BenefitDetailForm />
        </div>
    )
}