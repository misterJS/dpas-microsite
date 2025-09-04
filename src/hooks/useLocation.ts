import { useQuery } from "@tanstack/react-query"
import { getProvinces, getCities, getDistricts, getSubdistricts } from "@/app/services/location"

export const useProvinces = () =>
  useQuery({ queryKey: ["provinces"], queryFn: getProvinces })

export const useCities = (province?: string) =>
  useQuery({
    queryKey: ["cities", province],
    queryFn: () => getCities(province!),
    enabled: !!province,
  })

export const useDistricts = (city?: string) =>
  useQuery({
    queryKey: ["districts", city],
    queryFn: () => getDistricts(city!),
    enabled: !!city,
  })

export const useSubdistricts = (district?: string) =>
  useQuery({
    queryKey: ["subdistricts", district],
    queryFn: () => getSubdistricts(district!),
    enabled: !!district,
  })
