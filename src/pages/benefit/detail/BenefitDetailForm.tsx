import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { SelectSeparator } from "@radix-ui/react-select"
import { ChevronDown, ChevronUp } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import FixedBottomBar from "@/components/common/FixedBottomBar"
import { useNavigate } from "react-router-dom"
import { FloatingSelect } from "@/components/form/floating-select"

const schema = z.object({
    planType: z.enum(["silver", "gold", "platinum"], { message: "Pilih paket" }),
    coverage: z.enum(["6", "12"], { message: "Pilih coverage" }),
})

type FormValues = z.infer<typeof schema>

export default function BenefitDetailForm() {
    const { t } = useTranslation("common")
    const navigate = useNavigate()
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            planType: undefined as unknown as FormValues["planType"],
            coverage: undefined as unknown as FormValues["coverage"],
        },
    })

    const onSubmit = (values: FormValues) => {
        console.log("Submit:", values)
        navigate('/register')
    }
    const [open, setOpen] = useState(false)
    const startY = useRef<number | null>(null)
    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY
    }
    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY.current == null) return
        const delta = e.touches[0].clientY - startY.current
        if (delta > 60) {
            setOpen(false)
            startY.current = null
        }
    }
    const planLabel =
        form.watch("planType") ? t(`form.plan.${form.watch("planType")}`) : t("form.plan.silver")
    const termLabel =
        form.watch("coverage") === "12" ? t("form.coverage_12months") : t("form.coverage_6months")
    const FORM_ID = "benefit-form"
    return (
        <Form {...form}>
            <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="coverage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-2xl font-normal">
                                {t("content.planTerm")}
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid gap-3 md:grid-cols-2 !mt-5"
                                >
                                    <div className="flex items-center space-x-2 rounded-md">
                                        <RadioGroupItem value="6" id="cov-6" />
                                        <Label htmlFor="cov-6" className="cursor-pointer">
                                            {t("form.coverage_6months")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md">
                                        <RadioGroupItem value="12" id="cov-12" />
                                        <Label htmlFor="cov-12" className="cursor-pointer">
                                            {t("form.coverage_12months")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <p className="text-2xl font-normal !-mb-4">{t("form.planType_ph")}</p>
                <FormField
                    control={form.control}
                    name="planType"
                    render={({ field }) => (
                        <FloatingSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            label={<>{t("form.planType_ph")}<span className="text-red-500"> *</span></>}
                            wrapperClassName="rounded-[12px]"
                        >
                            <SelectItem value="silver">{t("form.plan.silver")}</SelectItem>
                            <SelectSeparator className="mx-3" />
                            <SelectItem value="gold">{t("form.plan.gold")}</SelectItem>
                            <SelectSeparator className="mx-3" />
                            <SelectItem value="platinum">{t("form.plan.platinum")}</SelectItem>
                        </FloatingSelect>
                    )}
                />

                <hr />
                <h1 className="text-2xl">{t("form.notes_ph")}</h1>
                <p className="text-base text-[#ED1B2E]">{t("form.product_desc")}</p>
                <p className="text-base text-[#ED1B2E]">{t("form.exceptional_protect")}</p>
                <p className="text-base text-[#ED1B2E]">{t("form.snk")}</p>
                <p className="text-base text-[#ED1B2E]">{t("form.applied_claim_document")}</p>
                <FixedBottomBar>
                    <button
                        type="button"
                        onClick={() => setOpen(v => !v)}
                        aria-expanded={open}
                        className="w-full flex items-center justify-center gap-1 text-sm text-white bg-[#CF1829] p-2"
                    >
                        {open ? <ChevronUp /> : <ChevronDown />}
                        <p>{t("form.benefit_desc")}</p>
                    </button>

                    <div className="p-4 flex items-center justify-between bg-[#ED1B2E] text-white">
                        <div className="space-y-1">
                            <p className="text-sm font-thin">{t("form.contributeTotal")}:</p>
                            <h1 className="text-xl">Rp 18.000</h1>
                        </div>
                        <Button form={FORM_ID} type="submit" variant="outline"
                            className="w-1/2 bg-[#ED1B2E] border-white md:w-auto">
                            {t("form.next")}
                        </Button>
                    </div>
                </FixedBottomBar>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent
                        side="bottom"
                        className="p-0 rounded-t-2xl bottom-28"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                    >
                        <div className="sticky top-0 z-10 bg-background">
                            <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-muted" />
                            <div className="px-4 pb-3 pt-2">
                                <SheetHeader className="text-left">
                                    <SheetTitle className="text-lg">{t("content.planVariant")}</SheetTitle>
                                    <SheetDescription className="text-sm text-muted-foreground">
                                        Kecelakaan
                                    </SheetDescription>
                                </SheetHeader>
                            </div>
                        </div>
                        <div className="px-4 pb-6 space-y-2 overflow-hidden h-fit">
                            <section className="space-y-1">
                                <h3 className="font-semibold">{t("form.planType_ph")}</h3>
                                <p>{planLabel}</p>
                            </section>

                            <section className="space-y-1">
                                <h3 className="font-semibold">{t("content.planTerm")}</h3>
                                <p>{termLabel}</p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="font-semibold">{t("form.benefit_desc")}</h3>
                                <div className="text-sm leading-6">
                                    <p className="font-medium">{t("form.basicBenefit")}</p>
                                    <p>Manfaat meninggal dunia <br />Rp 3.000.000</p>
                                    <p className="mt-3 font-medium">Manfaat tambahan:</p>
                                    <p>Manfaat cacat total akibat kecelakaan<br />Rp 6.000.000</p>
                                    <p>Manfaat meninggal dunia akibat kecelakaan<br />Rp 18.000.000</p>
                                </div>
                            </section>

                            <hr className="my-2" />
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span>{t("form.totalContributionPayable")}</span>
                                <span className="text-[#ED1B2E] font-medium">Rp 18.000</span>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </form>
        </Form>
    )
}
