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
  Province,
  Subdistrict,
  ZipLookupRes,
} from "@/api/types";

export type Option = { code: string; name: string };

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
    product_id: toNumber(item.product_id),
    product_name: toString(item.product_name),
    microsite_id: toString(item.microsite_id),
    product_code: toString(item.product_code),
    image: toString(item.image),
    desc: toString(item.desc),
  }));

export const mapProductDetail = (items?: ProductDetail[] | null): ProductDetail | undefined => {
  const detail = ensureArray(items)[0];
  if (!detail) return undefined;

  return {
    product_code: toString(detail.product_code),
    product_name: toString(detail.product_name),
    desc: toString(detail.desc),
    terms: ensureArray(detail.terms).map((term) => ({
      term_id: toNumber(term.term_id),
      term: toNumber(term.term),
      term_unit: toString(term.term_unit),
    })),
    packages: ensureArray(detail.packages).map((pkg) => ({
      package_id: toNumber(pkg.package_id),
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

export const mapBranchOptions = (items?: BranchItem[] | null): Option[] =>
  ensureArray(items)
    .map((branch) =>
      toOption(
        branch.branch_id,
        branch.desc_item || branch.short_desc || branch.long_desc
      )
    )
    .filter((opt): opt is Option => Boolean(opt));


export type OptionInput = { code?: unknown; name?: unknown };

export const mapOptionList = (items?: OptionInput[] | null): Option[] =>
  ensureArray(items)
    .map((entry) => toOption(entry.code, entry.name))
    .filter((opt): opt is Option => Boolean(opt));

export const mapProvinceOptions = (items?: Province[] | null): Option[] =>
  ensureArray(items)
    .map((province) => toOption(province.province_id, province.province_name))
    .filter((opt): opt is Option => Boolean(opt));

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

const sanitizeProvinceEntry = (
  items?: ZipLookupRes["province"] | null
): ZipLookupRes["province"] =>
  ensureArray(items).map((province) => ({
    province_id: toString(province.province_id),
    province_name: toString(province.province_name),
  }));

const sanitizeCityEntry = (
  items?: ZipLookupRes["city"] | null
): ZipLookupRes["city"] =>
  ensureArray(items).map((city) => ({
    city_id: toString(city.city_id),
    city_name: toString(city.city_name),
  }));

const sanitizeDistrictEntry = (
  items?: ZipLookupRes["district"] | null
): ZipLookupRes["district"] =>
  ensureArray(items).map((district) => ({
    district_id: toString(district.district_id),
    district_name: toString(district.district_name),
  }));

const sanitizeSubdistrictEntry = (
  items?: ZipLookupRes["subdistrict"] | null
): ZipLookupRes["subdistrict"] =>
  ensureArray(items).map((subdistrict) => ({
    subdistrict_id: toString(subdistrict.subdistrict_id),
    subdistrict_name: toString(subdistrict.subdistrict_name),
  }));

export const mapZipLookup = (payload?: ZipLookupRes | null): ZipLookupRes => ({
  province: sanitizeProvinceEntry(payload?.province),
  city: sanitizeCityEntry(payload?.city),
  district: sanitizeDistrictEntry(payload?.district),
  subdistrict: sanitizeSubdistrictEntry(payload?.subdistrict),
});

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
  riplay_URL: toString(payload?.riplay_URL),
});

export const mapCreateSpajResponse = (payload?: CreateSPAJRes | null): CreateSPAJRes => ({
  id: toString(payload?.id),
  spaj_number: toString(payload?.spaj_number),
});

export const mapProposalStatus = (payload?: { status?: string } | null): { success: boolean } => ({
  success: toString(payload?.status).toUpperCase() === "CLEAN",
});

export const mapPaymentResponse = (payload?: PaymentRes | null): PaymentRes => ({
  url: toString(payload?.url),
  bill_no: toString(payload?.bill_no),
  resp_code: toNumber(payload?.resp_code),
  resp_desc: toString(payload?.resp_desc),
});

export const mapUnknownData = <T>(payload: T | null | undefined, fallback: T): T =>
  payload == null ? fallback : payload;

