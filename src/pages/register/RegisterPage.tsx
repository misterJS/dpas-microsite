import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { useProvinces, useCities, useDistricts, useSubdistricts } from "@/hooks/useLocation"
import { useBranches, useJobs, useSalaries } from "@/hooks/useOptions"
import { useZipLookup } from "@/hooks/useZip"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormField, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectItem, SelectSeparator } from "@/components/ui/select"
import { RHFTextField, RHFSelectField, RHFPhoneField, RHFDateField } from "@/components/form/rhf-fields"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useSubmissionStore } from "@/lib/store/submissionDataStore"
import { SubmissionReq } from "@/api/types"


const PLAN_VALUES = ["silver", "gold", "platinum"] as const
const GENDER_VALUES = ["pria", "wanita"] as const
type Gender = (typeof GENDER_VALUES)[number]

const MARITAL_VALUES = ["menikah", "belum", "bercerai"] as const
type Married = (typeof MARITAL_VALUES)[number]

const PROVINCE_VALUES = ["dki", "jabar", "jateng"] as const
type Province = (typeof PROVINCE_VALUES)[number]

const CITY_VALUES = ["jaksel", "jakpus", "depok"] as const
type City = (typeof CITY_VALUES)[number]

const DISTRICT_VALUES = ["keb_baru", "tebet"] as const
type District = (typeof DISTRICT_VALUES)[number]

const SUBDISTRICT_VALUES = ["gunung", "kramat_pela"] as const
type Subdistrict = (typeof SUBDISTRICT_VALUES)[number]

const RELATION_VALUES = ["istri", "suami", "anak"] as const
type Relation = (typeof RELATION_VALUES)[number]

type Branch = { code: string; name: string }

const schema = z.object({
    branch: z.string().min(1, "Pilih kantor cabang"),
    planType: z.enum(PLAN_VALUES, { message: "Pilih paket" }).optional(),
    gender: z.enum(GENDER_VALUES, { message: "Pilih Jenis Kelamin" }),
    married: z.enum(MARITAL_VALUES, { message: "Pilih Status Pernikahan" }),
    nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
    fullName: z.string().min(2, "Isi nama sesuai KTP"),
    pob: z.string().min(2, "Masukkan tempat lahir"),
    phone: z.string().regex(/^\d{9,13}$/, "Nomor ponsel tidak valid"),
    beneficiaryPhone: z.string().regex(/^\d{9,13}$/, "Nomor ponsel tidak valid"),
    dob: z
        .date({ message: "Pilih tanggal lahir" })
        .refine((d) => d <= new Date(), { message: "Tanggal lahir tidak boleh di masa depan" }),
    email: z.string().email("Email tidak valid"),
    postalCode: z.string().regex(/^\d{5}$/, "Kode POS harus 5 digit"),
    province: z.enum(PROVINCE_VALUES, { message: "Pilih provinsi" }),
    city: z.enum(CITY_VALUES, { message: "Pilih kota" }),
    district: z.enum(DISTRICT_VALUES, { message: "Pilih kecamatan" }),
    subdistrict: z.enum(SUBDISTRICT_VALUES, { message: "Pilih kelurahan" }),
    addressKtp: z.string().min(10, "Alamat minimal 10 karakter"),
    jobType: z.string().min(1, "Pilih Pekerjaan"),
    salary: z.string().min(1, "Pilih Salary"),
    beneficiaryName: z.string().min(2, "Nama minimal 2 karakter"),
    beneficiaryAddress: z.string().min(2, "Masukkan tempat lahir"),
    beneficiaryRelation: z.enum(RELATION_VALUES, { message: "Pilih Relasi" })
})
type FormValues = z.infer<typeof schema>

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base text-[#006660] font-semibold">{children}</h2>
)

