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

  // PRODUCTS
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
      responseCode: "00",
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
      responseCode: "00",
      responseMessage: detail ? "OK" : "NOT_FOUND",
      data: { products: detail ? [detail] : [] },
    })
  }),

  // PREMIUM COMPUTE
  http.post(url("/microsite/:slug/compute-premium"), async ({ request }) => {
    const body = (await request.json()) as {
      productCode: string
      packageId: number | string
      policyTermId: number | string
    }

    // Simple mock: derive premium by tier and term
    // SIL/GLD/PLT → 6M: 18k/30k/42k, 12M: 32k/48k/72k
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
      responseCode: "00",
      responseMessage: "OK",
      data: {
        premiumAmount: amount,
        ujrohAmount: 0,
        tabaruAmount: 0,
      },
    })
  }),
]
