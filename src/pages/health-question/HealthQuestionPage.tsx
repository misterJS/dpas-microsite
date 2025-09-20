import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { DialogComponent } from "@/components/common/DialogComponent"
import { useQuestions } from "@/hooks/useQuestions"
import { SubmissionReq } from "@/api/types"
import { useSubmissionStore } from "@/lib/store/submissionDataStore"

export default function HealthQuestionsPage() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [rejectOpen, setRejectOpen] = useState(false)
  const { submission, setSubmissionData } = useSubmissionStore()

  const slug = params.get("slug") || "uob"
  const productCode = params.get("product") || "ACC"

  const { data, isLoading, isError } = useQuestions(slug, productCode, "HEALTH_QUESTIONAIRE")

  const questions =
    data && data.length > 0
      ? data.flatMap((group) => group.question)
      : [
          {
            id: "",
            code: "",
            question_order: 1,
            question_text: "",
            type: "",
            answer_type: "",
            yes_label: "",
            no_label: "",
          }
        ]

  const schema = useMemo(() => {
    const AnswerEnum = z.enum(["ya", "tidak"] as const, { message: t("health.required") })
    const shape: Record<string, typeof AnswerEnum> = {}
    for (const q of questions) shape[q.id] = AnswerEnum
    return z.object(shape)
  }, [questions, t])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {} as z.infer<typeof schema>,
  })

  const onSubmit = (v: z.infer<typeof schema>) => {
    const notQualified = Object.values(v as Record<string, string>).some((ans) => ans === "ya")
    if (notQualified) setRejectOpen(true)
    else handleSetData(v)
  }

  const handleSetData = (v: Record<string, string>) => {
    const dataQuestions = questions.map((value) => ({
        questionId: value.id,
        questionCode: value.code,
        questionText: value.question_text,
        questionType: value.type,
        questionAnswerType: value.answer_type,
        answer: v[value.id]
    }))

    const data: SubmissionReq = {
      ...submission,
      questionaire: {
        ...submission.questionaire,
        healthQuestionnaire: dataQuestions,
      }
    }
    setSubmissionData(data)
    navigate("/pdf?type=riplay")
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="pt-4 pb-6">
        <Card className="rounded-[20px] shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)]">
          <CardContent className="p-5 md:p-6">
            <h1 className="text-2xl md:text-[26px] font-semibold text-[#6AC3BE] mb-3">{t("health.title")}</h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                )}
                {isError && (
                  <p className="text-sm text-red-500">Gagal memuat pertanyaan</p>
                )}
                {!isLoading && !isError && questions.map((q, idx) => (
                    <div key={q.id} className="relative">
                      <span className="absolute right-1 top-0 text-red-500 text-lg">*</span>
                      <p className="text-[13px] leading-5 text-[#4B4B4B]">
                        {idx + 1}. {q.question_text}
                      </p>
                      <FormField
                        control={form.control}
                        name={q.id}
                        render={({ field }) => (
                          <FormItem className="mt-3 space-y-3">
                            <FormControl>
                              <RadioGroup className="space-y-3" value={field.value} onValueChange={field.onChange}>
                                <label className="flex items-center gap-2">
                                  <RadioGroupItem value="ya" id={`${q.id}-ya`} />
                                  <span className="text-[14px] text-[#4B4B4B]">{t("health.yes")}</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <RadioGroupItem value="tidak" id={`${q.id}-tidak`}/>
                                  <span className="text-[14px] text-[#4B4B4B]">{t("health.no")}</span>
                                </label>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                <Button
                  type="submit"
                  disabled={!form.formState.isValid || isLoading || isError}
                  className="w-full h-12 rounded-[14px] text-base font-semibold disabled:bg-[#BDBDBD] bg-[#2A504E] text-white"
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
