import React, { useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  useProvinces,
  useCities,
  useDistricts,
  useSubdistricts,
} from "@/hooks/useLocation";
import { useBranches } from "@/hooks/useOptions";
import { useZipLookup } from "@/hooks/useZip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem, SelectSeparator } from "@/components/ui/select";
import {
  RHFTextField,
  RHFSelectField,
  RHFPhoneField,
  RHFDateField,
} from "@/components/form/rhf-fields";
import { Info } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSubmissionStore } from "@/lib/store/submissionDataStore";
import { SubmissionReq } from "@/api/types";
import { useCheckAvailability } from "@/hooks/useProducts";
import { CITY_VALUES, DISTRICT_VALUES, GENDER_VALUES, JOBS, MARITAL_VALUES, PLAN_VALUES, PROVINCE_VALUES, RELATION_VALUES, SALARIES, SUBDISTRICT_VALUES } from "@/lib/store/data";
import { DialogComponent } from "@/components/common/DialogComponent";
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { Checkbox } from "@/components/ui/checkbox";

type Province = (typeof PROVINCE_VALUES)[number];
type City = (typeof CITY_VALUES)[number];
type District = (typeof DISTRICT_VALUES)[number];
type Subdistrict = (typeof SUBDISTRICT_VALUES)[number];
type TDropdown = { code: string; name: string }

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base text-[#006660] font-semibold">{children}</h2>
);

const stripLeadingZero = (s: string) =>
  (s || "").replace(/[^\d]/g, "").replace(/^0+/, "");
