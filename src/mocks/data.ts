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
      group_label: "Pengecualian",
      group_order: 1
  },
  {
      id: "3",
      code: "CS1",
      question_order: 2,
      question_text: "Pengelola tidak akan membayarkan klaim Manfaat PRULindungi Syariah atas beban Dana Tabarru’ yang disebabkan oleh:(1) Kondisi Yang Telah Ada Sebelumnya;(2) Bunuh diri, percobaan bunuh diri atau dugaan bunuh diri atau melukai diri sendiri oleh Peserta Yang Diasuransikan, Kejahatan atau percobaan kejahatan atau pelanggaran hukum atau percobaan pelanggaran hukum dan undang-undang oleh Peserta Yang Diasuransikan atau perlawanan yang dibuat oleh Peserta Yang Diasuransikan pada saat penahanan seseorang yang dijalankan oleh pihak yang berwenang, kecuali dibuktikan sebaliknya oleh keputusan pengadilan;(3) Terlibat dalam penugasan dinas militer atau kepolisian atau penerbangan non-komersial atau aktivitas olahraga berbahaya (bungee jumping, diving, balapan jenis apa pun, olahraga udara termasuk gantole, balon udara, terjun payung dan sky diving atau kegiatan serta olahraga berbahaya lainnya);(4) Biaya Rawat Inap terkait dengan kehamilan atau melahirkan atau kesuburan atau mempercantik diri sendiri atau cacat yang sudah diderita sebelumnya atau operasi katarak atau biaya non-medis;(5) Klaim yang timbul dalam Masa Tunggu, kecuali karena Kecelakaan;(6) Penyakit yang disebabkan oleh HIV / AIDS atau semua jenis kanker;(7) Peserta Yang Diasuransikan di bawah pengaruh atau terlibat dalam penyalahgunaan narkotika, psikotropika, alkohol, racun, gas, bahan sejenis, atau obat, kecuali apabila zat atau bahan tersebut digunakan sebagai obat dalam resep Dokter; atau(8) Penyakit yang telah ditentukan oleh Pengelola selama periode waktu menunggu 180 (seratus delapan puluh) hari dari Tanggal Mulai Kepesertaan, antara lain, TBC (Tuberculosis) dan Asma; radang empedu, batu empedu, Penyakit yang berhubungan dengan ginjal, kencing manis (Diabetes Mellitus), liver, tekanan darah tinggi atau penyakit jantung dan pembuluh darah; Epilepsi, tumor pada permukaan kulit, semua jenis tumor jinak, Haemorrhoids (wasir), Anal Fistulae, usus buntu, Semua bentuk Hernia, Amandel dengan tidakan operasi, Penyakit peningkatan fungsi kelenjar gondok, kelainan sekat rongga hidung yang memerlukan pembedahan, sinusitis, penyakit yang berhubungan dengan sistem reproduksi, Hallux Valgus.Pengecualian secara lengkap dapat dilihat pada ketentuan Polis PRULindungi Syariah.",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya, Saya telah membaca dan memahami.",
      no_label: "Tidak, Saya belum membaca dan memahami.",
      group_type: "EXCEPTION",
      group_label: "Pengecualian",
      group_order: 1
  },
  {
      id: "4",
      code: "CS2",
      question_order: 1,
      question_text: "Dengan ini SAYA dan/atau Calon Peserta Yang Diasuransikan dan/atau Calon Pembayar Kontribusi dan/atau Calon Penerima Manfaat yang diwakilkan  oleh SAYA: Menyatakan telah membaca, mendapat penjelasan dari Tenaga Pemasar, memahami dan menyetujui serta memberikan izin kepada Prudential Syariah  untuk mengumpulkan, menyimpan, memproses, mempergunakan dan membagikan Data Pribadi (termasuk namun tidak terbatas pada nama, alamat  surat menyurat, alamat email, nomor telepon, kontak, data kesehatan maupun informasi lainnya) yang SAYA berikan dalam SPAJ Syariah ini dan  dokumen lainnya sehubungan dengan pengajuan asuransi ini, serta informasi terkait Polis SAYA jika pengajuan ini disetujui, sesuai dengan kebijakan  internal Prudential Syariah maupun peraturan perundang-undangan yang berlaku untuk keperluan:",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya",
      no_label: "Tidak",
      group_type: "AGREEMENT",
      group_label: "PERSETUJUAN PEMBERIAN DATA DAN/ATAU INFORMASI PRIBADI KEPADA PIHAK LAIN & PENAWARAN PRODUK",
      group_order: 2
  },
  {
      id: "5",
      code: "CS3",
      question_order: 2,
      question_text: "Saya dan/atau Calon Peserta Yang Diasuransikan bersedia menerima penawaran produk lainnya (yang tidak berhubungan dengan produk yang Saya miliki) dari Prudential Syariah dan Prudential Indonesia melalui sarana komunikasi  pribadi, baik yang dilakukan sendiri oleh Prudential Syariah dan Prudential Indonesia maupun oleh pihak ketiga atau mitra bisnis yang ditunjuk oleh atau bekerjasama dengan Prudential Syariah dan Prudential Indonesia.",
      type: "CONSENT",
      answer_type: "YES_NO",
      yes_label: "Ya",
      no_label: "Tidak",
      group_type: "AGREEMENT",
      group_label: "PERSETUJUAN PEMBERIAN DATA DAN/ATAU INFORMASI PRIBADI KEPADA PIHAK LAIN & PENAWARAN PRODUK",
      group_order: 2
  },
  {
      id: "5",
      code: "CS4",
      question_order: 1,
      question_text: "Pastikan Anda membaca dan memahami Syarat dan Ketentuan sebelum mengajukan kepesertaan. Harap pastikan bahwa Anda telah membaca dan memahami Syarat dan Ketentuan Produk Asuransi Jiwa PRULindungi Syariah untuk melanjutkan proses pengajuan kepesertaan.",
      type: "CONSENT",
      answer_type: "YES",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "STATEMENT",
      group_label: "Pernyataan kepersertaan Asuransi Jiwa PRULindungi Syariah",
      group_order: 3
  },
  {
      id: "6",
      code: "CS5",
      question_order: 2,
      question_text: "Saya mengizinkan Prudential Syariah untuk melakukan tindakan yang dianggap perlu sesuai peraturan perundangan mengenai Anti Pencucian Uang, Pencegahan Pendanaan Terorisme, dan Pencegahan Pendanaan Proliferasi Senjata Pemusnah Massal serta ketentuan Grup Prudential terkait Penerapan Daftar Sanksi Tertentu yang termasuk namun tidak terbatas pada, the Office of Financial Sanctions Implementation HM Treasury, the United Nations, the European Union, the US Treasury Department Office of Foreign Assets Control.",
      type: "CONSENT",
      answer_type: "YES",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "STATEMENT",
      group_label: "Pernyataan kepersertaan Asuransi Jiwa PRULindungi Syariah",
      group_order: 3
  },
  {
      id: "7",
      code: "CS6",
      question_order: 3,
      question_text: "Dengan menyetujui form ini, Saya setuju untuk mengikuti kepesertaan pada Produk PRULindungi Syariah dari PT Prudential Sharia Life Assurance (Prudential Syariah) yang telah dilaporkan dan mendapatkan persetujuan dari Otoritas Jasa Keuangan (OJK).",
      type: "CONSENT",
      answer_type: "YES",
      yes_label: "Ya, Saya Setuju",
      no_label: "",
      group_type: "STATEMENT",
      group_label: "Pernyataan kepersertaan Asuransi Jiwa PRULindungi Syariah",
      group_order: 3
  },
]
