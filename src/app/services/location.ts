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
  type OptionProvince,
} from "@/api/mappers";

export const getProvinces = async (): Promise<OptionProvince[]> => {
  const { data } = await api.get<ApiEnvelope<Province[]>>("/microsite/province");
  
  return mapProvinceOptions(data.data);
};

export const getCities = async (province_id: string): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<City[]>>(
    `/microsite/province/${province_id}/city`
  );
  return mapCityOptions(data.data);
};

export const getDistricts = async (
  province_id: string,
  city_id: string
): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<District[]>>(
    `/microsite/province/${province_id}/city/${city_id}/district`
  );
  return mapDistrictOptions(data.data);
};

export const getSubdistricts = async (
  province_id: string,
  city_id: string,
  district_id: string
): Promise<Option[]> => {
  const { data } = await api.get<ApiEnvelope<Subdistrict[]>>(
    `/microsite/province/${province_id}/city/${city_id}/district/${district_id}/subdistrict`
  );
  return mapSubdistrictOptions(data.data);
};
