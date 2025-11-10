import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useNavigate, Link, useSearchParams, useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { DialogComponent } from "@/components/common/DialogComponent"
import { useQuestions } from "@/hooks/useQuestions"
import { SubmissionReq } from "@/api/types"
import { useSubmissionStore } from "@/lib/store/submissionDataStore"
import { LoadingComponent } from "@/components/common/LoadingComponent"
import { isAnswerValidForQuestion } from "@/helper/questionnaire-validation"

export default function HealthQuestionsPage() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const { brand } = useParams()
  const [params] = useSearchParams()
  const [rejectOpen, setRejectOpen] = useState(false)
  const { submission, setSubmissionData } = useSubmissionStore()

  const product_code = params.get("product") || "ACC"
  const { data, isLoading, isError } = useQuestions(brand, product_code, "HEALTH_QUESTIONNAIRE")

  const questions = useMemo(
    () =>
      data && data.length > 0
        ? data.flatMap((group) => group.question)
        : [],
    [data]
  )

  const schema = useMemo(() => {
    const AnswerEnum = z.enum(["yes", "no"] as const, { message: t("menu.schema.requiredOption") })
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
    const values = v as Record<string, string | undefined>
    const hasInvalidAnswer = questions.some((question) => !isAnswerValidForQuestion(question, values[question.id]))

    if (hasInvalidAnswer) setRejectOpen(true)
    else handleSetData(v)
  }

  const handleSetData = (v: Record<string, string>) => {
    const dataQuestions = questions.map((value) => ({
      question_id: value.id,
      question_code: value.code,
      question_text: value.question_text,
      question_type: value.type,
      question_answer_type: value.answer_type,
      answer: v[value.id]
    }))

    const data: SubmissionReq = {
      ...submission,
      questionaire: {
        ...submission.questionaire,
        health_questionnaire: dataQuestions,
      }
    }
    setSubmissionData(data)
    navigate(`/${brand}/pdf?type=riplay&product=${submission.product.product_code}`)
  }

  useEffect(() => {
    const healthAnswers = submission?.questionaire?.health_questionnaire;
    if (!Array.isArray(healthAnswers) || !questions.length) return;

    const defaults: Record<string, "yes" | "no"> = {};
    questions.forEach((q) => {
      const answerObj = healthAnswers.find(a => a.question_id === q.id);
      if (answerObj && (answerObj.answer === "yes" || answerObj.answer === "no")) {
        defaults[q.id] = answerObj.answer;
      }
    });

    const currentValues = form.getValues();
    const isDifferent = Object.keys(defaults).some(
      key => currentValues[key] !== defaults[key]
    );

    if (isDifferent) {
      form.reset(defaults);
    }
  }, [submission, questions, form]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="pt-4 pb-6">
        <Card className="rounded-[20px] shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)]">
          <CardContent className="p-5 md:p-6">
            <h1 className="text-2xl md:text-[26px] font-semibold text-[#6AC3BE] mb-3">{t("health.title")}</h1>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                {isError && <p className="text-sm text-red-500">{t("content.FailedToLoad")}</p>}
                {!isLoading && !isError && questions.map((q, idx) => (
                  <div key={q.id} className="relative">
                    <div className="flex">
                      <p className="text-[13px] leading-5 text-[#4B4B4B]">
                        {idx + 1}. {q.question_text}
                      </p>
                      <div className="text-[#ED1B2E] mt-2">*</div>
                    </div>
                    <FormField
                      control={form.control}
                      name={q.id}
                      render={({ field }) => (
                        <FormItem className="mt-3 space-y-3">
                          <FormControl>
                            <RadioGroup className="space-y-3" value={field.value} onValueChange={field.onChange}>
                              <label className="flex items-center gap-2">
                                <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                                <span className="text-[14px] text-[#4B4B4B] font-bold">{t("health.yes")}</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <RadioGroupItem value="no" id={`${q.id}-no`} />
                                <span className="text-[14px] text-[#4B4B4B] font-bold">{t("health.no")}</span>
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
        secondaryTo={`/${brand}?reset_session=true`}
      />
      <LoadingComponent open={isLoading} />
    </div>
  )
}
