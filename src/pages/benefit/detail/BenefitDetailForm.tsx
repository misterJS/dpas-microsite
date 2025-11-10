import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectSeparator } from "@radix-ui/react-select";
import FixedBottomBar from "@/components/common/FixedBottomBar";
import { useNavigate, useParams } from "react-router-dom";
import { FloatingSelect } from "@/components/form/floating-select";
import type { ProductDetail, SubmissionReq } from "@/api/types";
import { useComputePremium } from "@/hooks/useProducts";
import { useSubmissionStore } from "@/lib/store/submissionDataStore";
import { DocKey, useDocItems } from "./docs.config";
import { DocumentSheet } from "@/components/form/doc-sheet";
import { IconCheckmark } from "@/assets";
import MarkdownRenderer from "@/components/ui/markdown";

type Props = { detail?: ProductDetail; product_code?: string; slug?: string; setIsLoadingCompute?: (val: boolean) => void; };

export default function BenefitDetailForm({ detail, product_code, slug = "uob", setIsLoadingCompute }: Props) {
  const { t } = useTranslation("common");
  const schema = z.object({
    planType: z.string().min(1, t("menu.schema.planType")),
    coverage: z.string().min(1, t("menu.schema.coverage")),
  });
  type FormValues = z.infer<typeof schema>;
  const navigate = useNavigate();
  const { brand } = useParams();
  const { submission, setSubmissionData } = useSubmissionStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: submission?.product
      ? {
          planType: submission.product.package?.package_id ? String(submission.product.package.package_id) : "",
          coverage: submission.product.package?.term.term_id ? String(submission.product.package.term.term_id) : "",
        }
      : {
          planType: "",
          coverage: "",
        },
  });

  const docItems = useDocItems();
  const [openDocKey, setOpenDocKey] = useState<DocKey | null>(null);
  const openDoc = openDocKey !== null;

  const active = useMemo(() => docItems.find((d) => d.key === openDocKey) ?? null, [docItems, openDocKey]);

  const handleOpen = useCallback((key: DocKey) => setOpenDocKey(key), []);
  const handleClose = useCallback(() => setOpenDocKey(null), []);

  const onSubmit = (values: FormValues) => {
    handleSetData(values);
  };

  const planValue = form.watch("planType");
  const termValue = form.watch("coverage");

  const selected = useMemo(() => {
    const pkg = detail?.packages.find((p) => String(p.package_id) === String(planValue));
    const term = detail?.terms.find((t) => String(t.term_id) === String(termValue));
    return { pkg, term };
  }, [detail, planValue, termValue]);

  const getPlanLabel = (val: string) => {
    const plan = detail?.packages.find((t) => String(t.package_id) === String(val));
    if (!plan) return "";
    return plan.package_name;
  };

  const getTermLabel = (val: string) => {
    const term = detail?.terms.find((t) => String(t.term_id) === String(val));
    if (!term) return "";
    let unitLabel: string;
    switch (term.term_unit) {
      case "M":
        unitLabel = t("consent.monthsSuffix");
        break;
      case "T":
        unitLabel = t("consent.yearsSuffix");
        break;
      default:
        unitLabel = term.term_unit;
        break;
    }
    return `${term.term} ${unitLabel}`;
  };

  const planLabel = getPlanLabel(planValue);
  const termLabel = getTermLabel(termValue);

  const benefitList = useMemo(() => {
    let notesIndex = 1;
    const generateNotesFlag = () => "*".repeat(notesIndex++);
    const transformData = (type: string) => {
      return selected.pkg?.benefits
        ?.filter((item) => item.benef_type === type)
        .map((item) => ({
          benef_name: item.benef_name,
          benef_amount: item.benef_amount,
          notes: item.notes,
          notes_flag: item.notes ? generateNotesFlag() : "",
        }));
    };
    return {
      main: transformData("MAIN"),
      additional: transformData("ADDITIONAL"),
    };
  }, [selected]);

  const { data: premium, isLoading: loadingCompute } = useComputePremium(
    slug,
    selected.pkg && selected.term && product_code
      ? {
          product_code: product_code!,
          package_id: selected.pkg.package_id,
          policy_term_id: selected.term.term_id,
        }
      : undefined
  );

  useEffect(() => {
    if (setIsLoadingCompute) {
      setIsLoadingCompute(loadingCompute);
    }
  }, [loadingCompute, setIsLoadingCompute]);

  const termDescription = useMemo(() => selected.term?.term_description ?? "", [selected.term]);

  const fmtCurrency = (n?: number | string) => {
    if (n === undefined || n === null) return "-";
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });
    return formatter.format(Number(n)).replace(/\u00A0/, "");
  };

  const handleSetData = (v: FormValues) => {
    if (detail) {
      const detailPackage = detail.packages.find((e) => String(e.package_id) === String(v.planType));
      const detailTerm = detail.terms.find((e) => String(e.term_id) === String(v.coverage));
      const data: SubmissionReq = {
        ...submission,
        product: {
          ...submission.product,
          product_id: detail.product_id,
          product_code: detail.product_code,
          product_name: detail.product_name,
          package: {
            package_id: detailPackage?.package_id,
            package_name: detailPackage?.package_name,
            package_code: detailPackage?.package_code,
            premium_amount: Number(premium?.premium_amount),
            term: {
              term_id: detailTerm?.term_id,
              term: Number(detailTerm?.term),
              term_unit: detailTerm?.term_unit,
            },
            benefits: detailPackage?.benefits,
          },
        },
      };
      setSubmissionData(data);
      navigate(`/${brand}/registration-form`);
    }
  };

  const FORM_ID = "benefit-form";

  return (
    <Form {...form}>
      <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">{t("content.planTerm")}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={(v) => field.onChange(v)} value={field.value ?? ""} className="grid gap-3 md:grid-cols-2 !mt-5">
                  {detail?.terms.map((g) => (
                    <label key={String(g.term_id)} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(g.term_id)} id={`g-${g.term_id}`} />
                      <span className="cursor-pointer text-xs font-bold">{getTermLabel(String(g.term_id))}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-2xl font-semibold !-mb-4">{t("form.planType_ph")}</p>
        <FormField
          control={form.control}
          name="planType"
          render={({ field }) => (
            <FloatingSelect value={field.value} onValueChange={field.onChange} label={""} placeholder="Pilih Paket" wrapperClassName="rounded-[12px] h-10 shadow-none bg-white">
              {detail?.packages.map((v, i) => (
                <React.Fragment key={String(v.package_id)}>
                  <SelectItem value={String(v.package_id)}>{v.package_name}</SelectItem>
                  {i < (detail?.packages.length ?? 0) - 1 && <SelectSeparator className="mx-3" />}
                </React.Fragment>
              ))}
            </FloatingSelect>
          )}
        />
        {planValue && detail && (
          <section className="rounded-[12px] border p-4 space-y-3 bg-white">
            <h2 className="text-xl font-semibold">{t("form.benefit_desc")}</h2>
            <MarkdownRenderer content={termDescription} />
            <div className="text-sm leading-6">
              <p className="font-medium">{t("form.basicBenefit")}</p>
              {benefitList.main?.map((v, idx) => (
                <div key={`main-${idx}`} className="flex items-start">
                  <img src={IconCheckmark} className="mr-1 mt-1" />
                  <p>
                    {v.benef_name}
                    <span className="text-red-600">{v.notes_flag}</span> <br />
                    {fmtCurrency(v.benef_amount)}
                  </p>
                </div>
              ))}
              <p className="mt-3 font-medium">{t("form.aditionalBenefit")}</p>
              {benefitList.additional?.map((v, idx) => (
                <div key={`add-${idx}`} className="flex items-start">
                  <img src={IconCheckmark} className="mr-1 mt-1" />
                  <p>
                    {v.benef_name}
                    <span className="text-red-600">{v.notes_flag}</span> <br />
                    {fmtCurrency(v.benef_amount)}
                  </p>
                </div>
              ))}
            </div>
            <p className="flex text-sm text-gray-500 mb-1">{t("form.benefit_notes")}</p>
            <div>
              {[...(benefitList.main ?? []), ...(benefitList.additional ?? [])].map((v, idx) => (
                <div key={`note-${idx}`} className="flex text-sm text-gray-500 mb-1">
                  <span className="text-red-600">{v.notes_flag}</span>
                  <p>{v.notes}</p>
                </div>
              ))}
            </div>
            <hr className="my-2 border-gray-400" />
            <div className="text-base">
              <p className="font-semibold">{t("content.contribution")}</p>
              <p className="font-bold text-xs">
                {planLabel} ({termLabel}) <span className="text-[#ED1B2E]">{fmtCurrency(premium?.premium_amount ?? 0)}</span>
              </p>
            </div>
          </section>
        )}
        <hr className="my-2 border-gray-400" />
        <h1 className="text-2xl font-semibold">{t("form.notes_ph")}</h1>
        <div role="list" className="space-y-1">
          {docItems.map((it) => (
            <button
              key={it.key}
              type="button"
              role="listitem"
              onClick={() => handleOpen(it.key)}
              aria-expanded={openDoc && openDocKey === it.key}
              className="block text-left text-base text-[#ED1B2E] underline-offset-2 hover:underline focus:outline-none focus:underline"
            >
              {it.label}
            </button>
          ))}
        </div>
        <FixedBottomBar>
          <div className="p-4 flex items-center justify-between bg-[#2A504E] text-white">
            <div className="space-y-1">
              <p className="text-sm font-thin">{t("form.contributeTotal")}:</p>
              <h1 className="text-sm font-semibold">
                {planLabel} {termLabel ? `(${termLabel})` : ""} {fmtCurrency(premium?.premium_amount ?? 0)}
              </h1>
            </div>
            <Button form={FORM_ID} type="submit" variant="outline" className="w-1/3 bg-[#2A504E] border-white md:w-auto">
              {t("form.next")}
            </Button>
          </div>
        </FixedBottomBar>
        <DocumentSheet open={openDoc} onOpenChange={(v) => (v ? void 0 : handleClose())} title={active?.label ?? ""} description={active?.description}>
          {active?.render()}
        </DocumentSheet>
      </form>
    </Form>
  );
}
