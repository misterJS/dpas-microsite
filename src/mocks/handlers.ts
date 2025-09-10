import { http, HttpResponse } from "msw"
import * as mock from "./data"

const url = (p: string) => `*${p}`

export const handlers = [
  http.get(url("/branches"), () => HttpResponse.json(mock.branches)),

  http.get(url("/locations/provinces"), () => HttpResponse.json(mock.provinces)),

  http.get(url("/locations/cities"), ({ request }) => {
    const u = new URL(request.url)
    const prov = u.searchParams.get("province") ?? ""
    return HttpResponse.json(mock.cities[prov] ?? [])
  }),

  http.get(url("/locations/districts"), ({ request }) => {
    const u = new URL(request.url)
    const city = u.searchParams.get("city") ?? ""
    return HttpResponse.json(mock.districts[city] ?? [])
  }),

  http.get(url("/locations/subdistricts"), ({ request }) => {
    const u = new URL(request.url)
    const dist = u.searchParams.get("district") ?? ""
    return HttpResponse.json(mock.subdistricts[dist] ?? [])
  }),

  http.get(url("/jobs"), () => HttpResponse.json(mock.jobs)),
  http.get(url("/salaries"), () => HttpResponse.json(mock.salaries)),

  http.post(url("/benefit/quote"), async ({ request }) => {
    const body = (await request.json()) as {
      planType: "silver" | "gold" | "platinum"
      coverage: "6" | "12"
    }
    const base = { silver: 18000, gold: 36000, platinum: 54000 }[body.planType]
    const price = body.coverage === "12" ? base * 2 : base
    return HttpResponse.json({
      currency: "IDR",
      amount: price,
      formatted: `Rp ${price.toLocaleString("id-ID")}`,
    })
  }),

  http.post(url("/consents"), async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ok: true, received: body })
  }),

  http.get(url("/microsite/:slug/products"), ({ request }) => {
    const u = new URL(request.url)
    const path = u.pathname
    const m = path.match(/\/microsite\/([^/]+)\/products/i)
    const slug = m?.[1]
    const search = (u.searchParams.get("search") ?? "").toLowerCase()

    let items = mock.productList
    if (slug) items = items.filter((p) => p.micrositeId === slug)
    if (search) {
      items = items.filter(
        (p) =>
          p.productName.toLowerCase().includes(search) ||
          p.productCode.toLowerCase().includes(search) ||
          p.desc.toLowerCase().includes(search)
      )
    }

    return HttpResponse.json({
      responseCode: "200",
      responseMessage: "OK",
      data: items,
    })
  }),

  http.get(url("/microsite/:slug/products/:productCode"), ({ request }) => {
    const u = new URL(request.url)
    const path = u.pathname
    const m = path.match(/\/microsite\/([^/]+)\/products\/([^/]+)/i)
    const productCode = m?.[2]
    const detail = productCode ? mock.productDetails[productCode] : undefined

    return HttpResponse.json({
      responseCode: "200",
      responseMessage: detail ? "OK" : "NOT_FOUND",
      data: { products: detail ? [detail] : [] },
    })
  }),

  http.get(url("/microsite/:slug/bank-branches"), () => {
    const data = (mock.branches || []).map(b => ({
      branchId: b.code,
      descItem: b.name,
      shortDesc: b.name,
      longDesc: b.name,
    }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/:slug/compute-premium"), async ({ request }) => {
    const body = (await request.json()) as {
      productCode: string
      packageId: number | string
      policyTermId: number | string
    }
    const details = mock.productDetails[body.productCode]
    const pkg = details?.packages.find(p => String(p.packageId) === String(body.packageId))
    const term = details?.terms.find(t => String(t.termId) === String(body.policyTermId))
    const code = pkg?.packageCode ?? "SIL"
    const is12 = term?.term === 12
    const amount = (() => {
      if (code === "PLT") return is12 ? 72000 : 42000
      if (code === "GLD") return is12 ? 48000 : 30000
      return is12 ? 32000 : 18000
    })()

    return HttpResponse.json({
      responseCode: "200",
      responseMessage: "OK",
      data: {
        premiumAmount: amount,
        ujrohAmount: 0,
        tabaruAmount: 0,
      },
    })
  }),

  http.get(url("/microsite/address-by-zip"), ({ request }) => {
    const u = new URL(request.url)
    const q = u.searchParams.get("q") || ""
    const res = {
      province: [{ provinceId: "dki", provinceName: "DKI Jakarta" }],
      city: [{ cityId: "jaksel", cityName: "Kota Jakarta Selatan" }],
      district: [{ districtId: "keb_baru", districtName: "Kebayoran Baru" }],
      subdistrict: [{ subdistrictId: "gunung", subdistrictName: "Kel. Gunung" }],
    }
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data: res })
  }),

  http.get(url("/microsite/province"), () => {
    const data = (mock.provinces || []).map(p => ({ provinceId: p.code, provinceName: p.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
  http.get(url("/microsite/province/:provinceId/city"), ({ params }) => {
    const prov = String(params.provinceId ?? "")
    const items = mock.cities[prov] || []
    const data = items.map(c => ({ cityId: c.code, cityName: c.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
  http.get(url("/microsite/province/:provinceId/city/:cityId/district"), ({ params }) => {
    const city = String(params.cityId ?? "")
    const items = mock.districts[city] || []
    const data = items.map(d => ({ districtId: d.code, districtName: d.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
  http.get(url("/microsite/province/:provinceId/city/:cityId/district/:districtId/subdistrict"), ({ params }) => {
    const dist = String(params.districtId ?? "")
    const items = mock.subdistricts[dist] || []
    const data = items.map(s => ({ subdistrictId: s.code, subdistrictName: s.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.get(url("/microsite/:slug/product/:productCode/question"), () => {
    const data = [
      { questionId: "Q1", questionCode: "HEALTH_Q1", questionText: "Apakah Calon Peserta Yang Diasuransikan pernah mengalami gejala-gejala/diperiksa/menderita/diagnosis/mendapat pengobatan/disarankan atau menjalani rawat inap/menjalani operasi/dianjurkan untuk mendapat nasihat medis/telah mendapat nasihat medis atau dirujuk ke Dokter Spesialis untuk Paru/Gangguan Pernafasan/Gangguan Hati/Kanker/Tumor/Stroke/Serangan Jantung atau Penyakit Jantung lainnya/Kelainan Darah/HIV Positif/AIDS atau yang berhubungan dengan AIDS/Gangguan Mental atau Jiwa/Kelainan Bawaan lainnya/Penyakit Ginjal/Kencing Manis/Epilepsi/Kelainan Muskuloskeletal/Tekanan Darah Tinggi/Kelainan Hormonal?", questionAnswerType: "YES_NO" },
      { questionId: "Q2", questionCode: "HEALTH_Q2", questionText: "Apakah Surat Pengajuan Asuransi Jiwa atas diri Calon Peserta Yang Diasuransikan pernah dikecualikan/ditangguhkan/ditolak/diterima dengan tingkat Kontribusi khusus?", questionAnswerType: "YES_NO" },
    ]
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
]
