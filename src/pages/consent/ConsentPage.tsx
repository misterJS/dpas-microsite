import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import moment from 'moment';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Logo from "@/assets/logo-pru-uob.png"
import Family from "@/assets/family.png"
import FixedBottomBar from "@/components/common/FixedBottomBar"
import { useQuestions } from "@/hooks/useQuestions"
import { SubmissionReq } from "@/api/types"
import { useSubmissionStore } from "@/lib/store/submissionDataStore"
import { useCreateSPAJ, useSubmissionProposal } from "@/hooks/useProposal"
import { DialogComponent } from "@/components/common/DialogComponent"
import MarkdownRenderer from "@/components/ui/markdown"
import { LoadingComponent } from "@/components/common/LoadingComponent"
import { getImageUrl } from "@/helper/useDynamicFiles"

type SummaryData = {
    nik: string
    email: string
    dob: string
    full_name: string
    pob: string
    gender: string
    address: string
    months: number | string
    price: string
    plan_type?: "silver" | "gold" | "platinum"
}

type CreateSPAJResponse = { spaj_number: string };

export default function ConsentPage() {
    const { t } = useTranslation("common")
    const navigate = useNavigate()
    const { brand } = useParams()
    const location = useLocation() as { state?: Partial<SummaryData> }
    const [rejectOpen, setRejectOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { submission, setSubmissionData } = useSubmissionStore();

    const [params] = useSearchParams()
    const product_code = params.get("product") || "ACC"

    const { mutate: mutateSubmit } = useSubmissionProposal();
    const { mutate: mutateCreateSPAJ } = useCreateSPAJ<undefined, unknown, unknown, CreateSPAJResponse>();
    const { data: questions = [], isLoading: loadingConsent, isError } = useQuestions(brand, product_code, 'CONSENT')


    const data: SummaryData = {
        nik: submission.client.nik,
        email: submission.client.email ?? '',
        dob: moment(submission.client.dob).format('DD/MM/YYYY'),
        full_name: submission.client.full_name,
        pob: submission.client.pob,
        gender: submission.client.sex,
        address: submission.client.address,
        months: location.state?.months ?? "X",
        price: location.state?.price ?? t("consent.priceSample"),
        plan_type: location.state?.plan_type ?? "silver",
        ...location.state,
    }


    const schema = z.object(
        questions.flatMap(group => group.question).reduce((acc, q) => {
            if (q.answer_type === "YES_NO") {
                acc[q.code] = z.enum(["yes", "no"], { message: t("menu.schema.requiredOption") });
            } else {
                acc[q.code] = z.literal("yes", { message: t("menu.schema.requiredOption") });
            }
            return acc;
        }, {} as Record<string, z.ZodTypeAny>)
    );

    type AckValues = z.infer<typeof schema>;

    const form = useForm<AckValues>({
        resolver: zodResolver(schema),
        defaultValues: {},
        mode: "onChange",
    });

    useEffect(() => {
        const consentAnswers = submission?.questionaire?.consent;
        if (!Array.isArray(consentAnswers) || !questions.length) return;
        const defaults: Record<string, string> = {};
        questions.flatMap(group => group.question).forEach(q => {
            const answerObj = consentAnswers.find(a => a.question_code === q.code);
            if (answerObj) defaults[q.code] = answerObj.answer;
        });

        form.reset(defaults);
    }, [submission, questions, form]);

    const watchAllField = form.watch()

    const onSubmit = (v: z.infer<typeof schema>) => {
        const allQualified = Object.values(v as Record<string, string>).every((ans) => ans === "yes");
        if (allQualified) handleSetData()
        else setRejectOpen(true)
    }

    const handleSetData = () => {
        setIsLoading(true)
        const dataQuestions = questions.flatMap(group => group.question).map(item => ({
            question_id: item.id,
            question_code: item.code,
            question_text: item.question_text,
            question_type: item.type,
            question_answer_type: item.answer_type,
            answer: watchAllField[item.code]
        }));

        const formatDob = moment(submission?.client?.dob).format('YYYYMMDD')
        const paramsSubmit: SubmissionReq = {
            ...submission,
            client: {
                ...submission.client,
                dob: formatDob,
            },
            questionaire: {
                ...submission.questionaire,
                consent: dataQuestions,
            }
        }

        mutateCreateSPAJ(undefined, {
            onSuccess: (response) => {
                const spajNumber = response.spaj_number;

                if (!spajNumber) {
                    setIsLoading(false);
                    setRejectOpen(true);
                    return;
                }

                const finalPayload: SubmissionReq = {
                    ...paramsSubmit,
                    spaj_number: spajNumber,
                };

                mutateSubmit(finalPayload, {
                    onSuccess: () => {
                        setIsLoading(false)
                        setSubmissionData(finalPayload)
                        navigate(`/${brand}/waiting-status?spaj_number=${spajNumber}`)
                    },
                    onError: (err) => { setIsLoading(false); setRejectOpen(true) }
                });
            },
            onError: (err) => { setIsLoading(false); setRejectOpen(true) }
        });
    }

    const canSubmit =
        Object.values(watchAllField).length > 0 &&
        Object.values(watchAllField).every(v => v !== undefined);

    const FORM_ID = "consent-form"

    const formattedAmount = (price?: number | string) => {
        if (price === undefined || price === null) return "-";
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        });
        return formatter.format(Number(price));
    };

    return (
        <div className="min-h-screen">
            <Card className="rounded-[22px] border bg-white">
                <div className="flex justify-center mt-10 mb-5">
                    <img
                        src={Logo}
                        alt={t("hero.alt.logo")}
                        width={150}
                        loading="eager"
                    />
                </div>
                <div className="text-center mb-4">
                    <div className="font-bold text-2xl">
                        <span className="text-[#ED1B2E]">{t("hero.title.left")}</span>
                        <span className="text-[#69C8C3]"> {t("hero.title.right")}</span>
                    </div>
                    <div className="text-sm">{t("consent.accidentInsurance")}</div>
                </div>
                <div className="flex items-center bg-[#69C8C3] overflow-hidden">
                    <div className="p-4 w-full bg-[#69C8C3] text-white">
                        <div className="font-bold text-lg">{submission?.product?.product_name}</div>
                        <div className="font-bold">{t("consent.summaryTitle")} {submission.product.package.package_name} ({submission.product.package.term.term} {t("consent.monthsSuffix")})</div>
                        <div className="">{formattedAmount(submission?.product?.package?.premium_amount ?? 0)}</div>
                    </div>

                    <div className="relative w-[220px] h-full">
                        <img
                            src={getImageUrl(submission?.product?.product_image)}
                            alt="Keluarga"
                            className="object-cover h-32"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#69C8C3] via-[#69C8C3]/60 to-transparent" />
                    </div>
                </div>

                <CardContent className="p-5 space-y-6">
                    <dl className="grid grid-cols-1 gap-y-4">
                        <Row label={t("consent.fields.nik")} value={data.nik} />
                        <Row label={t("consent.fields.fullName")} value={data.full_name} />
                        <Row label={t("consent.fields.pob")} value={data.pob} />
                        <Row label={t("consent.fields.dob")} value={data.dob} />
                        <Row label={t("consent.fields.gender")} value={t(`menu.options.genders.${data.gender}`)} />
                        <Row label={t("consent.fields.email")} value={data.email} />
                        <Row label={t("consent.fields.address")} value={data.address} />
                    </dl>
                </CardContent>
            </Card>

            <div className="p-5 space-y-6">
                <h2 className="text-center text-[#54BDB7] text-2xl font-semibold">{t("consent.tncTitle")}</h2>

                <div className="space-y-4 text-[#666]">
                    <p className="font-normal">{t("consent.ripleyHeading")}</p>
                    <p className="leading-6">{t("consent.p1")}</p>
                    <p className="leading-6">{t("consent.p2")}</p>
                    <div className="leading-6" onClick={() => navigate(`/${brand}/pdf?type=riplay`)}>
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
                    <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        {isError && <p className="text-sm text-red-500">{t("content.FailedToLoad")}</p>}
                        {!isLoading && !isError && questions.map((q, idx) => (
                            <section className="relative" key={`${q}-${idx}`}>
                                <h3 className="font-bold text-[16px] text-[#4B4B4B]">{q.group_label}</h3>
                                {q.question.map((item, idx) => (
                                    <div key={`${item}-${idx}`}>
                                        <div className="flex">
                                            <MarkdownRenderer content={item.question_text} />
                                            <div className="text-[#ED1B2E] mt-2">*</div>
                                        </div>

                                        <div className="relative mt-4">
                                            <FormField
                                                control={form.control}
                                                name={item.code}
                                                render={({ field }) => (
                                                    <FormItem className="mt-2 space-y-3">
                                                        <FormControl>
                                                            <RadioGroup onValueChange={field.onChange} value={field.value || ""} className="space-y-3">
                                                                {item.answer_type === "YES_NO" ? (
                                                                    <>
                                                                        <label className="flex items-center gap-2">
                                                                            <RadioGroupItem value="yes" id={`${item.code}-yes`} />
                                                                            <span className="text-[14px] text-[#4B4B4B] font-bold">{item.yes_label}</span>
                                                                        </label>
                                                                        <label className="flex items-center gap-2">
                                                                            <RadioGroupItem value="no" id={`${item.code}-no`} />
                                                                            <span className="text-[14px] text-[#4B4B4B] font-bold">{item.no_label}</span>
                                                                        </label>
                                                                    </>
                                                                ) : (
                                                                    <label className="flex items-center gap-2">
                                                                        <RadioGroupItem value="yes" id={`${item.code}-yes`} />
                                                                        <span className="text-[14px] text-[#4B4B4B] font-bold">{item.yes_label}</span>
                                                                    </label>
                                                                )}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {questions.length - 1 !== idx && <hr className="mt-5" />}
                            </section>
                        ))}

                        <FixedBottomBar>
                            <div className="bg-white border-t pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
                                <div className="px-4 space-y-3">
                                    <Button
                                        form={FORM_ID}
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="w-full h-12 rounded-[16px] bg-[#2A504E] hover:bg-[#5ab6b1] text-white text-base font-semibold disabled:bg-[#BDBDBD]"
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
            </div>
            <DialogComponent
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                title={t("health.reject.title")}
                description={t("health.reject.body")}
                primaryLabel={t("health.reject.close")}
                onPrimary={() => setRejectOpen(false)}
                secondaryLabel={t("health.reject.home")}
                secondaryTo={`/${brand}?reset_session=true`}
            />
            <LoadingComponent open={isLoading || loadingConsent} />
        </div>
    )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-2">
            <dt className="text-[#6B6B6B] font-semibold">{label}</dt>
            <dd className="text-[#4B4B4B] break-words">{value}</dd>
        </div>
    )
}
