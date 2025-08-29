import React from "react"
import Logo from "@/assets/logo-pru-uob.png"
import Family from "@/assets/family.png"
import { useTranslation } from "react-i18next"


export default function HeroHeader() {
    const { t } = useTranslation("common")
    return (
        <section className="relative z-[60] pt-1 isolate overflow-hidden bg-white">
            <div className="w-full">
                <div className="flex justify-between items-center gap-6">
                    <div className="flex items-center ml-4">
                        <img
                            src={Logo}
                            alt={t("hero.alt.logo")}
                            width={93}
                            height={66}
                            loading="eager"
                        />
                    </div>
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-xs font-bold tracking-tight">
                                <span className="text-[#E30613]">{t("hero.title.left")}</span>{" "}
                                <span className="text-teal-400">{t("hero.title.right")}</span>
                            </h1>
                            <p className="text-[10px] text-black">
                                {t("hero.subtitle")}
                            </p>
                        </div>

                        <div
                            className="ml-auto max-w-[540px] rounded-l-2xl overflow-hidden"
                            style={{
                                WebkitMaskImage:
                                    "linear-gradient(to left, black 75%, transparent 100%)",
                                maskImage: "linear-gradient(to left, black 75%, transparent 100%)",
                            }}
                        >
                            <img
                                src={Family}
                                alt="Keluarga"
                                className="block object-cover"
                                width={90}
                                height={86}
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
