import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import MedalSilver from "@/assets/Medal Silver 1.png"
import FixedBottomBar from "@/components/common/FixedBottomBar"

type SummaryData = {
    nik: string
    email: string
    dob: string
    fullName: string
    pob: string
    gender: string
    address: string
    months: number | string
    price: string
    planType?: "silver" | "gold" | "platinum"
}

type AckValues = {
    exclusionAck: "yes" | "no"
    shareAck1: "yes" | "no"
    shareAck2: "yes" | "no"
    decAck1: "yes" | "no"
    decAck2: "yes" | "no"
    decAck3: "yes" | "no"
}

export default function ConsentPage() {
    const { t } = useTranslation("common")

    const tList = (key: string): string[] => {
        const v = t(key, { returnObjects: true }) as unknown
        if (Array.isArray(v)) return v as string[]
        if (v && typeof v === "object") return Object.values(v as Record<string, unknown>).map(String)
        if (typeof v === "string") return [v]
        return []
    }

    const exclusionItems = tList("consent.exclusion.items")
    const shareItems = tList("consent.share.items")
    const decParas = tList("consent.declaration.paras")

    const navigate = useNavigate()
    const location = useLocation() as { state?: Partial<SummaryData> }

    const data: SummaryData = {
        nik: "1234567890123456",
        email: "example@gmail.com",
        dob: "01-01-2023",
        fullName: "Prudential Syariah",
        pob: "Jakarta",
        gender: "Male",
        address: "St. Sudirman, Jakarta Selatan",
        months: location.state?.months ?? "X",
        price: location.state?.price ?? t("consent.priceSample"),
        planType: location.state?.planType ?? "silver",
        ...location.state,
    }

    const planMedal = {
        silver: MedalSilver,
        gold: MedalSilver,
        platinum: MedalSilver,
    }[data.planType ?? "silver"]

    const schema = z.object({
        exclusionAck: z.enum(["yes", "no"], { message: t("consent.exclusion.required") }),
        shareAck1: z.enum(["yes", "no"], { message: t("consent.share.required") }),
        shareAck2: z.enum(["yes", "no"], { message: t("consent.share.required") }),
        decAck1: z.enum(["yes", "no"], { message: t("consent.declaration.required") }),
        decAck2: z.enum(["yes", "no"], { message: t("consent.declaration.required") }),
        decAck3: z.enum(["yes", "no"], { message: t("consent.declaration.required") }),
    })

    const form = useForm<AckValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            exclusionAck: undefined as unknown as AckValues["exclusionAck"],
            shareAck1: undefined as unknown as AckValues["shareAck1"],
            shareAck2: undefined as unknown as AckValues["shareAck2"],
            decAck1: undefined as unknown as AckValues["decAck1"],
            decAck2: undefined as unknown as AckValues["decAck2"],
            decAck3: undefined as unknown as AckValues["decAck3"],
        },
        mode: "onChange",
    })

    const onSubmit = () => navigate("/")

    const canSubmit =
        form.watch("exclusionAck") === "yes" &&
        !!form.watch("shareAck1") &&
        !!form.watch("shareAck2") &&
        form.watch("decAck1") === "yes" &&
        form.watch("decAck2") === "yes" &&
        form.watch("decAck3") === "yes"

    const FORM_ID = "consent-form"

    return (
        <div className="min-h-screen">
            <Card className="rounded-[22px] border bg-white">
                <div className="grid grid-cols-[130px,1fr] rounded-t-[22px] overflow-hidden">
                    <div className="relative bg-[#ED1B2E]">
                        <img src={planMedal} alt="Medal paket" className="absolute left-2 -top-4 w-44 h-44 object-contain" />
                    </div>
                    <div className="bg-[#ED1B2E] text-white">
                        <div className="h-full pr-5 py-6 flex items-center justify-end text-right">
                            <div>
                                <p className="text-[20px] leading-tight font-normal">{t("consent.summaryTitle")}</p>
                                <p className="text-[16px] mt-1">{String(data.months)} {t("consent.monthsSuffix")}</p>
                                <p className="text-2xl font-normal mt-2">{data.price}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-5 space-y-6">
                    <dl className="grid grid-cols-1 gap-y-4">
                        <Row label={t("consent.fields.nik")} value={data.nik} />
                        <Row label={t("consent.fields.email")} value={data.email} />
                        <Row label={t("consent.fields.dob")} value={data.dob} />
                        <Row label={t("consent.fields.fullName")} value={data.fullName} />
                        <Row label={t("consent.fields.pob")} value={data.pob} />
                        <Row label={t("consent.fields.gender")} value={data.gender} />
                        <Row label={t("consent.fields.address")} value={data.address} />
                    </dl>

                    <h2 className="text-center text-[#54BDB7] text-2xl font-semibold">{t("consent.tncTitle")}</h2>

                    <div className="space-y-4 text-[#666]">
                        <p className="font-medium">{t("consent.ripleyHeading")}</p>
                        <p className="leading-6">{t("consent.p1")}</p>
                        <p className="leading-6">{t("consent.p2")}</p>
                        <div className="leading-6">
                            <p>{t("consent.accessLead")}</p>
                            <p className="text-[#ED1B2E] font-medium break-all">
                                {t("consent.accessLinkShort")}
                                <br />
                                {t("consent.accessLinkText")}
                            </p>
                        </div>
                        <p className="leading-6">{t("consent.sendNote")}</p>
                        <hr className="mt-2" />
                    </div>

                    <Form {...form}>
                        <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <section className="relative">
                                <h3 className="text-center font-semibold text-[18px] text-[#4B4B4B]">{t("consent.exclusion.title")}</h3>
                                <span className="absolute right-0 top-0 text-red-500 text-lg">*</span>
                                <p className="text-[13px] text-[#4B4B4B] mt-2">{t("consent.exclusion.lead")}</p>
                                <ol className="mt-3 list-decimal pl-5 text-[13px] leading-5 text-[#4B4B4B] space-y-2">
                                    {exclusionItems.map((it, i) => <li key={i}>{it}</li>)}
                                </ol>
                                <p className="text-[13px] text-[#4B4B4B] mt-3">{t("consent.exclusion.footnote")}</p>
                                <FormField
                                    control={form.control}
                                    name="exclusionAck"
                                    render={({ field }) => (
                                        <FormItem className="mt-4 space-y-3">
                                            <FormControl>
                                                <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                                    <label className="flex items-center gap-2">
                                                        <RadioGroupItem value="yes" id="ack-yes" />
                                                        <span className="text-[14px] text-[#4B4B4B]">{t("consent.exclusion.ackYes")}</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <RadioGroupItem value="no" id="ack-no" />
                                                        <span className="text-[14px] text-[#4B4B4B]">{t("consent.exclusion.ackNo")}</span>
                                                    </label>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </section>

                            <section className="relative">
                                <h3 className="uppercase font-semibold text-[16px] text-[#4B4B4B]">{t("consent.share.title")}</h3>
                                <p className="text-[13px] text-[#4B4B4B] mt-2">{t("consent.share.lead")}</p>
                                <ol className="mt-3 list-decimal pl-5 text-[13px] leading-5 text-[#4B4B4B] space-y-2">
                                    {shareItems.map((it, i) => <li key={i}>{it}</li>)}
                                </ol>
                                <p className="text-[13px] text-[#4B4B4B] mt-3">
                                    {t("consent.share.footnote")}{" "}
                                    <span className="text-[#ED1B2E] font-medium break-all">{t("consent.share.linkThirdParty")}</span>{" "}
                                    {t("consent.share.separator")}{" "}
                                    <span className="text-[#ED1B2E] font-medium break-all">{t("consent.share.linkPrivacy")}</span>
                                </p>

                                <div className="relative mt-4">
                                    <span className="absolute right-0 -top-1 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] text-[#4B4B4B]">{t("consent.share.q1.title")}</p>
                                    <FormField
                                        control={form.control}
                                        name="shareAck1"
                                        render={({ field }) => (
                                            <FormItem className="mt-2 space-y-3">
                                                <FormControl>
                                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="yes" id="s1-yes" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.share.yes")}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="no" id="s1-no" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.share.no")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="relative mt-4">
                                    <span className="absolute right-0 -top-1 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] text-[#4B4B4B]">{t("consent.share.q2.title")}</p>
                                    <FormField
                                        control={form.control}
                                        name="shareAck2"
                                        render={({ field }) => (
                                            <FormItem className="mt-2 space-y-3">
                                                <FormControl>
                                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="yes" id="s2-yes" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.share.yes")}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="no" id="s2-no" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.share.no")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>
                            <hr className="mt-2" />
                            <section className="relative">
                                <h3 className="uppercase font-semibold text-[16px] text-[#4B4B4B]">{t("consent.declaration.title")}</h3>

                                <div className="mt-2 space-y-2 text-[13px] text-[#4B4B4B]">
                                    <p>{t("consent.declaration.intro1")}</p>
                                    <p>{t("consent.declaration.intro2")}</p>
                                </div>

                                <div className="relative mt-4">
                                    <span className="absolute right-0 -top-1 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] text-[#4B4B4B]">{t("consent.declaration.b1")}</p>
                                    <FormField
                                        control={form.control}
                                        name="decAck1"
                                        render={({ field }) => (
                                            <FormItem className="mt-2 space-y-3">
                                                <FormControl>
                                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="yes" id="d1-yes" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.declaration.yes")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="relative mt-4">
                                    <span className="absolute right-0 -top-1 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] text-[#4B4B4B]">{t("consent.declaration.b2")}</p>
                                    <FormField
                                        control={form.control}
                                        name="decAck2"
                                        render={({ field }) => (
                                            <FormItem className="mt-2 space-y-3">
                                                <FormControl>
                                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="yes" id="d2-yes" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.declaration.yes")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="relative mt-4 mb-28">
                                    <span className="absolute right-0 -top-1 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] text-[#4B4B4B] font-medium">{t("consent.declaration.blockTitle")}</p>
                                    <div className="mt-2 space-y-2 text-[13px] text-[#4B4B4B]">
                                        {decParas.map((p, i) => <p key={i}>{p}</p>)}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="decAck3"
                                        render={({ field }) => (
                                            <FormItem className="mt-2 space-y-3">
                                                <FormControl>
                                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="yes" id="d3-yes" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("consent.declaration.yes")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>
                            <FixedBottomBar>
                                <div className="bg-white border-t pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
                                    <div className="px-4 space-y-3">
                                        <Button
                                            form={FORM_ID}
                                            type="submit"
                                            disabled={!canSubmit}
                                            className="w-full h-12 rounded-[16px] bg-[#6AC3BE] hover:bg-[#5ab6b1] text-white text-base font-semibold disabled:bg-[#BDBDBD]"
                                        >
                                            {t("consent.ctaAgree")}
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="w-full h-12 rounded-[16px] text-base font-semibold text-[#222]"
                                            aria-label={t("consent.ctaBack")}
                                        >
                                            {t("consent.ctaBack")}
                                        </button>
                                    </div>
                                </div>
                            </FixedBottomBar>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[150px,1fr] gap-x-4">
            <dt className="text-[#6B6B6B] font-semibold">{label}</dt>
            <dd className="text-[#4B4B4B]">{value}</dd>
        </div>
    )
}
