import type {
  BranchItem,
  City,
  ComputePremiumRes,
  CreateSPAJRes,
  District,
  DocumentRes,
  HealthQuestion,
  PaymentRes,
  ProductDetail,
  ProductListItem,
  ProposaStatusRes,
  Province,
  Subdistrict,
  ValidationRule,
  ZipLookupRes,
} from "@/api/types";

export type Option = { code: string; name: string };
export type OptionProvince = { code: string; name: string, province_las_code: string };

const toString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const ensureArray = <T>(value?: T[] | null): T[] => (Array.isArray(value) ? value.filter(Boolean) as T[] : []);

export const mapProductList = (items?: ProductListItem[] | null): ProductListItem[] =>
  ensureArray(items).map((item) => ({
    product_id: toString(item.product_id),
    product_name: toString(item.product_name),
    microsite_id: toString(item.microsite_id),
    product_code: toString(item.product_code),
    image: toString(item.image),
    desc: toString(item.desc),
  }));

export const mapProductDetail = (item?: ProductDetail | null): ProductDetail | undefined => {
  if (!item) return undefined;

  return {
    product_id: toString(item.product_id),
    product_code: toString(item.product_code),
    product_name: toString(item.product_name),
    desc: toString(item.desc),
    terms: ensureArray(item.terms).map((term) => ({
      term_id: toString(term.term_id),
      term: toNumber(term.term),
      term_description: toString(term.term_description),
      term_unit: toString(term.term_unit),
    })),
    packages: ensureArray(item.packages).map((pkg) => ({
      package_id: toString(pkg.package_id),
      package_name: toString(pkg.package_name),
      package_code: toString(pkg.package_code),
      benefits: ensureArray(pkg.benefits).map((benefit) => ({
        benef_code: toString(benefit.benef_code),
        benef_name: toString(benefit.benef_name),
        benef_amount: toNumber(benefit.benef_amount),
        benef_type: toString(benefit.benef_type),
        ...(benefit.notes ? { notes: toString(benefit.notes) } : {}),
      })),
    })),
  };
};

export const mapComputePremium = (payload?: ComputePremiumRes | null): ComputePremiumRes => ({
  premium_amount: toNumber(payload?.premium_amount),
  ujroh_amount: toNumber(payload?.ujroh_amount),
  tabaru_amount: toNumber(payload?.tabaru_amount),
});

const toOption = (code: unknown, name: unknown): Option | null => {
  const c = toString(code);
  const n = toString(name) || c;
  if (!c || !n) return null;
  return { code: c, name: n };
};

const toOptionProvince = (code: unknown, name: unknown, province_las_code: unknown): OptionProvince | null => {
  const c = toString(code);
  const n = toString(name) || c;
  const l = toString(province_las_code) || c;
  if (!c || !n || !l) return null;
  return { code: c, name: n, province_las_code: l };
};

export const mapBranchOptions = (items?: BranchItem[] | null): Option[] =>
  ensureArray(items)
    .map((branch) =>
      toOption(
        branch.branch_id,
        branch.long_desc
      )
    )
    .filter((opt): opt is Option => Boolean(opt));


export type OptionInput = { code?: unknown; name?: unknown };

export const mapOptionList = (items?: OptionInput[] | null): Option[] =>
  ensureArray(items)
    .map((entry) => toOption(entry.code, entry.name))
    .filter((opt): opt is Option => Boolean(opt));

export const mapProvinceOptions = (items?: Province[] | null): OptionProvince[] =>
  ensureArray(items)
    .map((province) => toOptionProvince(province.province_id, province.province_name, province.province_las_code))
    .filter((opt): opt is OptionProvince => Boolean(opt));

export const mapCityOptions = (items?: City[] | null): Option[] =>
  ensureArray(items)
    .map((city) => toOption(city.city_id, city.city_name))
    .filter((opt): opt is Option => Boolean(opt));

export const mapDistrictOptions = (items?: District[] | null): Option[] =>
  ensureArray(items)
    .map((district) => toOption(district.district_id, district.district_name))
    .filter((opt): opt is Option => Boolean(opt));

