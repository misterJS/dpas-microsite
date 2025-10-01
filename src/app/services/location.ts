import { api } from "@/lib/api";
import type {
  ApiEnvelope,
  Province,
  City,
  District,
  Subdistrict,
} from "@/api/types";
import {
  mapProvinceOptions,
  mapCityOptions,
  mapDistrictOptions,
  mapSubdistrictOptions,
  type Option,
} from "@/api/mappers";

export const getProvinces = async (): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<Province[]>>("/microsite/province");
  return mapProvinceOptions(data.data);
};

export const getCities = async (provinceId: string): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<City[]>>(
    `/microsite/province/${provinceId}/city`
  );
  return mapCityOptions(data.data);
};

export const getDistricts = async (
  provinceId: string,
  cityId: string
): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<District[]>>(
    `/microsite/province/${provinceId}/city/${cityId}/district`
  );
  return mapDistrictOptions(data.data);
};

export const getSubdistricts = async (
  provinceId: string,
  cityId: string,
  districtId: string
): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<Subdistrict[]>>(
    `/microsite/province/${provinceId}/city/${cityId}/district/${districtId}/subdistrict`
  );
  return mapSubdistrictOptions(data.data);
};
