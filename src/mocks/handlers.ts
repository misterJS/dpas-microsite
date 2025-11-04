import { delay, http, HttpResponse } from "msw"
import * as mock from "./data"

const url = (p: string) => `*${p}`
var statusCount = 0

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
    if (search) {
      items = items.filter(
        (p) =>
          p.product_name.toLowerCase().includes(search) ||
          p.product_code.toLowerCase().includes(search) ||
          p.desc.toLowerCase().includes(search)
      )
    }

    return HttpResponse.json({
      response_code: "200",
      response_message: "OK",
      data: items,
    })
  }),

  http.get(url("/microsite/:slug/products/:product_code"), ({ request }) => {
    const u = new URL(request.url)
    const path = u.pathname
    const m = path.match(/\/microsite\/([^/]+)\/products\/([^/]+)/i)
    const product_code = m?.[2]
    const detail = product_code ? mock.productDetails[product_code] : {}

    return HttpResponse.json({
      response_code: "200",
      response_message: detail ? "OK" : "NOT_FOUND",
      data: { ...detail },
    })
  }),

  http.get(url("/microsite/:slug/bank-branches"), () => {
    const data = mock.branches
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.post(url("/microsite/:slug/compute-premium"), async ({ request }) => {
    const body = (await request.json()) as {
      product_code: string
      package_id: number | string
      policy_term_id: number | string
    }
    const details = mock.productDetails[body.product_code]
    const pkg = details?.packages.find(p => String(p.package_id) === String(body.package_id))
    const term = details?.terms.find(t => String(t.term_id) === String(body.policy_term_id))
    const code = pkg?.package_code

    const premium_table: any = {
      T4A1: {
        6: 18000,
        12: 32000,
      },
      T4A3: {
        6: 30000,
        12: 48000,
      },
      T4A5: {
        6: 42000,
        12: 72000,
      },
      T4B1: {
        1: 12000,
        3: 12000,
        6: 12000,
        12: 12000,
      }
    }

    const premium_of_product = premium_table[code ?? ""] || {}
    const amount = premium_of_product[term?.term ?? ""] || 0

    return HttpResponse.json({
      response_code: "200",
      response_message: "OK",
      data: {
        premium_amount: amount,
        ujroh_amount: amount,
        tabaru_amount: amount,
      },
    })
  }),

  http.get(url("/microsite/address-by-zip"), ({ request }) => {
    const u = new URL(request.url)
    const q = u.searchParams.get("q") || ""
    const res = [
    {
      "id": 25211,
      "zip_code": "12910",
      "subdistrict_id": 25201,
      "subdistrict_name": "SETIABUDI",
      "district_id": 1929,
      "district_name": "SETIA BUDI",
      "city_id": 155,
      "city_name": "JAKARTA SELATAN",
      "province_id": 11,
      "province_name": "DKI JAKARTA",
      "province_las_code": "DIJKT"
    }
  ]
    return HttpResponse.json({ response_code: "200", response_message: "OK", data: res })
  }),

  http.get(url("/microsite/province"), () => {
    const data = mock.provinces
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),
  http.get(url("/microsite/province/:province_id/city"), ({ params }) => {
    const prov = String(params.province_id ?? "")
    const items = mock.cities[prov] || []
    const data = items
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),
  http.get(url("/microsite/province/:province_id/city/:city_id/district"), ({ params }) => {
    const city = String(params.city_id ?? "")
    const items = mock.districts[city] || []
    const data = items
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),
  http.get(url("/microsite/province/:province_id/city/:city_id/district/:district_id/subdistrict"), ({ params }) => {
    const dist = String(params.district_id ?? "")
    const items = mock.subdistricts[dist] || []
    const data = items
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.get(url("/microsite/:slug/products/:product_code/question"), ({ request }) => {
    const u = new URL(request.url)
    const type = u.searchParams.get("type") || ""
    
    const data = mock.questionList.filter((e)=> e.type === type) ?? []
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.post(url("/microsite/:slug/products/:product_code/generate-riplay"), async ({ request }) => {
    const data = mock.generateRiplay
    // await delay(10_000);
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.post(url("/proposal/create-spaj"), async () => {
    const data = mock.createSPAJ
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.post(url("/proposal/submit"), async () => {
    const data = { success: true }
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.get(url("/proposal/:spaj_number/status"), async () => {
    const data = { status: statusCount > 1 ? 'CLEAN' : 'PENDING' }
    if (statusCount > 1) statusCount = 0
    else statusCount++;
    // await delay(10_000);
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.get(url("/payment/:spaj_number"), async () => {
    console.log(">>> mock payment called")
    const data = mock.payment
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),

  http.post(url("/check-availability"), async () => {
    const data = mock.checkAvailability
    return HttpResponse.json({ response_code: "200", response_message: "OK", data })
  }),
]
