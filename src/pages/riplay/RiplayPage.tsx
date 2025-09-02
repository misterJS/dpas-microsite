import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import FirstImage from "@/assets/riplay/1.png"
import SecondImage from "@/assets/riplay/2.png"
import ThirdImage from "@/assets/riplay/3.png"
import FourthImage from "@/assets/riplay/4.png"
import FifthImage from "@/assets/riplay/5.png"
import SixthImage from "@/assets/riplay/6.png"
import SeventhImage from "@/assets/riplay/7.png"
import { Button } from "@/components/ui/button"

export default function RiplayPage() {
  const navigate = useNavigate()
  const { t } = useTranslation("common")

  return (
    <div className="relative">
      <div className="pb-8">
        <img src={FirstImage} alt="FirstImage" className="block w-full h-full object-cover" loading="eager" />
        <img src={SecondImage} alt="SecondImage" className="block w-full h-full object-cover" loading="lazy" />
        <img src={ThirdImage} alt="ThirdImage" className="block w-full h-full object-cover" loading="lazy" />
        <img src={FourthImage} alt="FourthImage" className="block w-full h-full object-cover" loading="lazy" />
        <img src={FifthImage} alt="FifthImage" className="block w-full h-full object-cover" loading="lazy" />
        <img src={SixthImage} alt="SixthImage" className="block w-full h-full object-cover" loading="lazy" />
        <img src={SeventhImage} alt="SeventhImage" className="block w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <div className="px-4">
          <Button
            className="w-full h-14 rounded-[20px] bg-[#6AC3BE] hover:bg-[#5ab6b1] text-white text-xl font-semibold"
            onClick={() => navigate("/")}
          >
            {t("riplay.cta")}
          </Button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="block w-full mt-5 text-base font-normal text-black"
            aria-label={t("riplay.back")}
          >
            {t("riplay.back")}
          </button>
        </div>
      </div>
    </div>
  )
}