export default function RegisterPage() {
    const { t } = useTranslation("common")
    const navigate = useNavigate()
    const { submission, setSubmissionData } = useSubmissionStore();
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {} as Partial<FormValues>
    })

    const onSubmit = (values: FormValues) => {
        handleSetData(values)
    }

    const handleSetData = (v: FormValues) => {
        const data: SubmissionReq = {
            ...submission,
            client: {
                nik: v.nik,
                fullName: v.fullName,
                pob: v.pob,
                dob: v.dob,
                maritalStatus: v.married,
                sex: v.gender,
                email: v.email,
                address: v.addressKtp,
                phone: v.phone,
                countryCode: "+62",
                zipCode: v.postalCode,
                province: v.province,
                cityName: v.city,
                districtName: v.district,
                subdistrictName: v.subdistrict,
                job: v.jobType,
                income: v.salary,
                benefName: v.beneficiaryName,
                benefPhone: v.beneficiaryPhone,
                benefCountryCode: "+62",
                benefAddress: v.beneficiaryAddress,
                relation: v.beneficiaryRelation
            } 
        }
        setSubmissionData(data)
        navigate("/health-question")
    }

    const province = form.watch("province")
    const city = form.watch("city")
    const district = form.watch("district")

    const { data: provinces = [] } = useProvinces()
    const { data: cities = [] } = useCities(province)
    const { data: districts = [] } = useDistricts(province, city)
    const { data: subdistricts = [] } = useSubdistricts(province, city, district)
    const { data: branches = [] } = useBranches() as { data?: Branch[] }
    const { data: jobs = [] } = useJobs()
    const { data: salaries = [] } = useSalaries()
    const postalCode = form.watch("postalCode")
    const { data: zip } = useZipLookup(postalCode)

    // Autofill cascade from ZIP lookup, step-by-step to wait data dependencies
    React.useEffect(() => {
        if (!zip) return
        const p = zip.province?.[0]?.provinceId as Province | undefined
        if (!p) return
        const curr = form.getValues()
        if (curr.province !== p) {
            form.setValue("province", p as Province, { shouldDirty: true, shouldTouch: true })
        }
    }, [zip])

    React.useEffect(() => {
        if (!zip) return
        const c = zip.city?.[0]?.cityId as City | undefined
        if (!c) return
        // Wait until cities for current province are loaded, then set
        if (cities.length > 0 && cities.some(v => v.code === c)) {
            const curr = form.getValues()
            if (curr.city !== c) {
                form.setValue("city", c as City, { shouldDirty: true, shouldTouch: true })
            }
        }
    }, [zip, cities])

    React.useEffect(() => {
        if (!zip) return
        const d = zip.district?.[0]?.districtId as District | undefined
        if (!d) return
        // Wait until districts for current city are loaded, then set
        if (districts.length > 0 && districts.some(v => v.code === d)) {
            const curr = form.getValues()
            if (curr.district !== d) {
                form.setValue("district", d as District, { shouldDirty: true, shouldTouch: true })
            }
        }
    }, [zip, districts])

    React.useEffect(() => {
        if (!zip) return
        const s = zip.subdistrict?.[0]?.subdistrictId as Subdistrict | undefined
        if (!s) return
        // Wait until subdistricts for current district are loaded, then set
        if (subdistricts.length > 0 && subdistricts.some(v => v.code === s)) {
            const curr = form.getValues()
            if (curr.subdistrict !== s) {
                form.setValue("subdistrict", s as Subdistrict, { shouldDirty: true, shouldTouch: true })
            }
        }
    }, [zip, subdistricts])

    return (
        <div className="space-y-6">
            <Card
                className={cn(
                    "overflow-hidden rounded-[20px] border bg-card text-card-foreground transition-shadow",
                    "shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)] hover:shadow-[0_22px_26px_0_rgba(0,0,0,0.08)]"
                )}
            >
                <CardContent className="p-6">
                    <h1 className="mb-4 text-2xl text-[#6AC3BE] font-semibold">{t("menu.fields.submit")}</h1>

                    <Form {...form}>
                        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <RHFSelectField name="branch" label={t("menu.fields.branch")} requiredMark>
                                {branches.map((b, i) => (
                                    <React.Fragment key={b.code}>
                                        <SelectItem value={b.code}>{b.name}</SelectItem>
                                        {i < branches.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <hr />

                            <SectionTitle>{t("menu.sections.ktpInfo")}</SectionTitle>
                            <p className="text-[10px] text-[#ED1B2E]">{t("menu.hints.requiredNote")}</p>

                            <Card className="overflow-hidden rounded-xl border bg-[#C5F2F0] shadow-none">
                                <CardContent className="py-3 px-3 flex gap-2 items-center">
                                    <Info color="#228D88" size={14} />
                                    <p className="text-[#636261] text-sm font-medium">{t("menu.hints.ktpHint")}</p>
                                </CardContent>
                            </Card>

                            <RHFTextField
                                name="nik"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={16}
                                label={t("menu.fields.nik")}
                                requiredMark
                            />

                            <RHFTextField name="fullName" label={t("menu.fields.fullName")} requiredMark />

                            <RHFTextField name="pob" label={t("menu.fields.pob")} requiredMark />

                            <RHFDateField name="dob" label={"Tanggal lahir (dd/mm/yyyy)"} requiredMark wrapperClassName="mt-2" />

                            <RHFSelectField
                                name="married"
                                label={t("menu.fields.married")}
                                requiredMark
                                onValue={(v: Married) => v}
                            >
                                {MARITAL_VALUES.map((v, i) => (
                                    <React.Fragment key={v}>
                                        <SelectItem value={v}>{t(`menu.options.marital.${v}`)}</SelectItem>
                                        {i < MARITAL_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <div>
                                        <Label className="text-xs text-[#989898] font-medium">{t("menu.fields.gender")}<span className="text-red-500"> *</span></Label>
                                        <RadioGroup
                                            className="mt-2 grid gap-3 md:grid-cols-2"
                                            value={field.value}
                                            onValueChange={(v: Gender) => field.onChange(v)}
                                        >
                                            {GENDER_VALUES.map((g) => (
                                                <label key={g} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={g} id={`g-${g}`} />
                                                    <span className="cursor-pointer text-xs text-[#989898]">{t(`menu.options.genders.${g}`)}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                        <FormMessage />
                                    </div>
                                )}
                            />

                            <SectionTitle>{t("menu.sections.contactAddress")}</SectionTitle>

                            <RHFTextField name="email" type="email" label={t("menu.fields.email")} requiredMark />

                            <RHFPhoneField name="phone" label={"nomor ponsel anda"} requiredMark />

                            <hr />

                            <RHFTextField name="postalCode" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5} label={t("menu.fields.postalCode")} />

                            <RHFSelectField name="province" label={t("menu.fields.province")} requiredMark onValue={(v: Province) => v}>
                                {provinces.map((v, i) => (
                                    <React.Fragment key={v.code}>
                                        <SelectItem value={v.code}>{v.name}</SelectItem>
                                        {i < provinces.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <RHFSelectField name="city" label={t("menu.fields.city")} requiredMark onValue={(v: City) => v}>
                                {cities.map((v, i) => (
                                    <React.Fragment key={v.code}>
                                        <SelectItem value={v.code}>{v.name}</SelectItem>
                                        {i < cities.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <RHFSelectField name="district" label={t("menu.fields.district")} requiredMark onValue={(v: District) => v}>
                                {districts.map((v, i) => (
                                    <React.Fragment key={v.code}>
                                        <SelectItem value={v.code}>{v.name}</SelectItem>
                                        {i < districts.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <RHFSelectField name="subdistrict" label={t("menu.fields.subdistrict")} requiredMark onValue={(v: Subdistrict) => v}>
                                {subdistricts.map((v, i) => (
                                    <React.Fragment key={v.code}>
                                        <SelectItem value={v.code}>{v.name}</SelectItem>
                                        {i < subdistricts.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <RHFTextField name="addressKtp" label={t("menu.fields.addressKtp")} requiredMark />

                            <SectionTitle>{t("menu.sections.jobInfo")}</SectionTitle>

                            <RHFSelectField name="jobType" label={t("menu.fields.jobType")} requiredMark>
                                {jobs.map((v, i) => (
                                    <React.Fragment key={v.code}>
                                        <SelectItem value={v.code}>{v.name}</SelectItem>
                                        {i < jobs.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <RHFSelectField name="salary" label={t("menu.fields.salary")} requiredMark>
                                {salaries.map((v, i) => (
                                    <React.Fragment key={v.code}>
                                        <SelectItem value={v.code}>{v.name}</SelectItem>
                                        {i < salaries.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <SectionTitle>{t("menu.sections.beneficiary")}</SectionTitle>

                            <RHFTextField name="beneficiaryName" label={t("menu.fields.beneficiaryName")} requiredMark />

                            <RHFPhoneField name="beneficiaryPhone" label={"nomor ponsel penerima manfaat"} requiredMark />

                            <RHFTextField name="beneficiaryAddress" label={t("menu.fields.beneficiaryAddress")} requiredMark />

                            <RHFSelectField name="beneficiaryRelation" label={t("menu.fields.beneficiaryRelation")} requiredMark onValue={(v: Relation) => v}>
                                {RELATION_VALUES.map((v, i) => (
                                    <React.Fragment key={v}>
                                        <SelectItem value={v}>{t(`menu.options.relations.${v}`)}</SelectItem>
                                        {i < RELATION_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                    </React.Fragment>
                                ))}
                            </RHFSelectField>

                            <Button type="submit" className="bg-[#2A504E] w-full py-5">
                                {t("menu.fields.submit")}
                            </Button>

                            <Link
                                to={'/products'}
                                className="text-center items-center font-semibold"
                                aria-label={"backward-page"}
                            >
                                <p className="mt-8 mb-3">{t("menu.fields.backwardPage")}</p>
                            </Link>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
