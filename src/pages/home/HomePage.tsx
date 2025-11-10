import { bannerLanding, itemLanding } from "@/assets"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { IoArrowForwardOutline } from "react-icons/io5"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import React, { useEffect } from "react";
import { useSubmissionStore } from "@/lib/store/submissionDataStore";
import { useIdempotencyStore } from "@/lib/store/idempotencyDataStore";

export default function HomePage() {
  const navigate = useNavigate()
  const { brand } = useParams()
  const { t } = useTranslation("common")
  const title = t("landing.title").split(" ")
  const [params] = useSearchParams()
  const reset_session = params.get("reset_session")
  const resetSubmission = useSubmissionStore(state => state.resetSubmission)
  const resetIdempotencyKey = useIdempotencyStore((state) => state.resetIdempotencyKey);

  function highlightPRU(text: string): React.ReactNode {
    const items = text.split(/(PRU)/g);
    return items.map((part, index) =>
      part === "PRU" ? (
        <span key={index} className="text-red-600 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  const Tittle = (props: { color?: string }) => {
    return (
      <div className="text-4xl font-light font-sans">
        <span className={`font-extrabold ${props.color}`}>{highlightPRU(title[0])}</span>
        <span>{title[1]}</span>
        <p>{title[2]}</p>
      </div>
    );
  };

  useEffect(() => {
    resetIdempotencyKey();
    resetSubmission()
  }, []);

  return (
    <div>
      <div className="relative">
        <img
          src={bannerLanding}
          alt={'image.banner'}
          className="block w-full object-cover"
          loading="lazy"
        />
        <div className="relative w-full h-32 bg-cover bg-center bg-[#F7F7F7]"></div>
        <div className="absolute right-0 max-w-80 bottom-[70px]">
          <div className="bg-white pl-5 pr-16 py-10 rounded-l-lg">
            <div className="font-semibold">{t("landing.lifeInsurance")}</div>
            <Tittle color="text-red-600" />
            <div className="text-base leading-7 text-foreground/80">{t("landing.subTittle")}</div>
            <Button
              className={cn("text-white bg-red-600 font-medium rounded-full text-lg px-5 py-2.5 text-center me-2 mb-2 mt-5")}
              onClick={() => navigate(`/${brand}/products`)}
              id="registerNow"
            >
              {t("landing.registerNow")}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-0">
        <div style={{ background: "linear-gradient(to left, #F7F7F7 50%, #E5EAEF 50%)" }} className="h-5"></div>
        <div className="mb-10">
          <img
            src={itemLanding}
            alt={'image.item'}
            className="block w-full aspect-[16/9] object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <div className="p-4">
        <Tittle />
        <p className="text-base leading-7 text-foreground/80 mt-3">
          {highlightPRU(t("landing.desc"))}
        </p>
        <div className="mt-5 mb-5">

          <Button
            className={cn("pl-0 inline-flex items-center gap-2 font-semibold text-black bg-transparent shadow-none text-base")}
            onClick={() => navigate(`/${brand}/pdf?type=check-riplay`)}
            id="checkRiplay"
          >
            <span>{t("landing.checkRiplay")}</span>
            <IoArrowForwardOutline
              aria-hidden
              className="text-[#E30613] text-[20px] shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
