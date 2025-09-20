import { useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
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

export default function ConsentPage() {
  const { t } = useTranslation("common")
  const { submission, setSubmissionData } = useSubmissionStore();

  const [params] = useSearchParams()
  const slug = params.get("slug") || "uob"
  const productCode = params.get("product") || "ACC"
  const { data: questions = [], isLoading, isError } = useQuestions(slug, productCode, 'CONSENT')

  const navigate = useNavigate()
  const location = useLocation() as { state?: Partial<SummaryData> }

  const data: SummaryData = {
    nik: submission.client.nik,
    email: submission.client.email ?? '',
    dob: moment(submission.client.dob).format('DD/MM/YYYY'),
    fullName: submission.client.fullName,
    pob: submission.client.pob,
    gender: submission.client.sex,
    address: submission.client.address,
    months: location.state?.months ?? "X",
    price: location.state?.price ?? t("consent.priceSample"),
    planType: location.state?.planType ?? "silver",
    ...location.state,
  }


  const schema = z.object(
    questions.flatMap(group => group.question).reduce((acc, q) => {
      if (q.answer_type === "YES_NO") {
        acc[q.code] = z.enum(["yes", "no"], { message: "Required" });
      } else {
        acc[q.code] = z.literal("yes", { message: "Required" });
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
    if (questions.length > 0) {
      const defaults = questions
        .flatMap(group => group.question)
        .reduce((acc, q) => {
          acc[q.code as keyof AckValues] = undefined;
          return acc;
        }, {} as AckValues);

      form.reset(defaults);
    }
  }, [questions, form]);

  const watchAllField = form.watch()
  const onSubmit = () => handleSetData()

  const handleSetData = () => {
    const dataQuestions = questions.flatMap(group => group.question).map(item => ({
        questionId: item.id,
        questionCode: item.code,
        questionText: item.question_text,
        questionType: item.type,
        questionAnswerType: item.answer_type,
        answer: watchAllField[item.code]
    }));

    const data: SubmissionReq = {
      ...submission,
      questionaire: {
        ...submission.questionaire,
        consent: dataQuestions,
      }
    }

    setSubmissionData(data)
    navigate("/waiting-status")
  }

  const canSubmit =
    Object.values(watchAllField).length > 0 &&
    Object.values(watchAllField).every(v => v !== undefined);

  const FORM_ID = "consent-form"

  return (
    <div className="min-h-screen">
      <Card className="rounded-[22px] border bg-white">
        <div className="flex justify-center">
            <img
                src={Logo}
                alt={t("hero.alt.logo")}
                width={100}
                height={50}
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
        <div className="flex">
            <div className="p-4 w-full bg-[#69C8C3] text-white">
                <div className="font-bold text-lg">{t("consent.accident")}</div>
                <div className="font-bold">{t("consent.summaryTitle")} {submission.product.package.packageName} ({submission.product.package.term.term} {t("consent.monthsSuffix")})</div>
                <div className="">Rp 32,000</div>
            </div>

            <div
                className="ml-auto max-w-[540px] rounded-l-2xl overflow-hidden"
                style={{
                    WebkitMaskImage: "linear-gradient(to left, #69C8C3 15%, #69C8C3)",
                    maskImage: "linear-gradient(to left, #69C8C3 15%, #69C8C3)",
                }}
            >
                <img
                    src={Family}
                    width={150}
                    alt="Keluarga"
                    className="block object-cover h-full"
                    loading="eager"
                />
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
                <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
                {isError && <p className="text-sm text-red-500">Gagal memuat pertanyaan</p>}

                {!isLoading && !isError && questions.map((q, idx) => (
                    <section className="relative" key={`${q}-${idx}`}>
                        <h3 className="font-semibold text-[16px] text-[#4B4B4B]">{q.group_label}</h3>
                        {q.question.map((item, idx) => (
                            <div key={`${item}-${idx}`}>
                            <p className="text-[13px] text-[#4B4B4B] mt-2">{item.question_text}</p>
                            <div className="relative mt-4">
                                <FormField
                                control={form.control}
                                name={item.code}
                                render={({ field }) => (
                                    <FormItem className="mt-2 space-y-3">
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} className="space-y-3">
                                                {item.answer_type === "YES_NO" ? (
                                                    <>
                                                    <label className="flex items-center gap-2">
                                                        <RadioGroupItem value="yes" id={`${item.code}-yes`} />
                                                        <span className="text-[14px] text-[#4B4B4B]">{item.yes_label}</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <RadioGroupItem value="no" id={`${item.code}-no`} />
                                                        <span className="text-[14px] text-[#4B4B4B]">{item.no_label}</span>
                                                    </label>
                                                    </>
                                                ) : (
                                                    <label className="flex items-center gap-2">
                                                    <RadioGroupItem value="yes" id={`${item.code}-yes`} />
                                                    <span className="text-[14px] text-[#4B4B4B]">{item.yes_label}</span>
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
        <div className="grid grid-cols-2">
            <dt className="text-[#6B6B6B] font-semibold">{label}</dt>
            <dd className="text-[#4B4B4B]">{value}</dd>
        </div>
    )
}
