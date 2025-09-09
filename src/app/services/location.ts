import { api } from "@/lib/api"

export type Option = { code: string; name: string }

export const getProvinces = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/locations/provinces")
  return data
}

export const getCities = async (province: string): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/locations/cities", { params: { province } })
  return data
}

export const getDistricts = async (city: string): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/locations/districts", { params: { city } })
  return data
}

export const getSubdistricts = async (district: string): Promise<Option[]> => {
  const { data } = await api.get<Option[]>("/locations/subdistricts", { params: { district } })
  return data
}