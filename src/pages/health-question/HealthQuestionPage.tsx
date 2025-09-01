import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { DialogComponent } from "@/components/common/DialogComponent"

type FormValues = { q1: "ya" | "tidak"; q2: "ya" | "tidak" }

export default function HealthQuestionsPage() {
    const { t } = useTranslation("common")
    const navigate = useNavigate()
    const [rejectOpen, setRejectOpen] = useState(false)

    const schema = useMemo(
        () =>
            z.object({
                q1: z.enum(["ya", "tidak"], { message: t("health.required") }),
                q2: z.enum(["ya", "tidak"], { message: t("health.required") }),
            }),
        [t]
    )

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { q1: undefined as unknown as FormValues["q1"], q2: undefined as unknown as FormValues["q2"] },
    })

    const onSubmit = (v: FormValues) => {
        const notQualified = v.q1 === "ya" || v.q2 === "ya"
        if (notQualified) setRejectOpen(true)
        else navigate("/ringkasan-produk")
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            <div className="pt-4 pb-6">
                <Card className="rounded-[20px] shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)]">
                    <CardContent className="p-5 md:p-6">
                        <h1 className="text-2xl md:text-[26px] font-semibold text-[#6AC3BE] mb-3">{t("health.title")}</h1>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                                <div className="relative">
                                    <span className="absolute right-1 top-0 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] leading-5 text-[#4B4B4B]">1. {t("health.q1")}</p>
                                    <FormField
                                        control={form.control}
                                        name="q1"
                                        render={({ field }) => (
                                            <FormItem className="mt-3 space-y-3">
                                                <FormControl>
                                                    <RadioGroup className="space-y-3" value={field.value} onValueChange={field.onChange}>
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="ya" id="q1-ya" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("health.yes")}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="tidak" id="q1-tidak" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("health.no")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="relative">
                                    <span className="absolute right-1 top-0 text-red-500 text-lg">*</span>
                                    <p className="text-[13px] leading-5 text-[#4B4B4B]">2. {t("health.q2")}</p>
                                    <FormField
                                        control={form.control}
                                        name="q2"
                                        render={({ field }) => (
                                            <FormItem className="mt-3 space-y-3">
                                                <FormControl>
                                                    <RadioGroup className="space-y-3" value={field.value} onValueChange={field.onChange}>
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="ya" id="q2-ya" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("health.yes")}</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <RadioGroupItem value="tidak" id="q2-tidak" />
                                                            <span className="text-[14px] text-[#4B4B4B]">{t("health.no")}</span>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!form.formState.isValid}
                                    className="w-full h-12 rounded-[14px] text-base font-semibold disabled:bg-[#BDBDBD] bg-[#ED1B2E] text-white"
                                >
                                    {t("form.next")}
                                </Button>

                                <div className="text-center text-[#4B4B4B]">
                                    <Link to={-1 as unknown as string} className="font-medium">
                                        {t("health.back")}
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <DialogComponent
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                title={t("health.reject.title")}
                description={t("health.reject.body")}
                primaryLabel={t("health.reject.close")}
                onPrimary={() => setRejectOpen(false)}
                secondaryLabel={t("health.reject.home")}
                secondaryTo="/"
            />
        </div>
    )
}
