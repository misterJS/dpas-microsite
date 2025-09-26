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
    productId: toNumber(item.productId),
    productName: toString(item.productName),
    micrositeId: toString(item.micrositeId),
    productCode: toString(item.productCode),
    image: toString(item.image),
    desc: toString(item.desc),
  }));

export const mapProductDetail = (items?: ProductDetail[] | null): ProductDetail | undefined => {
  const detail = ensureArray(items)[0];
  if (!detail) return undefined;

  return {
    productCode: toString(detail.productCode),
    productName: toString(detail.productName),
    desc: toString(detail.desc),
    terms: ensureArray(detail.terms).map((term) => ({
      termId: toNumber(term.termId),
      term: toNumber(term.term),
      termUnit: toString(term.termUnit),
    })),
    packages: ensureArray(detail.packages).map((pkg) => ({
      packageId: toNumber(pkg.packageId),
      packageName: toString(pkg.packageName),
      packageCode: toString(pkg.packageCode),
      benefits: ensureArray(pkg.benefits).map((benefit) => ({
        benefCode: toString(benefit.benefCode),
        benefName: toString(benefit.benefName),
        benefAmount: toNumber(benefit.benefAmount),
        benefType: toString(benefit.benefType),
        ...(benefit.notes ? { notes: toString(benefit.notes) } : {}),
      })),
    })),
  };
};

export const mapComputePremium = (payload?: ComputePremiumRes | null): ComputePremiumRes => ({
  premiumAmount: toNumber(payload?.premiumAmount),
  ujrohAmount: toNumber(payload?.ujrohAmount),
  tabaruAmount: toNumber(payload?.tabaruAmount),
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
        branch.branchId,
        branch.descItem || branch.shortDesc || branch.longDesc
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
    .map((province) => toOption(province.provinceId, province.provinceName))
    .filter((opt): opt is Option => Boolean(opt));

export const mapCityOptions = (items?: City[] | null): Option[] =>
  ensureArray(items)
    .map((city) => toOption(city.cityId, city.cityName))
    .filter((opt): opt is Option => Boolean(opt));

export const mapDistrictOptions = (items?: District[] | null): Option[] =>
  ensureArray(items)
    .map((district) => toOption(district.districtId, district.districtName))
    .filter((opt): opt is Option => Boolean(opt));

export const mapSubdistrictOptions = (items?: Subdistrict[] | null): Option[] =>
  ensureArray(items)
    .map((subdistrict) => toOption(subdistrict.subdistrictId, subdistrict.subdistrictName))
    .filter((opt): opt is Option => Boolean(opt));

const sanitizeProvinceEntry = (
  items?: ZipLookupRes["province"] | null
): ZipLookupRes["province"] =>
  ensureArray(items).map((province) => ({
    provinceId: toString(province.provinceId),
    provinceName: toString(province.provinceName),
  }));

const sanitizeCityEntry = (
  items?: ZipLookupRes["city"] | null
): ZipLookupRes["city"] =>
  ensureArray(items).map((city) => ({
    cityId: toString(city.cityId),
    cityName: toString(city.cityName),
  }));

const sanitizeDistrictEntry = (
  items?: ZipLookupRes["district"] | null
): ZipLookupRes["district"] =>
  ensureArray(items).map((district) => ({
    districtId: toString(district.districtId),
    districtName: toString(district.districtName),
  }));

const sanitizeSubdistrictEntry = (
  items?: ZipLookupRes["subdistrict"] | null
): ZipLookupRes["subdistrict"] =>
  ensureArray(items).map((subdistrict) => ({
    subdistrictId: toString(subdistrict.subdistrictId),
    subdistrictName: toString(subdistrict.subdistrictName),
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
  docId: toString(payload?.docId),
  riplayURL: toString(payload?.riplayURL),
});

export const mapCreateSpajResponse = (payload?: CreateSPAJRes | null): CreateSPAJRes => ({
  id: toString(payload?.id),
  spajNumber: toString(payload?.spajNumber),
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