const ensureLeadingZero = (s: string) => {
  const digits = (s || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return digits.startsWith("0") ? digits : "0" + digits;
};

export default function RegisterPage() {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const fiftyYearsAgo = new Date(
    today.getFullYear() - 50,
    today.getMonth(),
    today.getDate()
  );
  const navigate = useNavigate();
  const { brand } = useParams();
  const [rejectOpen, setRejectOpen] = useState(false)
  const [decisionDesc, setDecisionDesc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { submission, setSubmissionData } = useSubmissionStore();

  const { t } = useTranslation("common");

  const schema = z.object({
    branch: z.string().min(1, t("menu.schema.branch")),
    planType: z.enum(PLAN_VALUES, { message: t("menu.schema.planType") }).optional(),
    gender: z.string().min(1, t("menu.schema.gender")),
    married: z.string().min(1, t("menu.schema.married")),
    nik: z.string().regex(/^\d{16}$/, t("menu.schema.nik")),
    fullName: z.string().min(2, t("menu.schema.fullName")).regex(/^[A-Za-z\s]+$/, t("menu.schema.regexFullname")),
    pob: z.string().min(2, t("menu.schema.pob")).regex(/^[A-Za-z\s]+$/, t("menu.schema.regexPob")),
    phone: z.string().regex(/^\d{9,13}$/, t("menu.schema.phone")),
    beneficiaryPhone: z.string().regex(/^\d{9,13}$/, t("menu.schema.beneficiaryPhone")),
    dob: z
      .date({ message: t("menu.schema.dob") })
      .refine((d) => d <= new Date(), {
        message: t("menu.schema.dob2"),
      }),
    email: z.string().email(t("menu.schema.email")),
    postalCode: z.string().min(5, t("menu.schema.postalCode")).or(z.literal('')),
    province: z.string().min(1, t("menu.schema.province")),
    city: z.string().min(1, t("menu.schema.city")),
    district: z.string().min(1, t("menu.schema.district")),
    subdistrict: z.string().min(1, t("menu.schema.subdistrict")),
    addressKtp: z.string().min(10, t("menu.schema.addressKtp")),
    jobType: z.string().min(1, t("menu.schema.jobType")),
    salaryCode: z.string(),
    salary: z.string().min(1, t("menu.schema.salary")),
    beneficiaryName: z.string().min(2, t("menu.schema.beneficiaryName")).regex(/^[A-Za-z\s]+$/, t("menu.schema.regexBeneficiary")),
    beneficiaryAddress: z.string().min(2, t("menu.schema.beneficiaryAddress")),
    beneficiaryRelation: z.string().min(1, t("menu.schema.beneficiaryRelation")),
    agreeRealData: z.boolean().refine((v) => v === true, {
      message: t("menu.schema.mustAgree") || "Anda harus menyetujui data sebenarnya.",
    }),
  });
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: submission?.client ? {
      branch: submission.client.branch ?? "",
      gender: submission.client.sex ?? "",
      married: submission.client.marital_status ?? "",
      nik: submission.client.nik ?? "",
      fullName: submission.client.full_name ?? "",
      pob: submission.client.pob ?? "",
      phone: ensureLeadingZero(submission.client.phone ?? ""),
      beneficiaryPhone: ensureLeadingZero(submission.client.benef_phone ?? ""),
      dob: submission.client.dob ? new Date(submission.client.dob) : undefined,
      email: submission.client.email ?? "",
      postalCode: submission.client.zip_code ?? "",
      province: submission.client.province_id ?? "",
      city: submission.client.city_id ?? "",
      district: submission.client.district_id ?? "",
      subdistrict: submission.client.subdistrict_id ?? "",
      addressKtp: submission.client.address ?? "",
      jobType: submission.client.job ?? "",
      salaryCode: submission.client.income_code ?? "",
      salary: submission.client.income_code ?? "",
      beneficiaryName: submission.client.benef_name ?? "",
      beneficiaryAddress: submission.client.benef_address ?? "",
      beneficiaryRelation: submission.client.relation ?? "",
      agreeRealData: true,
    } : {
      agreeRealData: false,
    } as any
  });

  const onSubmit = (values: FormValues) => {
    handleSetData(values);
  };

  const province = form.watch("province")
  const city = form.watch("city")
  const district = form.watch("district")

  const { data: provinces = [] } = useProvinces()
  const { data: cities = [] } = useCities(province)
  const { data: districts = [] } = useDistricts(province, city)
  const { data: subdistricts = [] } = useSubdistricts(province, city, district)
  const { data: branches = [], isLoading: loadingBranch } = useBranches() as { data?: TDropdown[]; isLoading: boolean }
  const postalCode = form.watch("postalCode")
  const { data: zip, isLoading: loadingZip } = useZipLookup(postalCode)
  const { mutate } = useCheckAvailability();

  const handleSetData = (v: FormValues) => {
    setIsLoading(true)

    const provinceName = provinces.find(p => p.code === v.province)?.name ?? v.province;
    const cityName = cities.find(c => c.code === v.city)?.name ?? v.city;
    const districtName = districts.find(d => d.code === v.district)?.name ?? v.district;
    const subdistrictName = subdistricts.find(s => s.code === v.subdistrict)?.name ?? v.subdistrict;
    const selectedSalary = SALARIES.find(s => v.salary === s.code );
    
    const data: SubmissionReq = {
      ...submission,
      client: {
        branch: v.branch,
        nik: v.nik,
        full_name: v.fullName,
        pob: v.pob,
        dob: new Date(v.dob),
        marital_status: v.married,
        sex: v.gender,
        email: v.email,
        address: v.addressKtp,
        phone: stripLeadingZero(v.phone),
        country_code: "+62",
        zip_code: v.postalCode,
        province_id: v.province,
        city_id: v.city,
        district_id: v.district,
        subdistrict_id: v.subdistrict,
        province: provinceName,
        city_name: cityName,
        district_name: districtName,
        subdistrict_name: subdistrictName,
        job: v.jobType,
        income_code: selectedSalary?.code ?? "",
        income: selectedSalary?.value ?? "",
        benef_name: v.beneficiaryName,
        benef_phone: stripLeadingZero(v.beneficiaryPhone),
        benef_country_code: "+62",
        benef_address: v.beneficiaryAddress,
        relation: v.beneficiaryRelation
      }
    }

    const paramsCheckAvailability = {
      product_code: submission?.product?.product_code ?? '',
      component_code: submission?.product?.package?.package_code ?? '',
      birth_date: moment(v.dob).format('YYYYMMDD'),
      email: v.email,
      ktp_id: v.nik,
      marital_status: v.married
    }

    mutate(paramsCheckAvailability, {
      onSuccess: (response) => {
        setIsLoading(false)
        if (response.decisions == 'Y') {
          setSubmissionData(data)
          navigate(`/${brand}/health-question?product=${submission?.product?.product_code}`)
        }
      },
      onError: (err: any) => {
        setIsLoading(false)
        setRejectOpen(true)
        err.status && setDecisionDesc(err.status.errors[0].message)
      }
    })
  }

  const { isLoading: loadingProvince } = useProvinces()
  const { isLoading: loadingCity } = useCities(province)
  const { isLoading: loadingDistrict } = useDistricts(province, city)
  const { isLoading: loadingSubdistrict } = useSubdistricts(province, city, district)


  React.useEffect(() => {
    if (!zip) return;
    const p = zip?.province_id as number | undefined;
    if (!p) return;
    const curr = form.getValues();
    if (curr.province !== p.toString()) {
      form.setValue("province", p.toString() as Province, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [zip]);

  React.useEffect(() => {
    if (!zip) return;
    const c = zip?.city_id as number | undefined;
    if (!c) return;
    if (cities.length > 0 && cities.some((v) => v.code === c.toString())) {
      const curr = form.getValues();
      if (curr.city !== c.toString()) {
        form.setValue("city", c.toString() as City, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [zip, cities]);

  React.useEffect(() => {
    if (!zip) return;
    const d = zip?.district_id as number | undefined;
    if (!d) return;
    if (districts.length > 0 && districts.some((v) => v.code === d.toString())) {
      const curr = form.getValues();
      if (curr.district !== d.toString()) {
        form.setValue("district", d.toString() as District, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [zip, districts]);

  React.useEffect(() => {
    if (!zip) return;
    const s = zip?.subdistrict_id as number | undefined;
    if (!s) return;
    if (subdistricts.length > 0 && subdistricts.some((v) => v.code === s.toString())) {
      const curr = form.getValues();
      if (curr.subdistrict !== s.toString()) {
        form.setValue("subdistrict", s.toString() as Subdistrict, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }
  }, [zip, subdistricts]);

  React.useEffect(() => {
    if (!submission?.client) return;
    const c = submission.client;
    form.reset({
      branch: c.branch ?? "",
      gender: c.sex as FormValues["gender"],
      married: c.marital_status as FormValues["married"],
      nik: c.nik ?? "",
      fullName: c.full_name ?? "",
      pob: c.pob ?? "",
      phone: ensureLeadingZero(c.phone ?? ""),
      beneficiaryPhone: ensureLeadingZero(c.benef_phone ?? ""),
      dob: c.dob ? new Date(c.dob) : undefined,
      email: c.email ?? "",
      postalCode: c.zip_code ?? "",
      province: c.province_id as FormValues["province"],
      city: c.city_id as FormValues["city"],
      district: c.district_id as FormValues["district"],
      subdistrict: c.subdistrict_id as FormValues["subdistrict"],
      addressKtp: c.address ?? "",
      jobType: c.job ?? "",
      salaryCode: c.income_code ?? "",
      salary: c.income_code ?? "",
      beneficiaryName: c.benef_name ?? "",
      beneficiaryAddress: c.benef_address ?? "",
      beneficiaryRelation: c.relation as FormValues["beneficiaryRelation"],
      agreeRealData: true,
    });
  }, [submission]);

  const agree = form.watch("agreeRealData");

  const relationSearchableOptions = React.useMemo(
    () =>
      RELATION_VALUES.map((v) => {
        const translated = t(`menu.options.relations.${v.code}`);
        return {
          value: v.code ?? "",
          label: translated,
          keywords: [
            v.code ?? "",
            translated,
            v.name ?? "",
          ].filter((keyword) => Boolean(keyword)) as string[],
        };
      }),
    [t]
  );

  return (
    <div className="space-y-6">
      <div
      >
        <CardContent className="p-4">
          <h1 className="mb-4 text-2xl text-[#6AC3BE] font-semibold">
            {t("form.title_form_registration")}
          </h1>

          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <RHFSelectField
                name="branch"
                label={t("menu.fields.branch")}
                requiredMark
              >
                {branches?.map((b, i) => (
                  <React.Fragment key={b.code}>
                    <SelectItem value={b.code ?? ""}>{b.name}</SelectItem>
                    {i < branches.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <hr />

              <SectionTitle>{t("menu.sections.ktpInfo")}</SectionTitle>
              <p className="text-[10px] text-[#ED1B2E]">
                {t("menu.hints.requiredNote")}
              </p>

              <FormField
                control={form.control}
                name="agreeRealData"
                render={({ field }) => (
                  <div className="flex gap-2 items-start">
                    <div className="flex items-start">
                      <Checkbox
                        id="real-data-checkbox"
                        checked={field.value ?? false}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                        aria-describedby="real-data-hint"
                      />
                    </div>
                    <div className="flex gap-1">
                      <label htmlFor="real-data-checkbox" className="-mt-1 cursor-pointer">
                        {t("menu.hints.realData")}
                      </label>
                      <span className="text-[#ED1B2E] text-xl">*</span>
                    </div>
                  </div>
                )}
              />

              <Card className="overflow-hidden rounded-xl border bg-[#C5F2F0] shadow-none">
                <CardContent className="py-3 px-3 flex gap-2 items-center">
                  <Info color="#228D88" size={14} />
                  <p className="text-[#636261] text-sm font-medium">
                    {t("menu.hints.ktpHint")}
                  </p>
                </CardContent>
              </Card>

              <RHFTextField
                name="nik"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={16}
                label={t("menu.fields.nik")}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, '');
                }}
                requiredMark
              />

              <RHFTextField
                name="fullName"
                type="text"
                maxLength={80}
                label={t("menu.fields.fullName")}
                requiredMark
              />

              <RHFTextField
                name="pob"
                maxLength={20}
                label={t("menu.fields.pob")}
                requiredMark
              />

              <RHFDateField
                name="dob"
                label={t("menu.fields.birthDate")}
                disabled={[
                  { before: fiftyYearsAgo },
                  { after: eighteenYearsAgo },
                ]}
                fromYear={fiftyYearsAgo.getFullYear()}
                toYear={eighteenYearsAgo.getFullYear()}
                defaultMonth={eighteenYearsAgo}
                requiredMark
              />

              <RHFSelectField
                name="married"
                label={t("menu.fields.married")}
                requiredMark
                onValue={(v: TDropdown) => v}
              >
                {MARITAL_VALUES.map((v, i) => (
                  <React.Fragment key={v.code}>
                    <SelectItem value={v.code ?? ""}>
                      {t(`menu.options.marital.${v.code}`)}
                    </SelectItem>
                    {i < MARITAL_VALUES.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <div>
                    <Label className="text-xs text-[#000] font-medium">
                      {t("menu.fields.gender")}
                      <span className="text-red-500"> *</span>
                    </Label>
                    <RadioGroup
                      className="mt-2 grid gap-3 md:grid-cols-2"
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      {GENDER_VALUES.map((g) => (
                        <label key={g.code} className="flex items-center space-x-2">
                          <RadioGroupItem value={g.code} id={`g-${g.code}`} />
                          <span className="cursor-pointer text-xs text-[#000]">
                            {t(`menu.options.genders.${g.code}`)}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </div>
                )}
              />

              <SectionTitle>{t("menu.sections.contactAddress")}</SectionTitle>

              <RHFTextField
                name="email"
                type="email"
                label={t("menu.fields.email")}
                requiredMark
              />

              <RHFPhoneField
                name="phone"
                hint={t("menu.fields.phoneInputHint")}
                label={t("menu.fields.phoneNumber")}
                requiredMark
              />

              <hr />

              <RHFTextField
                name="postalCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                label={t("menu.fields.postalCode")}
              />

              <RHFSelectField
                name="province"
                label={t("menu.fields.province")}
                requiredMark
                onValue={(v: Province) => v}
              >
                {provinces.map((v, i) => (
                  <React.Fragment key={v.code}>
                    <SelectItem value={v.code ?? ""}>{v.name}</SelectItem>
                    {i < provinces.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <RHFSelectField
                name="city"
                label={t("menu.fields.city")}
                requiredMark
                onValue={(v: City) => v}
              >
                {cities.map((v, i) => (
                  <React.Fragment key={v.code}>
                    <SelectItem value={v.code ?? ""}>{v.name}</SelectItem>
                    {i < cities.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <RHFSelectField
                name="district"
                label={t("menu.fields.district")}
                requiredMark
                onValue={(v: District) => v}
              >
                {districts.map((v, i) => (
                  <React.Fragment key={v.code}>
                    <SelectItem value={v.code ?? ""}>{v.name}</SelectItem>
                    {i < districts.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <RHFSelectField
                name="subdistrict"
                label={t("menu.fields.subdistrict")}
                requiredMark
                onValue={(v: Subdistrict) => v}
              >
                {subdistricts.map((v, i) => (
                  <React.Fragment key={v.code}>
                    <SelectItem value={v.code ?? ""}>{v.name}</SelectItem>
                    {i < subdistricts.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <RHFTextField
                name="addressKtp"
                maxLength={120}
                label={t("menu.fields.addressKtp")}
                requiredMark
              />

              <SectionTitle>{t("menu.sections.jobInfo")}</SectionTitle>

              <RHFSelectField
                name="jobType"
                label={t("menu.fields.jobType")}
                requiredMark
              >
                {JOBS.map((v, i) => (
                  <React.Fragment key={v.code}>
                    <SelectItem value={v.code ?? ""}>
                      {t(`menu.options.jobs.${v.code}`)}
                    </SelectItem>
                    {i < JOBS.length - 1 && (
                      <SelectSeparator className="mx-3" />
                    )}
                  </React.Fragment>
                ))}
              </RHFSelectField>

              <RHFSelectField
                name="salary"
                label={t("menu.fields.salary")}
                requiredMark
              >
                {SALARIES.map((v, i) => {
                  return (
                    <React.Fragment key={v.code}>
                      <SelectItem value={v.code ?? ""}>{t(`menu.options.salaries.${v.code}`)}</SelectItem>
                      {i < SALARIES.length - 1 && (
                        <SelectSeparator className="mx-3" />
                      )}
                    </React.Fragment>
                  )
                })}
              </RHFSelectField>

              <SectionTitle>{t("menu.sections.beneficiary")}</SectionTitle>

              <RHFTextField
                name="beneficiaryName"
                type="text"
                maxLength={80}
                wrapperClassName="p-2 custom-benef-name rounded-[8px] h-[70px]"
                label={t("menu.fields.beneficiaryName")}
                requiredMark
              />

              <RHFPhoneField
                name="beneficiaryPhone"
                label={t("menu.fields.benefPhoneNumber")}
                hint={t("menu.fields.phoneInputHint")}
                requiredMark
              />

              <RHFTextField
                name="beneficiaryAddress"
                maxLength={120}
                label={t("menu.fields.beneficiaryAddress")}
                requiredMark
              />

              <RHFSelectField
                name="beneficiaryRelation"
                label={t("menu.fields.beneficiaryRelation")}
                requiredMark
                onValue={(v: TDropdown) => v}
                searchableOptions={relationSearchableOptions}
              />

              <Button
                type="submit"
                disabled={!agree}
                className={`bg-[#2A504E] w-full py-5 ${!agree ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {t("menu.fields.submit")}
              </Button>

              <Link
                to={`/${brand}/products`}
                className="text-center items-center font-semibold"
                aria-label={"backward-page"}
              >
                <p className="mt-8 mb-3">{t("menu.fields.backwardPage")}</p>
              </Link>
            </form>
          </Form>
        </CardContent>
      </div>
      <DialogComponent
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={t("health.reject.title")}
        description={decisionDesc}
        primaryLabel={t("health.reject.close")}
        onPrimary={() => setRejectOpen(false)}
        secondaryLabel={t("health.reject.home")}
        secondaryTo={`/${brand}?reset_session=true`}
      />
      <LoadingComponent open={isLoading || loadingBranch || loadingProvince || loadingCity || loadingDistrict || loadingSubdistrict || loadingZip} />
    </div>
  );
}
