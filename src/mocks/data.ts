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
    productName: "Kecelakaan",
    micrositeId: "uob",
    productCode: "ACC",
    image: AccidentImg,
    desc: "Perlindungan yang mengutamakan Manfaat Meninggal Dunia Akibat Kecelakaan, dengan Santunan Asuransi atas risiko meninggal dunia yang diakibatkan oleh Kecelakaan hingga Rp54.000.000",
  },
  {
    productId: 2,
    productName: "Cacat Total Akibat Kecelakaan",
    micrositeId: "uob",
    productCode: "CTAK",
    image: AccidentImg,
    desc: "Perlindungan yang mengutamakan Manfaat Cacat Total Akibat Kecelakaan, dengan Santunan Asuransi atas risiko Cacat Total yang diakibatkan oleh Kecelakaan hingga Rp54.000.000.",
  },
]

export const productDetails: Record<string, ProductDetail> = {
  ACC: {
    productCode: "ACC",
    productName: "Kecelakaan",
    desc: "Perlindungan yang mengutamakan Manfaat Meninggal Dunia Akibat Kecelakaan, dengan Santunan Asuransi atas risiko meninggal dunia yang diakibatkan oleh Kecelakaan hingga Rp54.000.000",
    terms: [
      { termId: 101, term: 6, termUnit: "M" },
      { termId: 102, term: 12, termUnit: "M" },
    ],
    packages: [
      {
        packageId: 1101,
        packageName: "Silver",
        packageCode: "SIL",
        benefits: [
          { benefCode: "DEATH_ACC", benefName: "Manfaat meninggal dunia akibat kecelakaan", benefAmount: 18000000, benefType: "LIMIT" },
        ],
      },
      {
        packageId: 1102,
        packageName: "Gold",
        packageCode: "GLD",
        benefits: [
          { benefCode: "DEATH_ACC", benefName: "Manfaat meninggal dunia akibat kecelakaan", benefAmount: 36000000, benefType: "LIMIT" },
        ],
      },
      {
        packageId: 1103,
        packageName: "Platinum",
        packageCode: "PLT",
        benefits: [
          { benefCode: "DEATH_ACC", benefName: "Manfaat meninggal dunia akibat kecelakaan", benefAmount: 54000000, benefType: "LIMIT" },
        ],
      },
    ],
  },
  CTAK: {
    productCode: "CTAK",
    productName: "Cacat Total Akibat Kecelakaan",
    desc: "Santunan asuransi, memastikan dukungan finansial di saat yang tak terduga",
    terms: [
      { termId: 103, term: 6, termUnit: "M" },
      { termId: 104, term: 12, termUnit: "M" },
    ],
    packages: [
      {
        packageId: 1201,
        packageName: "Silver",
        packageCode: "SIL",
        benefits: [
          { benefCode: "TOTAL_DISABILITY_ACC", benefName: "Manfaat cacat total akibat kecelakaan", benefAmount: 6000000, benefType: "LIMIT" },
        ],
      },
      {
        packageId: 1202,
        packageName: "Gold",
        packageCode: "GLD",
        benefits: [
          { benefCode: "TOTAL_DISABILITY_ACC", benefName: "Manfaat cacat total akibat kecelakaan", benefAmount: 12000000, benefType: "LIMIT" },
        ],
      },
      {
        packageId: 1203,
        packageName: "Platinum",
        packageCode: "PLT",
        benefits: [
          { benefCode: "TOTAL_DISABILITY_ACC", benefName: "Manfaat cacat total akibat kecelakaan", benefAmount: 24000000, benefType: "LIMIT" },
        ],
      },
    ],
  },
}
import { HealthQuestion } from "@/api/types";
import AccidentImg from "@/assets/accident.png"

export const questionList: HealthQuestion[] = [
  {
      id: "1",
      code: "HQ1",
      question_order: 1,
      question_text: "Apakah Calon Peserta Yang Diasuransikan pernah mengalami gejala-gejala/diperiksa/menderita/diagnosis/mendapat pengobatan/disarankan atau menjalani rawat inap/menjalani operasi/dianjurkan untuk mendapat nasihat medis/telah mendapat nasihat medis atau dirujuk ke Dokter Spesialis untuk Paru/Gangguan Pernafasan/Gangguan Hati/Kanker/Tumor/Stroke/Serangan Jantung atau Penyakit Jantung lainnya/Kelainan Darah/HIV Positif/AIDS atau yang berhubungan dengan AIDS/Gangguan Mental atau Jiwa/Kelainan Bawaan lainnya/Penyakit Ginjal/Kencing Manis/Epilepsi/Kelainan Muskuloskeletal/Tekanan Darah Tinggi/Kelainan Hormonal?",
      type: "HEALTH_QUESTIONAIRE",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "AGREEMENT",
      group_label: "Persetujuan",
      group_order: 1
  },
  {
      id: "2",
      code: "HQ2",
      question_order: 2,
      question_text: "Apakah Surat Pengajuan Asuransi Jiwa atas diri Calon Peserta Yang Diasuransikan pernah dikecualikan/ditangguhkan/ditolak/diterima dengan tingkat Kontribusi Khusus?",
      type: "HEALTH_QUESTIONAIRE",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "AGREEMENT",
      group_label: "Persetujuan",
      group_order: 1
  },
  {
      id: "3",
      code: "CS1",
      question_order: 2,
      question_text: "URUTAN 1 NOMOR 2",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "AGREEMENT",
      group_label: "Persetujuan",
      group_order: 1
  },
  {
      id: "4",
      code: "CS3",
      question_order: 2,
      question_text: "URUTAN 2 NOMOR 2",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "COBA",
      group_label: "LABEL COBA",
      group_order: 2
  },
  {
      id: "3",
      code: "CS2",
      question_order: 1,
      question_text: "URUTAN 1 NOMOR 1",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "AGREEMENT",
      group_label: "Persetujuan",
      group_order: 1
  },
  {
      id: "4",
      code: "CS3",
      question_order: 1,
      question_text: "URUTAN 2 NOMOR 1",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "COBA",
      group_label: "LABEL COBA",
      group_order: 2
  },
]
