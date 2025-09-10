import { api } from "@/lib/api"
import type { ApiEnvelope, Province, City, District, Subdistrict } from "@/api/types"

export type Option = { code: string; name: string }

// Map backend shapes to generic option list
const mapProvinces = (items: Province[]): Option[] =>
  items.map((p) => ({ code: String(p.provinceId), name: p.provinceName }))
const mapCities = (items: City[]): Option[] =>
  items.map((c) => ({ code: String(c.cityId), name: c.cityName }))
const mapDistricts = (items: District[]): Option[] =>
  items.map((d) => ({ code: String(d.districtId), name: d.districtName }))
const mapSubdistricts = (items: Subdistrict[]): Option[] =>
  items.map((s) => ({ code: String(s.subdistrictId), name: s.subdistrictName }))

export const getProvinces = async (): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<Province[]>>("/microsite/province")
  return mapProvinces(data.data)
}

export const getCities = async (provinceId: string): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<City[]>>(
    `/microsite/province/${provinceId}/city`
  )
  return mapCities(data.data)
}

export const getDistricts = async (
  provinceId: string,
  cityId: string
): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<District[]>>(
    `/microsite/province/${provinceId}/city/${cityId}/district`
  )
  return mapDistricts(data.data)
}

export const getSubdistricts = async (
  provinceId: string,
  cityId: string,
  districtId: string
): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<Subdistrict[]>>(
    `/microsite/province/${provinceId}/city/${cityId}/district/${districtId}/subdistrict`
  )
  return mapSubdistricts(data.data)
}
