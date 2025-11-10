import { api } from "@/lib/api";
import { getProvinces, getCities, getDistricts, getSubdistricts } from "./location";
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

jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn()
  }
}));

jest.mock('@/api/mappers', () => ({
  mapProvinceOptions: jest.fn(),
  mapCityOptions: jest.fn(),
  mapDistrictOptions: jest.fn(),
  mapSubdistrictOptions: jest.fn(),
}));

const mockedApi = api.get as jest.Mock;
const mockedProvinceResponse = mapProvinceOptions as jest.Mock;
const mockedCityResponse = mapCityOptions as jest.Mock;
const mockedDistrictResponse = mapDistrictOptions as jest.Mock;
const mockedSubDistrictResponse = mapSubdistrictOptions as jest.Mock;

describe('getProvinces', () => {
  const mockProvinces: Province[] = [
    { province_id: '1', province_name: 'ACEH' },
    { province_id: '2', province_name: 'SUMATERA UTARA' },
  ];

  const mockApiResponse: ApiEnvelope<Province[]> = {
    response_code: '200',
    response_message: 'OK',
    data: mockProvinces,
  };

  const mappedOptions: Option[] = [
    { code: '1', name: 'Jawa Barat' },
    { code: '2', name: 'Jawa Timur' },
  ];

  it('should fetch provinces and map them correctly', async () => {
    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedProvinceResponse.mockReturnValue(mappedOptions);

    const result = await getProvinces();

    expect(mockedApi).toHaveBeenCalledWith('/microsite/province');
    expect(mockedProvinceResponse).toHaveBeenCalledWith(mockProvinces);
    expect(result).toEqual(mappedOptions);
  });

  it('should return empty array when API returns null data', async () => {
    const nullApiResponse: ApiEnvelope<Province[] | null> = {
      response_code: '200',
      response_message: 'OK',
      data: null,
    };

    mockedApi.mockResolvedValue({ data: nullApiResponse });
    mockedProvinceResponse.mockReturnValue([]);

    const result = await getProvinces();

    expect(mockedApi).toHaveBeenCalledWith('/microsite/province');
    expect(mockedProvinceResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockedApi.mockRejectedValue(new Error('Network Error'));
    await expect(getProvinces()).rejects.toThrow('Network Error');
    expect(mockedApi).toHaveBeenCalledWith('/microsite/province');
  });
});

describe('getCities', () => {
  const mockProvinceId = '11';
  const mockCities: City[] = [
    { city_id: '152', city_name: 'JAKARTA UTARA' },
    { city_id: '153', city_name: 'JAKARTA BARAT' },
  ];
  const mockApiResponse: ApiEnvelope<City[]> = {
    response_code: '200',
    response_message: 'OK',
    data: mockCities,
  };

  const mappedOptions: Option[] = [
    { code: '152', name: 'JAKARTA UTARA' },
    { code: '153', name: 'JAKARTA BARAT' },
  ];

  it('should fetch cities and map them correctly', async () => {
    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedCityResponse.mockReturnValue(mappedOptions);

    const result = await getCities(mockProvinceId);

    expect(mockedApi).toHaveBeenCalledWith(`/microsite/province/${mockProvinceId}/city`);
    expect(mockedCityResponse).toHaveBeenCalledWith(mockCities);
    expect(result).toEqual(mappedOptions);
  });

  it('should return empty array when API returns null data', async () => {
    const nullApiResponse: ApiEnvelope<City[] | null> = {
      response_code: '200',
      response_message: 'Success',
      data: null,
    };

    mockedApi.mockResolvedValue({ data: nullApiResponse });
    mockedCityResponse.mockReturnValue([]);

    const result = await getCities(mockProvinceId);

    expect(mockedApi).toHaveBeenCalledWith(`/microsite/province/${mockProvinceId}/city`);
    expect(mockedCityResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockedApi.mockRejectedValue(new Error('Network Error'));
    await expect(getCities(mockProvinceId)).rejects.toThrow('Network Error');
    expect(mockedApi).toHaveBeenCalledWith(`/microsite/province/${mockProvinceId}/city`);
  });
});

describe('getDistricts', () => {
  const mockProvinceId = '11';
  const mockCityId = '155';

  const mockDistricts: District[] = [
    { district_id: '1902', district_name: 'MAMPANG PRAPATAN' },
    { district_id: '1905', district_name: 'PESANGGRAHAN' },
  ];

  const mockApiResponse: ApiEnvelope<District[]> = {
    response_code: '200',
    response_message: 'OK',
    data: mockDistricts,
  };

  const mappedOptions: Option[] = [
    { code: '1902', name: 'MAMPANG PRAPATAN' },
    { code: '1905', name: 'PESANGGRAHAN' },
  ];

  it('should fetch districts and map them correctly', async () => {
    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedDistrictResponse.mockReturnValue(mappedOptions);

    const result = await getDistricts(mockProvinceId, mockCityId);

    expect(mockedApi).toHaveBeenCalledWith(
      `/microsite/province/${mockProvinceId}/city/${mockCityId}/district`
    );
    expect(mockedDistrictResponse).toHaveBeenCalledWith(mockDistricts);
    expect(result).toEqual(mappedOptions);
  });

  it('should return empty array when API returns null data', async () => {
    const nullApiResponse: ApiEnvelope<District[] | null> = {
      response_code: '200',
      response_message: 'OK',
      data: null,
    };

    mockedApi.mockResolvedValue({ data: nullApiResponse });
    mockedDistrictResponse.mockReturnValue([]);

    const result = await getDistricts(mockProvinceId, mockCityId);

    expect(mockedApi).toHaveBeenCalledWith(
      `/microsite/province/${mockProvinceId}/city/${mockCityId}/district`
    );
    expect(mockedDistrictResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockedApi.mockRejectedValue(new Error('Network Error'));

    await expect(getDistricts(mockProvinceId, mockCityId)).rejects.toThrow('Network Error');
    expect(mockedApi).toHaveBeenCalledWith(
      `/microsite/province/${mockProvinceId}/city/${mockCityId}/district`
    );
  });
});

describe('getSubdistricts', () => {
  const mockProvinceId = '11';
  const mockCityId = '155';
  const mockDistrictId = '1929';

  const mockSubdistricts: Subdistrict[] = [
    { subdistrict_id: '25034', subdistrict_name: 'GUNTUR' },
    { subdistrict_id: '25066', subdistrict_name: 'KARET KUNINGAN' },
  ];

  const mockApiResponse: ApiEnvelope<Subdistrict[]> = {
    response_code: '200',
    response_message: 'OK',
    data: mockSubdistricts,
  };

  const mappedOptions: Option[] = [
    { code: '25034', name: 'GUNTUR' },
    { code: '25066', name: 'KARET KUNINGAN' },
  ];

  it('should fetch subdistricts and map them correctly', async () => {
    mockedApi.mockResolvedValue({ data: mockApiResponse });
    mockedSubDistrictResponse.mockReturnValue(mappedOptions);

    const result = await getSubdistricts(mockProvinceId, mockCityId, mockDistrictId);

    expect(mockedApi).toHaveBeenCalledWith(
      `/microsite/province/${mockProvinceId}/city/${mockCityId}/district/${mockDistrictId}/subdistrict`
    );
    expect(mockedSubDistrictResponse).toHaveBeenCalledWith(mockSubdistricts);
    expect(result).toEqual(mappedOptions);
  });

  it('should return empty array when API returns null data', async () => {
    const nullApiResponse: ApiEnvelope<Subdistrict[] | null> = {
      response_code: '200',
      response_message: 'OK',
      data: null,
    };

    mockedApi.mockResolvedValue({ data: nullApiResponse });
    mockedSubDistrictResponse.mockReturnValue([]);

    const result = await getSubdistricts(mockProvinceId, mockCityId, mockDistrictId);

    expect(mockedApi).toHaveBeenCalledWith(
      `/microsite/province/${mockProvinceId}/city/${mockCityId}/district/${mockDistrictId}/subdistrict`
    );
    expect(mockedSubDistrictResponse).toHaveBeenCalledWith(null);
    expect(result).toEqual([]);
  });

  it('should throw error when API call fails', async () => {
    mockedApi.mockRejectedValue(new Error('Network Error'));

    await expect(getSubdistricts(mockProvinceId, mockCityId, mockDistrictId)).rejects.toThrow('Network Error');
    expect(mockedApi).toHaveBeenCalledWith(
      `/microsite/province/${mockProvinceId}/city/${mockCityId}/district/${mockDistrictId}/subdistrict`
    );
  });
});