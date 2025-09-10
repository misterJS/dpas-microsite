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

export const useDistricts = (province?: string, city?: string) =>
  useQuery({
    queryKey: ["districts", province, city],
    queryFn: () => getDistricts(province!, city!),
    enabled: !!province && !!city,
  })

export const useSubdistricts = (province?: string, city?: string, district?: string) =>
  useQuery({
    queryKey: ["subdistricts", province, city, district],
    queryFn: () => getSubdistricts(province!, city!, district!),
    enabled: !!province && !!city && !!district,
  })
