export type Option = { code: string; name: string }

export const branches: Option[] = [
  { code: "thamrin", name: "UOB Thamrin" },
  { code: "kelapa_gading", name: "UOB Kelapa Gading" },
  { code: "bsd", name: "UOB BSD" },
  { code: "pondok_indah", name: "UOB Pondok Indah" },
]

export const provinces: Option[] = [
  { code: "dki", name: "DKI Jakarta" },
  { code: "jabar", name: "Jawa Barat" },
  { code: "jateng", name: "Jawa Tengah" },
]

export const cities: Record<string, Option[]> = {
  dki: [
    { code: "jaksel", name: "Kota Jakarta Selatan" },
    { code: "jakpus", name: "Kota Jakarta Pusat" },
  ],
  jabar: [{ code: "depok", name: "Kota Depok" }],
  jateng: [],
}

export const districts: Record<string, Option[]> = {
  jaksel: [
    { code: "keb_baru", name: "Kebayoran Baru" },
    { code: "tebet", name: "Tebet" },
  ],
}

export const subdistricts: Record<string, Option[]> = {
  keb_baru: [
    { code: "gunung", name: "Kel. Gunung" },
    { code: "kramat_pela", name: "Kel. Kramat Pela" },
  ],
}

export const jobs: Option[] = [
  { code: "ob", name: "Office Boy" },
  { code: "manager", name: "Manager" },
  { code: "staff", name: "Staff" },
]

export const salaries: Option[] = [
  { code: "gol1", name: "Rp5 - 10 Juta" },
  { code: "gol2", name: "Rp10 - 20 Juta" },
  { code: "gol3", name: "Rp50 Juta >" },
]

export type ProductListItem = {
  productId: number
  productName: string
  micrositeId: string
  productCode: string
  image: string
  desc: string
}

export type ProductDetailTerm = { termId: number; term: number; termUnit: "M" | string }
export type ProductBenefit = {
  benefCode: string
  benefName: string
  benefAmount: number
  benefType: string
  notes?: string
}
export type ProductPackage = { packageId: number; packageName: string; packageCode: string; benefits: ProductBenefit[] }
export type ProductDetail = {
  productCode: string
  productName: string
  desc: string
  terms: ProductDetailTerm[]
  packages: ProductPackage[]
}

export const productList: ProductListItem[] = [
  {
    productId: 1,
    productName: "PRU Care Silver",
    micrositeId: "uob",
    productCode: "PRUCARE_S",
    image: "/images/products/prucare-silver.png",
    desc: "Perlindungan dasar kesehatan dengan premi terjangkau.",
  },
  {
    productId: 2,
    productName: "PRU Care Gold",
    micrositeId: "uob",
    productCode: "PRUCARE_G",
    image: "/images/products/prucare-gold.png",
    desc: "Perlindungan kesehatan komprehensif untuk keluarga.",
  },
  {
    productId: 3,
    productName: "PRU Care Platinum",
    micrositeId: "uob",
    productCode: "PRUCARE_P",
    image: "/images/products/prucare-platinum.png",
    desc: "Perlindungan maksimal dengan manfaat premium.",
  },
]

export const productDetails: Record<string, ProductDetail> = {
  PRUCARE_S: {
    productCode: "PRUCARE_S",
    productName: "PRU Care Silver",
    desc: "Paket Silver dengan manfaat dasar.",
    terms: [
      { termId: 101, term: 6, termUnit: "M" },
      { termId: 102, term: 12, termUnit: "M" },
    ],
    packages: [
      {
        packageId: 201,
        packageName: "Silver",
        packageCode: "SIL",
        benefits: [
          { benefCode: "IPD", benefName: "Rawat Inap", benefAmount: 10000000, benefType: "LIMIT" },
          { benefCode: "OPD", benefName: "Rawat Jalan", benefAmount: 2000000, benefType: "LIMIT" },
        ],
      },
    ],
  },
  PRUCARE_G: {
    productCode: "PRUCARE_G",
    productName: "PRU Care Gold",
    desc: "Paket Gold dengan manfaat lebih lengkap.",
    terms: [
      { termId: 103, term: 6, termUnit: "M" },
      { termId: 104, term: 12, termUnit: "M" },
    ],
    packages: [
      {
        packageId: 202,
        packageName: "Gold",
        packageCode: "GLD",
        benefits: [
          { benefCode: "IPD", benefName: "Rawat Inap", benefAmount: 20000000, benefType: "LIMIT" },
          { benefCode: "OPD", benefName: "Rawat Jalan", benefAmount: 5000000, benefType: "LIMIT" },
          { benefCode: "MTR", benefName: "Maternity", benefAmount: 3000000, benefType: "LIMIT" },
        ],
      },
    ],
  },
  PRUCARE_P: {
    productCode: "PRUCARE_P",
    productName: "PRU Care Platinum",
    desc: "Paket Platinum dengan manfaat premium.",
    terms: [
      { termId: 105, term: 6, termUnit: "M" },
      { termId: 106, term: 12, termUnit: "M" },
    ],
    packages: [
      {
        packageId: 203,
        packageName: "Platinum",
        packageCode: "PLT",
        benefits: [
          { benefCode: "IPD", benefName: "Rawat Inap", benefAmount: 50000000, benefType: "LIMIT" },
          { benefCode: "OPD", benefName: "Rawat Jalan", benefAmount: 10000000, benefType: "LIMIT" },
          { benefCode: "MTR", benefName: "Maternity", benefAmount: 7000000, benefType: "LIMIT" },
          { benefCode: "DNT", benefName: "Perawatan Gigi", benefAmount: 3000000, benefType: "LIMIT" },
        ],
      },
    ],
  },
}
