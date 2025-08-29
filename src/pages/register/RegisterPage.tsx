import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormField, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectItem, SelectSeparator } from "@/components/ui/select"
import { FloatingField } from "@/components/form/floating-field"
import { FloatingSelect } from "@/components/form/floating-select"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { Link } from "react-router-dom"
import { DateField } from "@/components/form/date-field"
import { PhoneField } from "@/components/form/phone-field"

const BRANCH_VALUES = ["thamrin", "kelapa_gading", "bsd", "pondok_indah"] as const
type Branch = (typeof BRANCH_VALUES)[number]

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

const JOBS_VALUES = ["ob", "manager", "staff"] as const
type Jobs = (typeof JOBS_VALUES)[number]

const SALARY_VALUES = ["gol1", "gol2", "gol3"] as const
type Salary = (typeof SALARY_VALUES)[number]

const RELATION_VALUES = ["istri", "suami", "anak"] as const
type Relation = (typeof RELATION_VALUES)[number]

const schema = z.object({
    branch: z.enum(BRANCH_VALUES, { message: "Pilih kantor cabang" }),
    planType: z.enum(PLAN_VALUES, { message: "Pilih paket" }).optional(),
    gender: z.enum(GENDER_VALUES, { message: "Pilih Jenis Kelamin" }),
    married: z.enum(MARITAL_VALUES, { message: "Pilih Status Pernikahan" }),
    nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
    fullName: z.string().min(2, "Isi nama sesuai KTP"),
    pob: z.string().min(2, "Masukkan tempat lahir"),
    phone: z.string().regex(/^\d{9,13}$/, "Nomor ponsel tidak valid"),
    beneficiaryPhone: z.string().regex(/^\d{9,13}$/, "Nomor ponsel tidak valid"),
    dob: z.date({ message: "Pilih tanggal lahir" }),
    email: z.string().email("Email tidak valid"),
    postalCode: z.string().regex(/^\d{5}$/, "Kode POS harus 5 digit"),
    province: z.enum(PROVINCE_VALUES, { message: "Pilih provinsi" }),
    city: z.enum(CITY_VALUES, { message: "Pilih kota" }),
    district: z.enum(DISTRICT_VALUES, { message: "Pilih kecamatan" }),
    subdistrict: z.enum(SUBDISTRICT_VALUES, { message: "Pilih kelurahan" }),
    addressKtp: z.string().min(10, "Alamat minimal 10 karakter"),
    jobType: z.enum(JOBS_VALUES, { message: "Pilih Pekerjaan" }),
    salary: z.enum(SALARY_VALUES, { message: "Pilih Salary" }),
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

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {} as Partial<FormValues>
    })

    const onSubmit = (values: FormValues) => {
        console.log("Submit:", values)
    }

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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Branch) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.branch")} <span className="text-red-500">*</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {BRANCH_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.branches.${v}`)}</SelectItem>
                                                {i < BRANCH_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <hr />

                            <SectionTitle>{t("menu.sections.ktpInfo")}</SectionTitle>
                            <p className="text-[10px] text-[#ED1B2E]">{t("menu.hints.requiredNote")}</p>

                            <Card className="overflow-hidden rounded-xl border bg-[#C5F2F0] shadow-none">
                                <CardContent className="py-3 px-3 flex gap-2 items-center">
                                    <Info color="#228D88" size={14} />
                                    <p className="text-[#636261] text-sm font-medium">{t("menu.hints.ktpHint")}</p>
                                </CardContent>
                            </Card>

                            <FormField
                                control={form.control}
                                name="nik"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={16}
                                        label={
                                            <>
                                                {t("menu.fields.nik")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        label={
                                            <>
                                                {t("menu.fields.fullName")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pob"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        label={
                                            <>
                                                {t("menu.fields.pob")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <DateField
                                        label={"Tanggal lahir (dd/mm/yyyy)"}
                                        requiredMark
                                        value={field.value}
                                        onChange={field.onChange}
                                        wrapperClassName="mt-2"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="married"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Married) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.married")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {MARITAL_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.marital.${v}`)}</SelectItem>
                                                {i < MARITAL_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        type="email"
                                        label={
                                            <>
                                                {t("menu.fields.email")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <PhoneField
                                        value={field.value}
                                        onChange={field.onChange}
                                        label={"nomor ponsel anda"}
                                        requiredMark
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <hr />

                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={5}
                                        label={<>{t("menu.fields.postalCode")}</>}
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Province) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.province")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {PROVINCE_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.provinces.${v}`)}</SelectItem>
                                                {i < PROVINCE_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: City) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.city")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {CITY_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.cities.${v}`)}</SelectItem>
                                                {i < CITY_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: District) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.district")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {DISTRICT_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.districts.${v}`)}</SelectItem>
                                                {i < DISTRICT_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subdistrict"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Subdistrict) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.subdistrict")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {SUBDISTRICT_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.subdistricts.${v}`)}</SelectItem>
                                                {i < SUBDISTRICT_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="addressKtp"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        label={
                                            <>
                                                {t("menu.fields.addressKtp")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <SectionTitle>{t("menu.sections.jobInfo")}</SectionTitle>

                            <FormField
                                control={form.control}
                                name="jobType"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Jobs) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.jobType")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {JOBS_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.jobs.${v}`)}</SelectItem>
                                                {i < JOBS_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salary"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Salary) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.salary")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {SALARY_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.salary.${v}`)}</SelectItem>
                                                {i < SALARY_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <SectionTitle>{t("menu.sections.beneficiary")}</SectionTitle>

                            <FormField
                                control={form.control}
                                name="beneficiaryName"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        label={
                                            <>
                                                {t("menu.fields.beneficiaryName")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="beneficiaryPhone"
                                render={({ field }) => (
                                    <PhoneField
                                        value={field.value}
                                        onChange={field.onChange}
                                        label={"nomor ponsel penerima manfaat"}
                                        requiredMark
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="beneficiaryAddress"
                                render={({ field }) => (
                                    <FloatingField
                                        {...field}
                                        label={
                                            <>
                                                {t("menu.fields.beneficiaryAddress")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    />
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="beneficiaryRelation"
                                render={({ field }) => (
                                    <FloatingSelect
                                        value={field.value}
                                        onValueChange={(v: Relation) => field.onChange(v)}
                                        label={
                                            <>
                                                {t("menu.fields.beneficiaryRelation")}<span className="text-red-500"> *</span>
                                            </>
                                        }
                                        wrapperClassName="rounded-[12px]"
                                    >
                                        {RELATION_VALUES.map((v, i) => (
                                            <React.Fragment key={v}>
                                                <SelectItem value={v}>{t(`menu.options.relations.${v}`)}</SelectItem>
                                                {i < RELATION_VALUES.length - 1 && <SelectSeparator className="mx-3" />}
                                            </React.Fragment>
                                        ))}
                                    </FloatingSelect>
                                )}
                            />

                            <Button type="submit" className="bg-[#2A504E] w-full py-5">
                                {t("menu.fields.submit")}
                            </Button>

                            <Link
                                to={'/benefit/1'}
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
