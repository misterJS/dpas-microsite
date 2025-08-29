import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import AccidentImg from "@/assets/accident.png"

export default function BenefitPage() {
  const { t } = useTranslation("common")
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t("content.products")}</h1>
      <BenefitCard
        title="Accident"
        description="Perlindungan Manfaat Meninggal Dunia Akibat Kecelakaan, dengan Santunan Asuransi atas risiko meninggal dunia yang diakibatkan oleh Kecelakaan hingga Rp54.000.000"
        imageSrc={AccidentImg}
        href="/benefit/1"
        buttonTitle="Selengkapnya"
      />
      <BenefitCard
        title="Accident and Disability"
        description="Perlindungan Manfaat Meninggal Dunia Akibat Kecelakaan, dengan Santunan Asuransi atas risiko meninggal dunia yang diakibatkan oleh Kecelakaan hingga Rp54.000.000"
        imageSrc={AccidentImg}
        href="/benefit/2"
        buttonTitle="Selengkapnya"
      />
    </div>
  )
}
