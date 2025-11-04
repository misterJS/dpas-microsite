import { useTranslation } from "react-i18next"
import { headerBanner } from "@/assets"

export default function HeroHeader(props: { showHeader?: boolean }) {
    const { showHeader } = props
    const { t } = useTranslation("common")
    return (
        <>
            {showHeader &&
                <section className="relative z-[60] isolate overflow-hidden bg-white">
                    <div className="w-full">
                        <img
                            src={headerBanner}
                            alt={t("hero.alt.logo")}
                            width={"100%"}
                            loading="eager"
                        />
                    </div>
                </section>
            }
        </>
    )
}
