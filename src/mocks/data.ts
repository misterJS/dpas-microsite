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