export const mapSubdistrictOptions = (items?: Subdistrict[] | null): Option[] =>
  ensureArray(items)
    .map((subdistrict) => toOption(subdistrict.subdistrict_id, subdistrict.subdistrict_name))
    .filter((opt): opt is Option => Boolean(opt));

export const mapZipLookup = (payload: ZipLookupRes) => ({
  id: payload.id,
  zip_code: payload.zip_code,
  subdistrict_id: payload.subdistrict_id,
  subdistrict_name: payload.subdistrict_name,
  district_id: payload.district_id,
  district_name: payload.district_name,
  city_id: payload.city_id,
  city_name: payload.city_name,
  province_id: payload.province_id,
  province_name: payload.province_name,
  province_las_code: payload.province_las_code,
});

const VALIDATION_RULE_VALUES: ValidationRule[] = ["REQUIRED_YES", "REQUIRED_NO", "REQUIRED_ANY"];

const toValidationRule = (value: unknown): ValidationRule | undefined => {
  const normalized = toString(value).toUpperCase() as ValidationRule;
  return VALIDATION_RULE_VALUES.includes(normalized) ? normalized : undefined;
};

const sanitizeHealthQuestion = (question: HealthQuestion): HealthQuestion => ({
  id: toString(question.id),
  code: toString(question.code),
  question_order: toNumber(question.question_order),
  question_text: toString(question.question_text),
  type: toString(question.type),
  answer_type: toString(question.answer_type),
  yes_label: toString(question.yes_label),
  no_label: toString(question.no_label),
  group_type: toString(question.group_type),
  group_label: toString(question.group_label),
  group_order: toNumber(question.group_order),
  validation_rule: toValidationRule(question.validation_rule),
});

export type QuestionGroup = {
  group_order: number;
  group_type: string;
  group_label: string;
  question: HealthQuestion[];
};

export const mapHealthQuestions = (items?: HealthQuestion[] | null): HealthQuestion[] =>
  ensureArray(items).map((question) => sanitizeHealthQuestion(question));

export const mapHealthQuestionGroups = (
  items?: HealthQuestion[] | null
): QuestionGroup[] => {
  const grouped: Record<string, QuestionGroup> = {};

  for (const raw of mapHealthQuestions(items)) {
    const key = `${raw.group_order}-${raw.group_type}-${raw.group_label}`;
    if (!grouped[key]) {
      grouped[key] = {
        group_order: raw.group_order,
        group_type: raw.group_type,
        group_label: raw.group_label,
        question: [],
      };
    }
    grouped[key].question.push(raw);
  }

  Object.values(grouped).forEach((group) => {
    group.question.sort(
      (a, b) => a.question_order - b.question_order
    );
  });

  return Object.values(grouped).sort(
    (a, b) => a.group_order - b.group_order
  );
};

export const mapDocumentResponse = (payload?: DocumentRes | null): DocumentRes => ({
  doc_id: toString(payload?.doc_id),
  fileBase64: toString(payload?.fileBase64),
});

export const mapCreateSpajResponse = (payload?: CreateSPAJRes | null): CreateSPAJRes => ({
  id: toString(payload?.id),
  spaj_number: toString(payload?.spaj_number),
});

export const mapProposalStatus = (payload?: { status?: string } | null): ProposaStatusRes => ({
  success: toString(payload?.status).toUpperCase() === "CLEAN",
  inforce: toString(payload?.status).toUpperCase() === "INFORCE",
  failed: toString(payload?.status).toUpperCase() === "NOT_CLEAN",
});

export const mapPaymentResponse = (payload?: PaymentRes | null): PaymentRes => ({
  url: toString(payload?.url),
  bill_no: toString(payload?.bill_no),
  resp_code: toNumber(payload?.resp_code),
  resp_desc: toString(payload?.resp_desc),
});

export const mapUnknownData = <T>(payload: T | null | undefined, fallback: T): T =>
  payload == null ? fallback : payload;

