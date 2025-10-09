import { delay, http, HttpResponse } from "msw"
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
    if (slug) items = items.filter((p) => p.microsite_id === slug)
    if (search) {
      items = items.filter(
        (p) =>
          p.product_name.toLowerCase().includes(search) ||
          p.product_code.toLowerCase().includes(search) ||
          p.desc.toLowerCase().includes(search)
      )
    }

    return HttpResponse.json({
      responseCode: "200",
      responseMessage: "OK",
      data: items,
    })
  }),

  http.get(url("/microsite/:slug/products/:product_code"), ({ request }) => {
    const u = new URL(request.url)
    const path = u.pathname
    const m = path.match(/\/microsite\/([^/]+)\/products\/([^/]+)/i)
    const product_code = m?.[2]
    const detail = product_code ? mock.productDetails[product_code] : undefined

    return HttpResponse.json({
      responseCode: "200",
      responseMessage: detail ? "OK" : "NOT_FOUND",
      data: { products: detail ? [detail] : [] },
    })
  }),

  http.get(url("/microsite/:slug/bank-branches"), () => {
    const data = (mock.branches || []).map(b => ({
      branch_id: b.code,
      desc_item: b.name,
      short_desc: b.name,
      long_desc: b.name,
    }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/:slug/compute-premium"), async ({ request }) => {
    const body = (await request.json()) as {
      product_code: string
      package_id: number | string
      policyterm_id: number | string
    }
    const details = mock.productDetails[body.product_code]
    const pkg = details?.packages.find(p => String(p.package_id) === String(body.package_id))
    const term = details?.terms.find(t => String(t.term_id) === String(body.policyterm_id))
    const code = pkg?.package_code ?? "SIL"
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
        premium_amount: amount,
        ujroh_amount: 0,
        tabaru_amount: 0,
      },
    })
  }),

  http.get(url("/microsite/address-by-zip"), ({ request }) => {
    const u = new URL(request.url)
    const q = u.searchParams.get("q") || ""
    const res = {
      province: [{ province_id: "dki", province_name: "DKI Jakarta" }],
      city: [{ city_id: "jaksel", city_name: "Kota Jakarta Selatan" }],
      district: [{ district_id: "keb_baru", district_name: "Kebayoran Baru" }],
      subdistrict: [{ subdistrict_id: "gunung", subdistrict_name: "Kel. Gunung" }],
    }
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data: res })
  }),

  http.get(url("/microsite/province"), () => {
    const data = (mock.provinces || []).map(p => ({ province_id: p.code, province_name: p.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
  http.get(url("/microsite/province/:province_id/city"), ({ params }) => {
    const prov = String(params.province_id ?? "")
    const items = mock.cities[prov] || []
    const data = items.map(c => ({ city_id: c.code, city_name: c.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
  http.get(url("/microsite/province/:province_id/city/:city_id/district"), ({ params }) => {
    const city = String(params.city_id ?? "")
    const items = mock.districts[city] || []
    const data = items.map(d => ({ district_id: d.code, district_name: d.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
  http.get(url("/microsite/province/:province_id/city/:city_id/district/:district_id/subdistrict"), ({ params }) => {
    const dist = String(params.district_id ?? "")
    const items = mock.subdistricts[dist] || []
    const data = items.map(s => ({ subdistrict_id: s.code, subdistrict_name: s.name }))
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.get(url("/microsite/:slug/product/:product_code/question"), ({ request }) => {
    const u = new URL(request.url)
    const type = u.searchParams.get("type") || ""
    
    const data = mock.questionList.filter((e)=> e.type === type) ?? []
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/:slug/product/:product_code/generate-riplay"), async ({ request }) => {
    const data = mock.generateRiplay
    // await delay(10_000);
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/proposal/create-spaj"), async () => {
    const data = mock.createSPAJ
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/proposal/submit"), async () => {
    const data = { sucess: true }
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.get(url("/microsite/proposal/:spaj_number/status"), async () => {
    const data = { status: 'CLEAN' }
    await delay(10_000);
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/payment"), async () => {
    const data = mock.payment
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),

  http.post(url("/microsite/check-availability"), async () => {
    const data = mock.checkAvailability
    return HttpResponse.json({ responseCode: "200", responseMessage: "OK", data })
  }),
]
