import { useRef, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectSeparator } from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import FixedBottomBar from "@/components/common/FixedBottomBar";
import { useNavigate, useParams } from "react-router-dom";
import { FloatingSelect } from "@/components/form/floating-select";
import type { ProductDetail, ProductPackage, SubmissionReq } from "@/api/types";
import { useComputePremium } from "@/hooks/useProducts";
import { useSubmissionStore } from "@/lib/store/submissionDataStore";
import { DocKey, useDocItems } from "./docs.config";
import { DocumentSheet } from "@/components/form/doc-sheet";

const schema = z.object({
  planType: z.enum(["silver", "gold", "platinum"], { message: "Pilih paket" }),
  coverage: z.enum(["6", "12"], { message: "Pilih coverage" }),
});

type FormValues = z.infer<typeof schema>;

type Props = { detail?: ProductDetail; product_code?: string; slug?: string };

export default function BenefitDetailForm({
  detail,
  product_code,
  slug = "uob",
}: Props) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { brand } = useParams();
  const { submission, setSubmissionData } = useSubmissionStore();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      planType: undefined as unknown as FormValues["planType"],
      coverage: undefined as unknown as FormValues["coverage"],
    },
  });

  const docItems = useDocItems();
  const [openDocKey, setOpenDocKey] = useState<DocKey | null>(null);
  const openDoc = openDocKey !== null;

  const active = useMemo(
    () => docItems.find((d) => d.key === openDocKey) ?? null,
    [docItems, openDocKey]
  );

  const handleOpen = useCallback((key: DocKey) => setOpenDocKey(key), []);
  const handleClose = useCallback(() => setOpenDocKey(null), []);

  const onSubmit = (values: FormValues) => {
    handleSetData(values);
  };

  const handleSetData = (v: FormValues) => {
    if (detail) {
      const detailPackage = detail.packages.find(
        (e) => e.package_name.toLowerCase() === v.planType.toLowerCase()
      );
      const detailTerm = detail.terms.find(
        (e) => Number(e.term) === Number(v.coverage)
      );
      const data: SubmissionReq = {
        ...submission,
        product: {
          product_id: "xxx",
          product_code: detail.product_code,
          product_name: detail.product_name,
          package: {
            package_id: detailPackage?.package_id,
            package_name: detailPackage?.package_name,
            package_code: detailPackage?.package_code,
            premium_amount: 32000,
            term: {
              term_id: detailTerm?.term_id,
              term: detailTerm?.term,
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

  const [open, setOpen] = useState(false);
  const startY = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 60) {
      setOpen(false);
      startY.current = null;
    }
  };
  const planValue = form.watch("planType");
  const planLabel = planValue
    ? t(`form.plan.${planValue}`)
    : t("form.plan.silver");
  const termValue = form.watch("coverage");
  const termLabel =
    termValue === "12"
      ? t("form.coverage_12months")
      : t("form.coverage_6months");

  const selected = useMemo(() => {
    const codeMap: Record<string, string> = {
      silver: "SIL",
      gold: "GLD",
      platinum: "PLT",
    };
    const pkg = detail?.packages.find(
      (p) => p.package_code.toUpperCase() === codeMap[planValue ?? ""]
    );
    const termNum = termValue ? Number(termValue) : undefined;
    const term = detail?.terms.find((t) => t.term === termNum);
    return { pkg, term };
  }, [detail, planValue, termValue]);

  const { data: premium } = useComputePremium(
    slug,
    selected.pkg && selected.term && product_code
      ? {
          product_code: product_code!,
          package_id: selected.pkg.package_id,
          policyterm_id: selected.term.term_id,
        }
      : undefined
  );

  const fmtIDR = (n?: number | string) =>
    n == null ? "-" : `Rp ${Number(n).toLocaleString("id-ID")}`;
  const FORM_ID = "benefit-form";
  return (
    <Form {...form}>
      <form
        id={FORM_ID}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
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
              label={
                <>
                  {t("form.planType_ph")}
                  <span className="text-red-500"> *</span>
                </>
              }
              wrapperClassName="rounded-[12px]"
            >
              <SelectItem value="silver">{t("form.plan.silver")}</SelectItem>
              <SelectSeparator className="mx-3" />
              <SelectItem value="gold">{t("form.plan.gold")}</SelectItem>
              <SelectSeparator className="mx-3" />
              <SelectItem value="platinum">
                {t("form.plan.platinum")}
              </SelectItem>
            </FloatingSelect>
          )}
        />

        {planValue && detail && (
          <section className="rounded-[12px] border p-4 space-y-3">
            <h2 className="text-xl font-semibold">{t("form.benefit_desc")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("form.plan_desc")}
            </p>

            <div className="space-y-2 text-sm leading-6">
              <p className="font-medium">{t("form.basicBenefit")}</p>
              <p>
                {t("content.deathBenefit")} <br />
                {fmtIDR(3000000)}
              </p>
              {selected.pkg?.benefits?.length ? (
                <>
                  <p className="mt-3 font-medium">
                    {t("content.addonBenefit")}
                  </p>
                  {selected.pkg.benefits.map((b) => (
                    <p key={b.benef_code}>
                      {b.benef_name}
                      <br />
                      {fmtIDR(b.benef_amount)}
                    </p>
                  ))}
                </>
              ) : null}
            </div>

            <hr className="my-2" />
            <div className="text-base">
              <p className="font-semibold">Kontribusi</p>
              <p>
                {planLabel} ({termLabel}){" "}
                <span className="text-[#ED1B2E] font-medium">
                  {fmtIDR(premium?.premium_amount ?? 0)}
                </span>
              </p>
            </div>
          </section>
        )}

        <hr />
        <h1 className="text-2xl">{t("form.notes_ph")}</h1>
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
          <div className={open ? "pointer-events-none" : undefined} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
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
            <Button
              form={FORM_ID}
              type="submit"
              variant="outline"
              className="w-1/2 bg-[#ED1B2E] border-white md:w-auto"
            >
              {t("form.next")}
            </Button>
          </div>
        </FixedBottomBar>
        <DocumentSheet
          open={openDoc}
          onOpenChange={(v) => (v ? void 0 : handleClose())}
          title={active?.label ?? ""}
          description={active?.description}
        >
          {active?.render()}
        </DocumentSheet>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="p-0 rounded-t-2xl shadow-none"
            style={{ bottom: "var(--fixed-bottom-bar-height, 0px)" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="sticky top-0 z-10 bg-background">
              <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-muted" />
              <div className="px-4 pb-3 pt-2">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-lg">
                    {t("content.planVariant")}
                  </SheetTitle>
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
                  <p>
                    Manfaat meninggal dunia <br />
                    Rp 3.000.000
                  </p>
                  <p className="mt-3 font-medium">Manfaat tambahan:</p>
                  <p>
                    Manfaat cacat total akibat kecelakaan
                    <br />
                    Rp 6.000.000
                  </p>
                  <p>
                    Manfaat meninggal dunia akibat kecelakaan
                    <br />
                    Rp 18.000.000
                  </p>
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
  );
}
